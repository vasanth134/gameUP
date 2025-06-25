const { pool } = require('./src/config/db');

(async () => {
  try {
    console.log('Testing database connection...');
    
    // Simple query first
    const result = await pool.query('SELECT COUNT(*) FROM submissions WHERE child_id = 14');
    console.log('📊 Total submissions for child 14:', result.rows[0]);
    
    // Check what's actually in submissions for child 14
    const rawResult = await pool.query('SELECT id, status, child_id FROM submissions WHERE child_id = 14');
    console.log('📊 Raw submissions for child 14:', rawResult.rows);
    
    // Test the summary query
    const summaryResult = await pool.query(`
      SELECT 
        COUNT(*) AS total_submissions,
        COUNT(*) FILTER (WHERE status = 'approved') AS total_approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS total_rejected,
        COUNT(*) FILTER (WHERE status = 'pending') AS total_pending
      FROM submissions
      WHERE child_id = $1
    `, [14]);
    console.log('📊 Summary query result:', summaryResult.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
