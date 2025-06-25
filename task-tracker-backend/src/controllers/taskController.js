"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksByChild = exports.getTasks = exports.createTask = exports.updateTaskStatus = void 0;
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
            // For parents, get all tasks they have created for their children
            result = await db_1.pool.query(`SELECT t.*, u.name as child_name 
         FROM tasks t 
         JOIN users u ON t.child_id = u.id 
         WHERE t.parent_id = $1 
         ORDER BY t.created_at DESC`, [userId]);
        }
        else if (role === 'child') {
            // For children, get only tasks assigned to them
            result = await db_1.pool.query(`SELECT t.*, u.name as parent_name 
         FROM tasks t 
         JOIN users u ON t.parent_id = u.id 
         WHERE t.child_id = $1 
         ORDER BY t.created_at DESC`, [userId]);
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
// Update task status - allows parents to change task status
const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    
    try {
        // Valid status values (based on database constraints)
        const validStatuses = ['pending', 'approved', 'rejected'];
        
        if (!validStatuses.includes(status)) {
            res.status(400).json({ 
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
            });
            return;
        }

        // Check if task exists
        const taskExists = await db_1.pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
        if (taskExists.rows.length === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        // Check if there's an existing submission for this task
        const existingSubmission = await db_1.pool.query(
            'SELECT id FROM submissions WHERE task_id = $1', 
            [taskId]
        );

        if (existingSubmission.rows.length > 0) {
            // Update existing submission status
            await db_1.pool.query(
                'UPDATE submissions SET status = $1 WHERE task_id = $2',
                [status, taskId]
            );
        } else {
            // Create a new submission with the status
            await db_1.pool.query(
                'INSERT INTO submissions (task_id, status, submission_text) VALUES ($1, $2, $3)',
                [taskId, status, 'Status updated by parent']
            );
        }

        // Return success response with the updated status
        res.status(200).json({
            success: true,
            message: `Task status updated to ${status}`,
            taskId: parseInt(taskId),
            newStatus: status
        });

    } catch (err) {
        console.error('❌ Error updating task status:', err);
        console.error('Error details:', err.message);
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: err.message 
        });
    }
};
exports.updateTaskStatus = updateTaskStatus;
