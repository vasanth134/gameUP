import { Request, Response } from 'express';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Parent Login Controller
 */
export const parentLogin = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'parent']);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Parent not found' });
    }

    const parent = result.rows[0];
    const validPassword = await bcrypt.compare(password, parent.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = parent;
    res.status(200).json({ success: true, message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Child Login Controller
 */
export const childLogin = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [email, 'child']);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    const child = result.rows[0];
    const validPassword = await bcrypt.compare(password, child.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = child;
    res.status(200).json({ success: true, message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Parent Signup Controller
 */
export const parentSignup = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create parent user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, total_xp) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, hashedPassword, 'parent', 0]
    );

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = result.rows[0];
    res.status(201).json({ 
      success: true, 
      message: 'Parent account created successfully', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Parent signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Child Signup Controller - for parents to create child accounts
 */
export const childSignup = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, parent_id } = req.body;

  console.log('=== Child signup request ===');
  console.log('Request body:', { name, email, parent_id });
  console.log('parent_id type:', typeof parent_id);
  console.log('parent_id value:', parent_id);

  try {
    // Check if email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Verify that the parent exists
    console.log('Checking for parent with ID:', parent_id, 'type:', typeof parent_id);
    const parentResult = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [parent_id, 'parent']);
    console.log('Parent found:', parentResult.rows.length > 0);
    console.log('Parent query result:', parentResult.rows);
    
    if (parentResult.rows.length === 0) {
      // Let's also check if the user exists with any role
      const anyUserResult = await pool.query('SELECT * FROM users WHERE id = $1', [parent_id]);
      console.log('Any user with ID', parent_id, ':', anyUserResult.rows);
      return res.status(400).json({ success: false, message: 'Parent not found' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create child user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, parent_id, total_xp) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, hashedPassword, 'child', parent_id, 0]
    );

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = result.rows[0];
    res.status(201).json({ 
      success: true, 
      message: 'Child account created successfully', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Child signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
