#!/usr/bin/env node

const { Pool } = require('pg');

console.log('🔍 Direct Database Check...\n');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function checkDatabase() {
  try {
    console.log('👥 Checking users table...');
    const users = await pool.query('SELECT id, name, role FROM users ORDER BY id');
    console.log('Users:', users.rows);

    console.log('\n📋 Checking tasks table...');
    const tasks = await pool.query('SELECT id, title, parent_id, child_id, created_at FROM tasks ORDER BY id');
    console.log('Tasks:', tasks.rows);

    console.log('\n📝 Checking submissions table...');
    const submissions = await pool.query('SELECT id, task_id, child_id, status FROM submissions ORDER BY id');
    console.log('Submissions:', submissions.rows);

    if (tasks.rows.length > 0) {
      const task = tasks.rows[0];
      console.log('\n🔍 Testing parent query manually...');
      console.log(`Query: SELECT t.*, u.name as child_name FROM tasks t JOIN users u ON t.child_id = u.id WHERE t.parent_id = ${task.parent_id}`);
      
      const parentQuery = await pool.query(`
        SELECT t.*, u.name as child_name 
        FROM tasks t 
        JOIN users u ON t.child_id = u.id 
        WHERE t.parent_id = $1 
        ORDER BY t.created_at DESC
      `, [task.parent_id]);
      console.log('Parent query result:', parentQuery.rows);

      console.log('\n🔍 Testing child query manually...');
      console.log(`Query: SELECT t.*, s.status as submission_status FROM tasks t LEFT JOIN submissions s ON t.id = s.task_id WHERE t.child_id = ${task.child_id}`);
      
      const childQuery = await pool.query(`
        SELECT t.*, s.status as submission_status, s.id as submission_id 
        FROM tasks t 
        LEFT JOIN submissions s ON t.id = s.task_id AND s.child_id = $1 
        WHERE t.child_id = $1 
        ORDER BY t.created_at DESC
      `, [task.child_id]);
      console.log('Child query result:', childQuery.rows);
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await pool.end();
  }
}

checkDatabase();
