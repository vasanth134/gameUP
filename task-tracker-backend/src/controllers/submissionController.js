"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubmissionsForParent = exports.getPendingSubmissions = exports.createSimpleSubmission = exports.getChildSubmissionSummary = exports.isTaskSubmittedByChild = exports.getSubmissionStatusByChild = exports.reviewSubmission = exports.getSubmissionsByTask = exports.getSubmissionsByChild = exports.handleSubmissionUpload = void 0;
const db_1 = require("../config/db");
const handleSubmissionUpload = async (req, res) => {
    try {
        const { task_id, child_id, submission_text } = req.body;
        const file = req.file;
        if (!task_id || !child_id) {
            res.status(400).json({ error: 'Task ID and Child ID are required' });
            return;
        }
        // Check if submission already exists
        const existingSubmission = await db_1.pool.query('SELECT id FROM submissions WHERE task_id = $1 AND child_id = $2', [task_id, child_id]);
        if (existingSubmission.rows.length > 0) {
            res.status(400).json({ error: 'Task already submitted' });
            return;
        }
        const filePath = file ? `/uploads/${file.filename}` : null;
        const query = `
      INSERT INTO submissions (task_id, child_id, submission_text, file_path, status, submitted_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
        const values = [task_id, child_id, submission_text || 'Task completed', filePath, 'pending'];
        const result = await db_1.pool.query(query, values);
        const newSubmission = result.rows[0];
        res.status(201).json({
            success: true,
            message: 'Task submitted successfully!',
            submission: newSubmission
        });
    }
    catch (err) {
        console.error('Error saving submission:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.handleSubmissionUpload = handleSubmissionUpload;
const getSubmissionsByChild = async (req, res) => {
    const { childId } = req.params;
    try {
        const result = await db_1.pool.query('SELECT * FROM submissions WHERE child_id = $1 ORDER BY created_at DESC', [childId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getSubmissionsByChild = getSubmissionsByChild;
const getSubmissionsByTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const result = await db_1.pool.query('SELECT * FROM submissions WHERE task_id = $1 ORDER BY created_at DESC', [taskId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getSubmissionsByTask = getSubmissionsByTask;
// src/controllers/submissionController.ts
const reviewSubmission = async (req, res, next) => {
    const { submissionId } = req.params;
    const { status, feedback } = req.body;
    try {
        if (!['approved', 'rejected'].includes(status)) {
            res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
            return;
        }
        // Update the submission status
        const result = await db_1.pool.query(`UPDATE submissions
       SET status = $1, feedback = $2, reviewed_at = NOW()
       WHERE id = $3 RETURNING *`, [status, feedback, submissionId]);
        const updatedSubmission = result.rows[0];
        if (!updatedSubmission) {
            res.status(404).json({ error: 'Submission not found' });
            return;
        }
        let xpAwarded = 0;
        if (status === 'approved') {
            // Get task and child information
            const taskResult = await db_1.pool.query(`SELECT t.xp_reward, t.child_id, t.title, u.name as child_name, u.total_xp
         FROM tasks t 
         JOIN users u ON t.child_id = u.id
         WHERE t.id = $1`, [updatedSubmission.task_id]);
            const task = taskResult.rows[0];
            if (task) {
                xpAwarded = task.xp_reward || 0;
                // Award XP points to the child
                const newXPTotal = (task.total_xp || 0) + xpAwarded;
                await db_1.pool.query(`UPDATE users SET total_xp = $1 WHERE id = $2`, [newXPTotal, task.child_id]);
                // Send success notification
                await db_1.pool.query(`INSERT INTO notifications (child_id, message, created_at)
           VALUES ($1, $2, NOW())`, [task.child_id, `🎉 Congratulations! Your task "${task.title}" has been approved! You earned ${xpAwarded} XP points!`]);
                console.log(`✅ XP Awarded: ${task.child_name} received ${xpAwarded} XP for completing "${task.title}"`);
            }
        }
        else if (status === 'rejected') {
            // Get task and child information for rejection notification
            const taskResult = await db_1.pool.query(`SELECT t.title, t.child_id, u.name as child_name
         FROM tasks t 
         JOIN users u ON t.child_id = u.id
         WHERE t.id = $1`, [updatedSubmission.task_id]);
            const task = taskResult.rows[0];
            if (task) {
                // Send rejection notification with feedback
                const rejectionMessage = feedback
                    ? `⚠️ Your submission for "${task.title}" needs improvement. Feedback: ${feedback}`
                    : `⚠️ Your submission for "${task.title}" was not approved. Please try again.`;
                await db_1.pool.query(`INSERT INTO notifications (child_id, message, created_at)
           VALUES ($1, $2, NOW())`, [task.child_id, rejectionMessage]);
                console.log(`❌ Task Rejected: ${task.child_name}'s submission for "${task.title}" was rejected`);
            }
        }
        res.status(200).json({
            success: true,
            message: `Submission ${status} successfully`,
            submission: updatedSubmission,
            xpAwarded: xpAwarded
        });
    }
    catch (err) {
        console.error('Error reviewing submission:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.reviewSubmission = reviewSubmission;
const getSubmissionStatusByChild = async (req, res) => {
    const { childId } = req.params;
    try {
        // Get status counts grouped by status
        const result = await db_1.pool.query(`SELECT 
         status,
         COUNT(*) as count,
         ARRAY_AGG(DISTINCT task_id) as task_ids
       FROM submissions s
       WHERE s.child_id = $1
       GROUP BY status
       ORDER BY status`, [childId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('❌ Error fetching submission status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getSubmissionStatusByChild = getSubmissionStatusByChild;
const isTaskSubmittedByChild = async (req, res) => {
    const { taskId, childId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT id, status FROM submissions WHERE task_id = $1 AND child_id = $2`, [taskId, childId]);
        if (result.rows.length > 0) {
            res.status(200).json({ submitted: true, status: result.rows[0].status });
        }
        else {
            res.status(200).json({ submitted: false });
        }
    }
    catch (err) {
        console.error('❌ Error checking submission status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.isTaskSubmittedByChild = isTaskSubmittedByChild;
const getChildSubmissionSummary = async (req, res) => {
    const { childId } = req.params;
    try {
        const summaryQuery = `
      SELECT 
        COUNT(*) AS total_submissions,
        COUNT(*) FILTER (WHERE status = 'approved') AS total_approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS total_rejected,
        COUNT(*) FILTER (WHERE status = 'pending') AS total_pending
      FROM submissions
      WHERE child_id = $1
    `;
        const xpQuery = `
      SELECT total_xp FROM users WHERE id = $1
    `;
        const [summaryResult, xpResult] = await Promise.all([
            db_1.pool.query(summaryQuery, [childId]),
            db_1.pool.query(xpQuery, [childId]),
        ]);
        const summary = summaryResult.rows[0];
        const xp = xpResult.rows[0]?.total_xp ?? 0;
        res.status(200).json({
            totalSubmissions: parseInt(summary.total_submissions || 0),
            approved: parseInt(summary.total_approved || 0),
            rejected: parseInt(summary.total_rejected || 0),
            pending: parseInt(summary.total_pending || 0),
            totalXP: parseInt(xp)
        });
    }
    catch (err) {
        console.error('❌ Error fetching dashboard summary:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getChildSubmissionSummary = getChildSubmissionSummary;
// Simple submission without file upload
const createSimpleSubmission = async (req, res) => {
    try {
        const { task_id, child_id, submission_text } = req.body;
        if (!task_id || !child_id) {
            res.status(400).json({ error: 'Task ID and Child ID are required' });
            return;
        }
        // Check if submission already exists
        const existingSubmission = await db_1.pool.query('SELECT id FROM submissions WHERE task_id = $1 AND child_id = $2', [task_id, child_id]);
        if (existingSubmission.rows.length > 0) {
            res.status(400).json({ error: 'Task already submitted' });
            return;
        }
        const query = `
      INSERT INTO submissions (task_id, child_id, submission_text, status, submitted_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
        const values = [task_id, child_id, submission_text || 'Task completed', 'pending'];
        const result = await db_1.pool.query(query, values);
        const newSubmission = result.rows[0];
        res.status(201).json({
            success: true,
            message: 'Task submitted successfully!',
            submission: newSubmission
        });
    }
    catch (err) {
        console.error('Error creating submission:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createSimpleSubmission = createSimpleSubmission;
// Get submissions pending review for a parent
const getPendingSubmissions = async (req, res) => {
    const { parentId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT 
         s.id as submission_id,
         s.task_id,
         s.child_id,
         s.submission_text,
         s.file_path,
         s.submitted_at,
         s.status,
         t.title as task_title,
         t.description as task_description,
         t.xp_reward,
         u.name as child_name
       FROM submissions s
       JOIN tasks t ON s.task_id = t.id
       JOIN users u ON s.child_id = u.id
       WHERE t.parent_id = $1 AND s.status = 'pending'
       ORDER BY s.submitted_at DESC`, [parentId]);
        res.status(200).json({
            success: true,
            pendingSubmissions: result.rows,
            count: result.rows.length
        });
    }
    catch (err) {
        console.error('❌ Error fetching pending submissions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getPendingSubmissions = getPendingSubmissions;
// Get all submissions for a parent (approved, rejected, pending)
const getAllSubmissionsForParent = async (req, res) => {
    const { parentId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT 
         s.id as submission_id,
         s.task_id,
         s.child_id,
         s.submission_text,
         s.file_path,
         s.submitted_at,
         s.reviewed_at,
         s.status,
         s.feedback,
         t.title as task_title,
         t.description as task_description,
         t.xp_reward,
         u.name as child_name
       FROM submissions s
       JOIN tasks t ON s.task_id = t.id
       JOIN users u ON s.child_id = u.id
       WHERE t.parent_id = $1
       ORDER BY s.submitted_at DESC`, [parentId]);
        res.status(200).json({
            success: true,
            submissions: result.rows,
            count: result.rows.length
        });
    }
    catch (err) {
        console.error('❌ Error fetching all submissions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAllSubmissionsForParent = getAllSubmissionsForParent;
