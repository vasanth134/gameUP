// ✅ src/controllers/submissionController.ts
import { NextFunction, Request, Response } from 'express';
import { pool } from '../config/db';
import { sendNotification } from '../utils/sendNotification';

export const handleSubmissionUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, childId, submissionText } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }

    const fileUrl = `/uploads/${file.filename}`;

    const query = `
      INSERT INTO submissions (task_id, child_id, submission_text, file_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [taskId, childId, submissionText, fileUrl];

    const result = await pool.query(query, values);
    const newSubmission = result.rows[0];

    res.status(201).json({ message: 'Submission uploaded successfully', submission: newSubmission });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getSubmissionsByChild = async (req: Request, res: Response): Promise<void> => {
  const { childId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE child_id = $1 ORDER BY created_at DESC',
      [childId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getSubmissionsByTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE task_id = $1 ORDER BY created_at DESC',
      [taskId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// src/controllers/submissionController.ts
export const reviewSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { submissionId } = req.params;
  const { status, feedback } = req.body;

  try {
    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const result = await pool.query(
      `UPDATE submissions
       SET status = $1, feedback = $2, reviewed_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, feedback, submissionId]
    );
    const updatedSubmission = result.rows[0];

    if (status === 'approved') {
      const taskResult = await pool.query(
        `SELECT xp_reward, child_id, title FROM tasks WHERE id = (
          SELECT task_id FROM submissions WHERE id = $1
        )`,
        [submissionId]
      );
      const task = taskResult.rows[0];

      if (task) {
        await pool.query(
          `UPDATE users SET xp = xp + $1 WHERE id = $2`,
          [task.xp_reward, task.child_id]
        );

        await pool.query(
          `INSERT INTO notifications (child_id, message)
           VALUES ($1, $2)`,
          [task.child_id, `🎉 Your submission for "${task.title}" has been approved! You earned XP.`]
        );
      }
    } else if (status === 'rejected') {
      const childIdResult = await pool.query(
        `SELECT child_id, task_id FROM submissions WHERE id = $1`,
        [submissionId]
      );
      const { child_id, task_id } = childIdResult.rows[0];

      const taskTitle = await pool.query(
        `SELECT title FROM tasks WHERE id = $1`,
        [task_id]
      );

      await pool.query(
        `INSERT INTO notifications (child_id, message)
         VALUES ($1, $2)`,
        [child_id, `⚠️ Your submission for "${taskTitle.rows[0].title}" was rejected. Check feedback.`]
      );
    }

    res.status(200).json({
      message: 'Submission reviewed and notification sent',
      submission: updatedSubmission
    });
  } catch (err) {
    console.error('Error reviewing submission:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getSubmissionStatusByChild = async (req: Request, res: Response): Promise<void> => {
  const { childId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         s.task_id,
         t.title,
         s.status,
         s.created_at AS submitted_at
       FROM submissions s
       JOIN tasks t ON s.task_id = t.id
       WHERE s.child_id = $1
       ORDER BY s.created_at DESC`,
      [childId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching submission status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const isTaskSubmittedByChild = async (req: Request, res: Response): Promise<void> => {
  const { taskId, childId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, status FROM submissions WHERE task_id = $1 AND child_id = $2`,
      [taskId, childId]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ submitted: true, status: result.rows[0].status });
    } else {
      res.status(200).json({ submitted: false });
    }
  } catch (err) {
    console.error('❌ Error checking submission status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getChildSubmissionSummary = async (req: Request, res: Response): Promise<void> => {
  const { childId } = req.params;

  try {
    const summaryQuery = `
    SELECT 
      0 AS total_xp,  -- mock value to bypass missing column
      COUNT(*) FILTER (WHERE status = 'submitted') AS total_submitted,
      COUNT(*) FILTER (WHERE status = 'approved') AS total_approved,
      COUNT(*) FILTER (WHERE status = 'rejected') AS total_rejected
    FROM submissions
    WHERE child_id = $1
  `;
  

    const xpQuery = `
      SELECT xp FROM users WHERE id = $1
    `;

    const [summaryResult, xpResult] = await Promise.all([
      pool.query(summaryQuery, [childId]),
      pool.query(xpQuery, [childId]),
    ]);

    const summary = summaryResult.rows[0];
    const xp = xpResult.rows[0]?.xp ?? 0;

    res.status(200).json({
      totalSubmissions: parseInt(summary.total_submissions),
      approved: parseInt(summary.approved_count),
      rejected: parseInt(summary.rejected_count),
      pending: parseInt(summary.pending_count),
      totalXP: xp
    });
  } catch (err) {
    console.error('❌ Error fetching dashboard summary:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};