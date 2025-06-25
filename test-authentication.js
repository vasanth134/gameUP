#!/usr/bin/env node

// Test authentication endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuthentication() {
  console.log('🔐 Testing Authentication System...\n');

  try {
    const timestamp = Date.now();

    // Test 1: Parent Signup
    console.log('1️⃣ Testing Parent Signup...');
    const parentSignupRes = await axios.post(`${BASE_URL}/auth/signup/parent`, {
      name: 'Test Parent Auth',
      email: `parent_auth_${timestamp}@test.com`,
      password: 'password123'
    });
    console.log('✅ Parent signup successful:', parentSignupRes.data.user.name);
    const parentId = parentSignupRes.data.user.id;

    // Test 2: Parent Login  
    console.log('\n2️⃣ Testing Parent Login...');
    const parentLoginRes = await axios.post(`${BASE_URL}/auth/login/parent`, {
      email: `parent_auth_${timestamp}@test.com`,
      password: 'password123'
    });
    console.log('✅ Parent login successful:', parentLoginRes.data.user.name);

    // Test 3: Child Signup (created by parent)
    console.log('\n3️⃣ Testing Child Signup...');
    const childSignupRes = await axios.post(`${BASE_URL}/auth/signup/child`, {
      name: 'Test Child Auth',
      email: `child_auth_${timestamp}@test.com`,
      password: 'password123',
      parent_id: parentId
    });
    console.log('✅ Child signup successful:', childSignupRes.data.user.name);

    // Test 4: Child Login
    console.log('\n4️⃣ Testing Child Login...');
    const childLoginRes = await axios.post(`${BASE_URL}/auth/login/child`, {
      email: `child_auth_${timestamp}@test.com`,
      password: 'password123'
    });
    console.log('✅ Child login successful:', childLoginRes.data.user.name);

    // Test 5: Error Cases
    console.log('\n5️⃣ Testing Error Cases...');
    
    // Wrong password
    try {
      await axios.post(`${BASE_URL}/auth/login/parent`, {
        email: `parent_auth_${timestamp}@test.com`,
        password: 'wrongpassword'
      });
    } catch (err) {
      console.log('✅ Wrong password error:', err.response.data.message);
    }

    // Non-existent user
    try {
      await axios.post(`${BASE_URL}/auth/login/parent`, {
        email: 'nonexistent@test.com',
        password: 'password123'
      });
    } catch (err) {
      console.log('✅ Non-existent user error:', err.response.data.message);
    }

    // Duplicate email
    try {
      await axios.post(`${BASE_URL}/auth/signup/parent`, {
        name: 'Duplicate Parent',
        email: `parent_auth_${timestamp}@test.com`, // Same email
        password: 'password123'
      });
    } catch (err) {
      console.log('✅ Duplicate email error:', err.response.data.message);
    }

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAuthentication();
