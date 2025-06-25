const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();

// Configure CORS more explicitly
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://localhost:5174',
      'http://localhost:5175'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// ===== USER ENDPOINTS =====

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // If child, get XP data
    if (user.role === 'child') {
      const xpResult = await pool.query('SELECT total_xp, current_level FROM xp_tracker WHERE child_id = $1', [id]);
      user.xp = xpResult.rows[0]?.total_xp || 0;
      user.level = xpResult.rows[0]?.current_level || 1;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ===== TASK ENDPOINTS =====

// Get tasks (with query params for filtering)
app.get('/api/tasks', async (req, res) => {
  const { userId, role } = req.query;
  
  try {
    let query, params;
    
    if (role === 'child') {
      query = `
        SELECT t.*, s.status as submission_status, s.id as submission_id 
        FROM tasks t 
        LEFT JOIN submissions s ON t.id = s.task_id AND s.child_id = $1 
        WHERE t.child_id = $1 
        ORDER BY t.created_at DESC
      `;
      params = [userId];
    } else {
      query = `
        SELECT t.*, u.name as child_name 
        FROM tasks t 
        JOIN users u ON t.child_id = u.id 
        WHERE t.parent_id = $1 
        ORDER BY t.created_at DESC
      `;
      params = [userId];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  const { title, description, due_date, xp_reward, child_id, parent_id } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, due_date, xp_reward, child_id, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, due_date, xp_reward, child_id, parent_id || 1]
    );
    
    res.status(201).json({ message: 'Task created successfully', task: result.rows[0] });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Submit task
app.post('/api/tasks/:taskId/submit', async (req, res) => {
  const { taskId } = req.params;
  const { child_id, description } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO submissions (task_id, child_id, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [taskId, child_id, description || 'Task completed', 'pending']
    );
    
    res.status(201).json({ message: 'Task submitted successfully', submission: result.rows[0] });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ===== SUBMISSION ENDPOINTS =====

// Get child submission summary for parent
app.get('/api/submissions/child/:childId/summary', async (req, res) => {
  const { childId } = req.params;
  
  try {
    const userResult = await pool.query('SELECT name, total_xp FROM users WHERE id = $1', [childId]);
    const statusResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending
      FROM submissions WHERE child_id = $1
    `, [childId]);
    
    res.json({
      name: userResult.rows[0]?.name || 'Unknown',
      xp: userResult.rows[0]?.total_xp || 0,
      status: statusResult.rows[0] || { approved: 0, rejected: 0, pending: 0 }
    });
  } catch (error) {
    console.error('Error fetching child summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get child status summary
app.get('/api/submissions/child/:childId/status-summary', async (req, res) => {
  const { childId } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
      FROM submissions WHERE child_id = $1
    `, [childId]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching status summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Parent login
app.post('/api/auth/login/parent', async (req, res) => {
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
    console.error('Parent login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Child login
app.post('/api/auth/login/child', async (req, res) => {
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
    console.error('Child login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Parent signup
app.post('/api/auth/signup/parent', async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new parent (using 'name' column, not 'full_name')
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, fullName, 'parent']
    );

    res.status(201).json({ success: true, message: 'Parent registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Parent signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Child signup
app.post('/api/auth/signup/child', async (req, res) => {
  const { email, password, fullName, parentEmail } = req.body;

  try {
    // Check if child already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Verify parent exists
    const parentResult = await pool.query('SELECT * FROM users WHERE email = $1 AND role = $2', [parentEmail, 'parent']);
    if (parentResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Parent not found' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new child (using 'name' column)
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, fullName, 'child']
    );

    res.status(201).json({ success: true, message: 'Child registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Child signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, name, email, role, total_xp, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get children for a parent
app.get('/api/users/parent/:parentId/children', async (req, res) => {
  const { parentId } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, total_xp, created_at FROM users WHERE parent_id = $1 AND role = $2',
      [parentId, 'child']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
