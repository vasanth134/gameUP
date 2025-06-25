const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function testDB() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log('Server time:', result.rows[0].now);
    
    console.log('\nChecking if gameUP database exists...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables found:', tables.rows.map(row => row.table_name));
    
    if (tables.rows.length === 0) {
      console.log('❌ No tables found! Database might need initialization.');
    } else {
      console.log('\nChecking users table...');
      const users = await pool.query('SELECT COUNT(*) FROM users');
      console.log('Users count:', users.rows[0].count);
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testDB();
