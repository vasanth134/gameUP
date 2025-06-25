const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function showUsers() {
  try {
    console.log('=== All Users in Database ===');
    const users = await pool.query('SELECT id, name, email, role, parent_id FROM users ORDER BY id');
    console.table(users.rows);
    
    console.log('\n=== User ID 3 Details ===');
    const user3 = await pool.query('SELECT * FROM users WHERE id = 3');
    if (user3.rows.length > 0) {
      console.log('User 3 found:');
      console.log('  ID:', user3.rows[0].id);
      console.log('  Name:', user3.rows[0].name);
      console.log('  Email:', user3.rows[0].email);
      console.log('  Role:', user3.rows[0].role);
      console.log('  Parent ID:', user3.rows[0].parent_id);
    } else {
      console.log('❌ User ID 3 not found');
    }
    
    console.log('\n=== Testing Parent Query ===');
    const parentCheck = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [3, 'parent']);
    console.log('Parent query result (id=3, role=parent):', parentCheck.rows.length > 0 ? 'Found' : 'Not found');
    if (parentCheck.rows.length > 0) {
      console.table(parentCheck.rows);
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

showUsers();
