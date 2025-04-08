import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { parent_id, child_id, title, description, due_date, xp_reward, category } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (parent_id, child_id, title, description, due_date, xp_reward, category) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [parent_id, child_id, title, description, due_date, xp_reward, category]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
