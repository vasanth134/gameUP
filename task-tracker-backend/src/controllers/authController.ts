import { Request, Response } from 'express';
import { pool } from '../config/db';

export const parentLogin = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE name = $1 AND role = $2',
      [name, 'parent']
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid name' });
    } else {
      const parent = result.rows[0];
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: parent.id,
          name: parent.name,
          role: parent.role
        }
      });
    }
  } catch (err) {
    console.error('❌ Error during parent login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const childLogin = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE name = $1 AND role = $2',
        [name, 'child']
      );
  
      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Invalid name' });
      } else {
        const child = result.rows[0];
        res.status(200).json({
          message: 'Login successful',
          user: {
            id: child.id,
            name: child.name,
            role: child.role,
            xp: child.xp
          }
        });
      }
    } catch (err) {
      console.error('❌ Error during child login:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  