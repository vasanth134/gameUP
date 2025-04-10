import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { title, description, due_date, xp_reward, child_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, due_date, xp_reward, child_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, due_date, xp_reward, child_id]
    );

    res.status(201).json({
      message: '✅ Task created successfully',
      task: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getTasksByChild = async (req: Request, res: Response): Promise<void> => {
  const { childId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE child_id = $1 ORDER BY created_at DESC`,
      [childId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
