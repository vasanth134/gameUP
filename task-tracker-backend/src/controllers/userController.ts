// src/controllers/userController.ts
import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getUserXP = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT xp FROM users WHERE id = $1', [id]);
    res.status(200).json({ xp: result.rows[0]?.xp || 0 });
  } catch (err) {
    console.error('Error fetching XP:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
