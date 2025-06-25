const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function checkDatabaseState() {
  try {
    console.log('=== Database State Check ===\n');
    
    console.log('1. All users in database:');
    const allUsers = await pool.query('SELECT id, name, email, role, parent_id FROM users ORDER BY id');
    console.table(allUsers.rows);
    
    console.log('\n2. Specifically checking user ID 3:');
    const user3 = await pool.query('SELECT * FROM users WHERE id = $1', [3]);
    if (user3.rows.length > 0) {
      console.log('✅ User ID 3 exists:');
      console.log('   - ID:', user3.rows[0].id);
      console.log('   - Name:', user3.rows[0].name);
      console.log('   - Email:', user3.rows[0].email);
      console.log('   - Role:', user3.rows[0].role);
      console.log('   - Parent ID:', user3.rows[0].parent_id);
    } else {
      console.log('❌ User ID 3 does not exist');
    }
    
    console.log('\n3. Checking for parents with role "parent":');
    const parents = await pool.query('SELECT id, name, email FROM users WHERE role = $1', ['parent']);
    console.log('Parents found:', parents.rows.length);
    console.table(parents.rows);
    
    console.log('\n4. Checking parent-child relationships:');
    const relationships = await pool.query(`
      SELECT 
        p.id as parent_id, 
        p.name as parent_name, 
        p.email as parent_email,
        c.id as child_id, 
        c.name as child_name, 
        c.email as child_email
      FROM users p 
      LEFT JOIN users c ON p.id = c.parent_id 
      WHERE p.role = 'parent'
      ORDER BY p.id
    `);
    console.table(relationships.rows);
    
    await pool.end();
  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  }
}

checkDatabaseState();
