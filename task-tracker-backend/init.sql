-- Create users table with unified structure
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('parent', 'child')),
  parent_id INTEGER REFERENCES users(id),
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  xp_reward INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'reviewed')),
  parent_id INTEGER NOT NULL REFERENCES users(id),
  child_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  child_id INTEGER NOT NULL REFERENCES users(id),
  submission_text TEXT,
  file_path VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample parent user (password: 'password123')
INSERT INTO users (name, email, password, role, total_xp) 
VALUES ('Test Parent', 'parent@test.com', '$2b$10$p2MUy7CP61MBP.FVYhiq2eQYnhIzz2bCJymb4jk8fQqEw9QXFr94q', 'parent', 0)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert sample child user (password: 'password123')
INSERT INTO users (name, email, password, role, parent_id, total_xp) 
VALUES ('Test Child', 'child@test.com', '$2b$10$p2MUy7CP61MBP.FVYhiq2eQYnhIzz2bCJymb4jk8fQqEw9QXFr94q', 'child', 1, 50)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert second parent user (password: 'password123')
INSERT INTO users (name, email, password, role, total_xp) 
VALUES ('Sarah Johnson', 'sarah@test.com', '$2b$10$p2MUy7CP61MBP.FVYhiq2eQYnhIzz2bCJymb4jk8fQqEw9QXFr94q', 'parent', 0)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert second child user (password: 'password123')
INSERT INTO users (name, email, password, role, parent_id, total_xp) 
VALUES ('Emma Johnson', 'emma@test.com', '$2b$10$p2MUy7CP61MBP.FVYhiq2eQYnhIzz2bCJymb4jk8fQqEw9QXFr94q', 'child', 3, 75)
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- Insert sample task for first parent-child pair
INSERT INTO tasks (title, description, due_date, xp_reward, parent_id, child_id)
VALUES ('Complete Math Homework', 'Solve all problems in chapter 5', '2025-07-01', 25, 1, 2)
ON CONFLICT DO NOTHING;

-- Insert sample task for second parent-child pair
INSERT INTO tasks (title, description, due_date, xp_reward, parent_id, child_id)
VALUES ('Read Chapter 3', 'Read and summarize chapter 3 of the science book', '2025-07-02', 30, 3, 4)
ON CONFLICT DO NOTHING;

-- Insert sample submission for first child
INSERT INTO submissions (task_id, child_id, submission_text, status)
VALUES (1, 2, 'I completed all the math problems!', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample submission for second child
INSERT INTO submissions (task_id, child_id, submission_text, status)
VALUES (2, 4, 'I read the chapter and wrote a summary!', 'pending')
ON CONFLICT DO NOTHING;
