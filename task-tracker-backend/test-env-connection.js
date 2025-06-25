const { Pool } = require('pg');
require('dotenv').config();

console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testEnvConnection() {
  try {
    console.log('\nTesting connection with environment variables...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful');
    console.log('Server time:', result.rows[0].now);
    
    const userTest = await pool.query('SELECT id, name, email, role, total_xp FROM users WHERE id = 3');
    console.log('User 3 data:', userTest.rows[0]);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testEnvConnection();
