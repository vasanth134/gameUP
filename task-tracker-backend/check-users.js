const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function checkUsers() {
  try {
    console.log('=== Checking all users ===');
    const allUsers = await pool.query('SELECT id, name, email, role, parent_id FROM users ORDER BY id');
    console.table(allUsers.rows);
    
    console.log('\n=== Looking for parent with ID 3 ===');
    const parent3 = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [3, 'parent']);
    console.log('Results:', parent3.rows);
    console.log('Found:', parent3.rows.length > 0);
    
    if (parent3.rows.length === 0) {
      console.log('\n=== Checking if user ID 3 exists with any role ===');
      const anyUser3 = await pool.query('SELECT * FROM users WHERE id = $1', [3]);
      console.log('User ID 3 (any role):', anyUser3.rows);
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
