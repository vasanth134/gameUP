"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.getTasksByChild = exports.getTasks = exports.createTask = void 0;
const db_1 = require("../config/db");
const createTask = async (req, res) => {
    const { title, description, due_date, xp_reward, child_id, parent_id } = req.body;
    try {
        const result = await db_1.pool.query(`INSERT INTO tasks (title, description, due_date, xp_reward, child_id, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [title, description, due_date, xp_reward, child_id, parent_id]);
        res.status(201).json({
            message: '✅ Task created successfully',
            task: result.rows[0]
        });
    }
    catch (err) {
        console.error('❌ Error creating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createTask = createTask;
// Get tasks based on user role and ID
const getTasks = async (req, res) => {
    const { userId, role } = req.query;
    try {
        let result;
        if (role === 'parent') {
            // For parents, get all tasks they have created with actual status from submissions
            result = await db_1.pool.query(`
                SELECT 
                    t.id,
                    t.title,
                    t.description,
                    t.due_date,
                    t.xp_reward,
                    t.parent_id,
                    t.child_id,
                    t.created_at,
                    t.updated_at,
                    u.name as child_name,
                    COALESCE(s.status, 'not_submitted') as status,
                    s.submitted_at,
                    s.reviewed_at
                FROM tasks t 
                JOIN users u ON t.child_id = u.id 
                LEFT JOIN submissions s ON t.id = s.task_id
                WHERE t.parent_id = $1 
                ORDER BY t.created_at DESC
            `, [userId]);
        }
        else if (role === 'child') {
            // For children, get only tasks assigned to them with actual status
            result = await db_1.pool.query(`
                SELECT 
                    t.id,
                    t.title,
                    t.description,
                    t.due_date,
                    t.xp_reward,
                    t.parent_id,
                    t.child_id,
                    t.created_at,
                    t.updated_at,
                    u.name as parent_name,
                    COALESCE(s.status, 'not_submitted') as status,
                    s.submitted_at,
                    s.reviewed_at
                FROM tasks t 
                JOIN users u ON t.parent_id = u.id 
                LEFT JOIN submissions s ON t.id = s.task_id AND s.child_id = t.child_id
                WHERE t.child_id = $1 
                ORDER BY t.created_at DESC
            `, [userId]);
        }
        else {
            res.status(400).json({ error: 'Invalid role. Must be "parent" or "child"' });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('❌ Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getTasks = getTasks;
const getTasksByChild = async (req, res) => {
    const { childId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT * FROM tasks WHERE child_id = $1 ORDER BY created_at DESC`, [childId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('❌ Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getTasksByChild = getTasksByChild;
// Update task status - for parents to change task status
const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status, parentId } = req.body;
    
    try {
        // Validate status
        const validStatuses = ['not_submitted', 'pending', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ 
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
            });
            return;
        }

        // Verify the parent owns this task
        const taskCheck = await db_1.pool.query(
            'SELECT parent_id, child_id, title FROM tasks WHERE id = $1',
            [taskId]
        );

        if (taskCheck.rows.length === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        const task = taskCheck.rows[0];
        if (task.parent_id !== parseInt(parentId)) {
            res.status(403).json({ error: 'Not authorized to update this task' });
            return;
        }

        // Update the task status by updating/creating submission
        if (status === 'not_submitted') {
            // Delete any existing submission
            await db_1.pool.query(
                'DELETE FROM submissions WHERE task_id = $1 AND child_id = $2',
                [taskId, task.child_id]
            );
        } else {
            // Check if submission exists
            const existingSubmission = await db_1.pool.query(
                'SELECT id FROM submissions WHERE task_id = $1 AND child_id = $2',
                [taskId, task.child_id]
            );

            if (existingSubmission.rows.length > 0) {
                // Update existing submission
                await db_1.pool.query(
                    'UPDATE submissions SET status = $1, reviewed_at = NOW() WHERE task_id = $2 AND child_id = $3',
                    [status, taskId, task.child_id]
                );
            } else {
                // Create new submission with the status
                await db_1.pool.query(
                    'INSERT INTO submissions (task_id, child_id, status, submission_text, submitted_at) VALUES ($1, $2, $3, $4, NOW())',
                    [taskId, task.child_id, status, 'Status updated by parent']
                );
            }
        }

        res.status(200).json({
            success: true,
            message: `Task status updated to ${status}`,
            taskId: taskId,
            newStatus: status
        });

    } catch (err) {
        console.error('❌ Error updating task status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.updateTaskStatus = updateTaskStatus;
