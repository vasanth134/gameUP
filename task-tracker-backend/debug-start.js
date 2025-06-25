const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// Test database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testDB() {
  try {
    console.log('🔌 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Database time:', result.rows[0].now);
    
    client.release();
    
    // Try to start the server
    console.log('🚀 Starting server...');
    const express = require('express');
    const app = express();
    
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Debug server running at http://localhost:${PORT}`);
      console.log(`🔍 Test health endpoint: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testDB();
