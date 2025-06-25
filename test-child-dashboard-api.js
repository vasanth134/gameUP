const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'gameUP',
});

async function testChildDashboardAPI() {
  try {
    console.log('=== Testing Child Dashboard API Flow ===\n');
    
    // 1. Test child login
    console.log('1. Testing child login...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login/child', {
      email: 'child@test.com',
      password: 'password123'
    });
    
    if (loginResponse.data.success) {
      const childUser = loginResponse.data.user;
      console.log('✅ Child login successful!');
      console.log('   User:', { id: childUser.id, name: childUser.name, role: childUser.role });
      
      const childId = childUser.id;
      
      // 2. Test tasks endpoint
      console.log('\n2. Testing tasks endpoint...');
      const tasksResponse = await axios.get(`http://localhost:5000/api/tasks?userId=${childId}&role=child`);
      console.log(`✅ Tasks fetched: ${tasksResponse.data.length} tasks found`);
      console.log('   Tasks:', tasksResponse.data.map(task => ({ id: task.id, title: task.title, xp: task.xp_reward })));
      
      // 3. Test user data endpoint
      console.log('\n3. Testing user data endpoint...');
      const userResponse = await axios.get(`http://localhost:5000/api/users/${childId}`);
      console.log('✅ User data fetched successfully');
      console.log('   User data:', { id: userResponse.data.id, name: userResponse.data.name, xp: userResponse.data.xp });
      
      // 4. Test status summary endpoint
      console.log('\n4. Testing status summary endpoint...');
      const statusResponse = await axios.get(`http://localhost:5000/api/submissions/child/${childId}/status-summary`);
      console.log('✅ Status summary fetched successfully');
      console.log('   Status summary:', statusResponse.data);
      
      // 5. Summary
      console.log('\n=== SUMMARY ===');
      console.log(`✅ Child ID ${childId} has ${tasksResponse.data.length} assigned tasks`);
      console.log(`✅ Child has ${userResponse.data.xp} XP`);
      console.log(`✅ Child has ${statusResponse.data.length} different submission statuses`);
      console.log('\n🎯 All child dashboard APIs are working correctly!');
      console.log('\n📋 Next: Open http://localhost:3000 and login as child to test the frontend');
      
    } else {
      console.log('❌ Child login failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  } finally {
    await pool.end();
  }
}

testChildDashboardAPI();
