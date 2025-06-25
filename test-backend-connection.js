const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing if backend is running...');
    const response = await axios.get('http://localhost:5000/api/users/3');
    console.log('User ID 3 data:', response.data);
  } catch (error) {
    console.error('Error connecting to backend:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
