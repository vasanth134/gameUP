// ✅ src/controllers/submissionController.ts
import { Request, Response } from 'express';
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

export const reviewSubmission = async (req: Request, res: Response): Promise<void> => {
  const { submissionId } = req.params;
  const { status, feedback } = req.body;

  try {
    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Use "approved" or "rejected".' });
      return;
    }

    const updateResult = await pool.query(
      `UPDATE submissions
       SET status = $1, feedback = $2, reviewed_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, feedback, submissionId]
    );

    const updatedSubmission = updateResult.rows[0];

    // Get task and user info
    const taskResult = await pool.query(
      `SELECT tasks.title, tasks.xp_reward, tasks.child_id
       FROM tasks
       JOIN submissions ON tasks.id = submissions.task_id
       WHERE submissions.id = $1`,
      [submissionId]
    );

    const { title, xp_reward, child_id } = taskResult.rows[0];

    if (status === 'approved') {
      // Add XP
      await pool.query(`UPDATE users SET xp = xp + $1 WHERE id = $2`, [xp_reward, child_id]);

      // Send notification
      await sendNotification(child_id, `Your submission for task "${title}" has been approved. You earned ${xp_reward} XP!`);
    } else {
      // Rejected notification
      await sendNotification(child_id, `Your submission for task "${title}" was rejected. Feedback: ${feedback}`);
    }

    res.status(200).json({ message: 'Submission reviewed and notification sent successfully', submission: updatedSubmission });
  } catch (err) {
    console.error('Error reviewing submission:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};