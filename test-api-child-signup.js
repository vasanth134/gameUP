const axios = require('axios');

async function testChildSignupAPI() {
  try {
    console.log('=== Testing Child Signup API ===\n');
    
    const uniqueEmail = `testapi_${Date.now()}@test.com`;
    
    console.log('1. Attempting to create child account via API...');
    console.log('Request data:', {
      name: 'Test API Child',
      email: uniqueEmail,
      password: 'password123',
      parent_id: 3
    });
    
    const response = await axios.post('http://localhost:5000/api/users/signup/child', {
      name: 'Test API Child',
      email: uniqueEmail,
      password: 'password123',
      parent_id: 3
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Child signup successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.log('❌ Child signup failed');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Error message:', error.message);
  }
}

testChildSignupAPI();
