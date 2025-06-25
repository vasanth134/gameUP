import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { title, description, due_date, xp_reward, child_id, parent_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, due_date, xp_reward, child_id, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, due_date, xp_reward, child_id, parent_id]
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

// Get tasks based on user role and ID
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = req.query;

  try {
    let result;

    if (role === 'parent') {
      // For parents, get all tasks they have created for their children
      result = await pool.query(
        `SELECT t.*, u.name as child_name 
         FROM tasks t 
         JOIN users u ON t.child_id = u.id 
         WHERE t.parent_id = $1 
         ORDER BY t.created_at DESC`,
        [userId]
      );
    } else if (role === 'child') {
      // For children, get only tasks assigned to them
      result = await pool.query(
        `SELECT t.*, u.name as parent_name 
         FROM tasks t 
         JOIN users u ON t.parent_id = u.id 
         WHERE t.child_id = $1 
         ORDER BY t.created_at DESC`,
        [userId]
      );
    } else {
      res.status(400).json({ error: 'Invalid role. Must be "parent" or "child"' });
      return;
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
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
