const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function testChildSignupFlow() {
  try {
    console.log('=== Testing Child Signup Flow ===\n');
    
    // 1. Check parent exists
    console.log('1. Checking if parent ID 3 exists...');
    const parentResult = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [3, 'parent']);
    console.log('Parent found:', parentResult.rows.length > 0);
    if (parentResult.rows.length > 0) {
      console.log('Parent details:', {
        id: parentResult.rows[0].id,
        name: parentResult.rows[0].name,
        email: parentResult.rows[0].email,
        role: parentResult.rows[0].role
      });
    }
    
    // 2. Test child creation
    if (parentResult.rows.length > 0) {
      console.log('\n2. Testing direct database child creation...');
      const testChildEmail = `testchild_${Date.now()}@test.com`;
      
      try {
        const childResult = await pool.query(
          `INSERT INTO users (name, email, password, role, parent_id, total_xp) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          ['Test Child', testChildEmail, 'hashedpassword', 'child', 3, 0]
        );
        
        console.log('✅ Child account created successfully!');
        console.log('Child details:', {
          id: childResult.rows[0].id,
          name: childResult.rows[0].name,
          email: childResult.rows[0].email,
          role: childResult.rows[0].role,
          parent_id: childResult.rows[0].parent_id
        });
        
        // 3. Test getting children for parent
        console.log('\n3. Testing get children for parent 3...');
        const childrenResult = await pool.query(
          `SELECT id, name, email, total_xp as xp FROM users WHERE parent_id = $1 AND role = 'child' ORDER BY name`,
          [3]
        );
        
        console.log('Children found for parent 3:', childrenResult.rows.length);
        console.table(childrenResult.rows);
        
      } catch (error) {
        console.error('❌ Child creation failed:', error.message);
      }
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChildSignupFlow();
