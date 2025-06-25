#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing with Correct User IDs...\n');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testWithCorrectIDs() {
  try {
    console.log('👨‍👩‍👧‍👦 1. Testing Parent Tasks (parentId=1)...');
    
    const parentTasksResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks?userId=1&role=parent',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', parentTasksResult.status);
    console.log('Response:', JSON.stringify(parentTasksResult.data, null, 2));
    console.log('Number of tasks:', Array.isArray(parentTasksResult.data) ? parentTasksResult.data.length : 'Not an array');

    console.log('\n🧒 2. Testing Child Tasks (childId=2)...');
    
    const childTasksResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks?userId=2&role=child',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', childTasksResult.status);
    console.log('Response:', JSON.stringify(childTasksResult.data, null, 2));
    console.log('Number of tasks:', Array.isArray(childTasksResult.data) ? childTasksResult.data.length : 'Not an array');

    console.log('\n📊 3. Testing Child Summary (childId=2)...');
    
    const summaryResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/submissions/child/2/summary',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', summaryResult.status);
    console.log('Response:', JSON.stringify(summaryResult.data, null, 2));

    console.log('\n👤 4. Testing User Info (childId=2)...');
    
    const userResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/2',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', userResult.status);
    console.log('Response:', JSON.stringify(userResult.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

console.log('Checking backend connection first...');
makeRequest({
  hostname: 'localhost',
  port: 5000,
  path: '/test',
  method: 'GET'
}).then((result) => {
  if (result.status === 200) {
    console.log('✅ Backend is running\n');
    testWithCorrectIDs();
  } else {
    console.log('❌ Backend not responding. Start with: node test-auth.js');
  }
}).catch(() => {
  console.log('❌ Cannot connect to backend. Start with: node test-auth.js');
});
