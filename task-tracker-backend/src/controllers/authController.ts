import { Request, Response } from 'express';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';

/**
 * Parent Login Controller
 */
export const parentLogin = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM parents WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const parent = result.rows[0];
    const validPassword = await bcrypt.compare(password, parent.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user: parent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Child Login Controller
 */
export const childLogin = async (req: Request, res: Response): Promise<any > => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM children WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const child = result.rows[0];
    const validPassword = await bcrypt.compare(password, child.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user: child });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const SALT_ROUNDS = 10;

/**
 * Parent Signup
 */
export const parentSignup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO parents (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Parent registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Parent Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Child Signup
 */
export const childSignup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, parent_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO children (name, email, password, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, parent_id]
    );

    res.status(201).json({ message: 'Child registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Child Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
