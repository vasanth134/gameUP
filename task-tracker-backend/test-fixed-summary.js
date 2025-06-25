const { pool } = require('./src/config/db');

(async () => {
  try {
    console.log('🔧 Testing fixed SQL query...');
    
    const summaryQuery = `
      SELECT 
        COUNT(*) AS total_submissions,
        COUNT(*) FILTER (WHERE status = 'approved') AS total_approved,
        COUNT(*) FILTER (WHERE status = 'rejected') AS total_rejected,
        COUNT(*) FILTER (WHERE status = 'pending') AS total_pending
      FROM submissions
      WHERE child_id = $1
    `;

    const xpQuery = `
      SELECT total_xp FROM users WHERE id = $1
    `;

    const [summaryResult, xpResult] = await Promise.all([
      pool.query(summaryQuery, [14]),
      pool.query(xpQuery, [14]),
    ]);

    const summary = summaryResult.rows[0];
    const xp = xpResult.rows[0]?.total_xp ?? 0;

    console.log('📊 Raw summary result:', summary);
    console.log('📊 Raw XP result:', xp);

    const finalResult = {
      totalSubmissions: parseInt(summary.total_submissions || 0),
      approved: parseInt(summary.total_approved || 0),
      rejected: parseInt(summary.total_rejected || 0),
      pending: parseInt(summary.total_pending || 0),
      totalXP: parseInt(xp)
    };

    console.log('✅ Final parsed result:', finalResult);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
