const axios = require('axios');

async function debugUserIssue() {
  try {
    console.log('=== Debugging User ID 3 Issue ===\n');
    
    console.log('1. Testing basic backend connectivity...');
    try {
      const response = await axios.get('http://localhost:5000/api/users/1');
      console.log('✅ Backend is running, User ID 1:', response.data);
    } catch (error) {
      console.log('❌ Backend connectivity issue:', error.message);
      return;
    }
    
    console.log('\n2. Testing User ID 3...');
    try {
      const response = await axios.get('http://localhost:5000/api/users/3');
      console.log('✅ User ID 3 data:', response.data);
      console.log('   - Role:', response.data.role);
      console.log('   - Name:', response.data.name);
      console.log('   - Email:', response.data.email);
    } catch (error) {
      console.log('❌ User ID 3 error:', error.response?.status, error.response?.data || error.message);
    }
    
    console.log('\n3. Testing parent/children endpoint...');
    try {
      const response = await axios.get('http://localhost:5000/api/users/parent/3/children');
      console.log('✅ Children for parent 3:', response.data);
    } catch (error) {
      console.log('❌ Parent/children endpoint error:', error.response?.status, error.response?.data || error.message);
    }
    
    console.log('\n4. Testing child creation...');
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup/child', {
        name: 'Debug Test Child',
        email: `debugchild${Date.now()}@test.com`,
        password: 'password123',
        parent_id: 3
      });
      console.log('✅ Child creation successful:', response.data);
    } catch (error) {
      console.log('❌ Child creation error:', error.response?.status, error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Overall error:', error.message);
  }
}

debugUserIssue();
