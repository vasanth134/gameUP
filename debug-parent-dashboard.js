#!/usr/bin/env node

const http = require('http');

console.log('🔍 Debugging Parent Dashboard API calls...\n');

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

async function debugParentDashboard() {
  try {
    console.log('📊 1. Testing submission summary API...');
    
    const summaryResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/submissions/child/1/summary',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', summaryResult.status);
    console.log('Response:', JSON.stringify(summaryResult.data, null, 2));

    console.log('\n📋 2. Testing parent tasks API...');
    
    const tasksResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks?userId=1&role=parent',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', tasksResult.status);
    console.log('Response:', JSON.stringify(tasksResult.data, null, 2));
    console.log('Number of tasks:', Array.isArray(tasksResult.data) ? tasksResult.data.length : 'Not an array');

    console.log('\n🔍 3. Testing child tasks API (for comparison)...');
    
    const childTasksResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks?userId=1&role=child',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    console.log('Status:', childTasksResult.status);
    console.log('Response:', JSON.stringify(childTasksResult.data, null, 2));
    console.log('Number of tasks:', Array.isArray(childTasksResult.data) ? childTasksResult.data.length : 'Not an array');

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
    debugParentDashboard();
  } else {
    console.log('❌ Backend not responding. Start with: node test-auth.js');
  }
}).catch(() => {
  console.log('❌ Cannot connect to backend. Start with: node test-auth.js');
});
