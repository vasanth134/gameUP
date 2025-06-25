#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🔄 Reinitializing GameUP Database...\n');

// Database configuration
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function reinitializeDatabase() {
  try {
    console.log('📋 Reading SQL schema...');
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('🗑️  Dropping existing tables...');
    
    // Drop tables in reverse order of dependencies
    await pool.query('DROP TABLE IF EXISTS submissions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS tasks CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');

    console.log('🏗️  Creating new tables and data...');
    
    // Execute the SQL schema
    await pool.query(sqlContent);

    console.log('✅ Database reinitialized successfully!');
    
    // Verify data
    console.log('\n🔍 Verifying data...');
    
    const users = await pool.query('SELECT id, name, role FROM users');
    console.log('Users:', users.rows);
    
    const tasks = await pool.query('SELECT id, title, parent_id, child_id FROM tasks');
    console.log('Tasks:', tasks.rows);
    
    const submissions = await pool.query('SELECT id, task_id, child_id, status FROM submissions');
    console.log('Submissions:', submissions.rows);

    console.log('\n🎉 Database is ready for testing!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await pool.end();
  }
}

reinitializeDatabase();
