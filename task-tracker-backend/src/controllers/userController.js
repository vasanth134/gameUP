"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildrenForParent = exports.getUserById = exports.getDashboardStats = exports.getAssignedTasksForChild = exports.getXpSummary = exports.getChildSummaryForParent = exports.getXPLeaderboard = exports.getUserXP = void 0;
const db_1 = require("../config/db");
const getUserXP = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db_1.pool.query('SELECT total_xp as xp FROM users WHERE id = $1', [id]);
        res.status(200).json({ xp: result.rows[0]?.xp || 0 });
    }
    catch (err) {
        console.error('Error fetching XP:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getUserXP = getUserXP;
const getXPLeaderboard = async (req, res) => {
    try {
        const result = await db_1.pool.query(`
      SELECT id, name, total_xp as xp 
      FROM users 
      WHERE role = 'child' 
      ORDER BY total_xp DESC 
      LIMIT 10
    `);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getXPLeaderboard = getXPLeaderboard;
const getChildSummaryForParent = async (req, res) => {
    const { childId } = req.params;
    try {
        // Get XP
        const xpResult = await db_1.pool.query(`SELECT name, total_xp as xp FROM users WHERE id = $1 AND role = 'child'`, [childId]);
        if (xpResult.rows.length === 0) {
            res.status(404).json({ error: 'Child not found' });
            return;
        }
        const { name, xp } = xpResult.rows[0];
        // Get submission status counts
        const statusResult = await db_1.pool.query(`SELECT 
         COUNT(*) FILTER (WHERE status = 'approved') AS approved,
         COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending
       FROM submissions
       WHERE child_id = $1`, [childId]);
        res.status(200).json({
            name,
            xp,
            status: statusResult.rows[0]
        });
    }
    catch (err) {
        console.error('Error fetching child summary:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getChildSummaryForParent = getChildSummaryForParent;
const getXpSummary = async (req, res) => {
    const { childId } = req.params;
    try {
        const xpResult = await db_1.pool.query(`SELECT total_xp as xp FROM users WHERE id = $1`, [childId]);
        if (xpResult.rowCount === 0) {
            res.status(404).json({ error: 'Child not found' });
            return;
        }
        const xp = xpResult.rows[0].xp;
        const countResult = await db_1.pool.query(`SELECT 
         COUNT(*) FILTER (WHERE status = 'approved') AS approved,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending,
         COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
       FROM submissions
       WHERE child_id = $1`, [childId]);
        const { approved, pending, rejected } = countResult.rows[0];
        res.status(200).json({
            childId,
            xp: parseInt(xp),
            submissions: {
                approved: parseInt(approved),
                pending: parseInt(pending),
                rejected: parseInt(rejected),
            },
        });
    }
    catch (err) {
        console.error('Error fetching XP summary:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getXpSummary = getXpSummary;
const getAssignedTasksForChild = async (req, res) => {
    const { childId } = req.params;
    try {
        const result = await db_1.pool.query(`
      SELECT 
        t.id AS task_id,
        t.title,
        t.description,
        t.xp_reward,
        t.deadline,
        s.status AS submission_status,
        s.reviewed_at,
        s.created_at AS submitted_at
      FROM tasks t
      LEFT JOIN submissions s ON t.id = s.task_id AND s.child_id = $1
      WHERE t.assigned_to = $1
      ORDER BY t.deadline ASC;
      `, [childId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('❌ Error fetching assigned tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAssignedTasksForChild = getAssignedTasksForChild;
const getDashboardStats = async (req, res) => {
    const { childId } = req.params;
    try {
        // 1. Total XP
        const xpResult = await db_1.pool.query('SELECT total_xp as xp FROM users WHERE id = $1', [childId]);
        const xp = xpResult.rows[0]?.xp || 0;
        // 2. Total Tasks Assigned
        const totalTasks = await db_1.pool.query('SELECT COUNT(*) FROM tasks WHERE assigned_to = $1', [childId]);
        // 3. Submissions Breakdown
        const submissionStats = await db_1.pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status IS NOT NULL) AS submitted,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
        COUNT(*) FILTER (WHERE status IS NULL) AS pending
      FROM submissions
      WHERE child_id = $1;
      `, [childId]);
        res.status(200).json({
            xp,
            totalTasks: parseInt(totalTasks.rows[0].count),
            submitted: parseInt(submissionStats.rows[0].submitted),
            approved: parseInt(submissionStats.rows[0].approved),
            rejected: parseInt(submissionStats.rows[0].rejected),
            pending: parseInt(submissionStats.rows[0].pending),
        });
    }
    catch (err) {
        console.error('❌ Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getUserById = async (req, res) => {
    const { id } = req.params;
    console.log('=== getUserById called ===');
    console.log('Requesting user ID:', id);
    try {
        console.log('Executing query: SELECT id, name, email, role, total_xp as xp FROM users WHERE id = $1');
        const result = await db_1.pool.query('SELECT id, name, email, role, total_xp as xp FROM users WHERE id = $1', [id]);
        console.log('Query result:', result.rows);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getUserById = getUserById;
const getChildrenForParent = async (req, res) => {
    const { parentId } = req.params;
    try {
        const result = await db_1.pool.query(`SELECT id, name, email, total_xp as xp FROM users WHERE parent_id = $1 AND role = 'child' ORDER BY name`, [parentId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('Error fetching children for parent:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getChildrenForParent = getChildrenForParent;
