#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing Task Creation and Display...\n');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testTaskFlow() {
  try {
    console.log('📝 1. Creating a new task...');
    
    const taskData = {
      title: 'Test Math Assignment',
      description: 'Complete the worksheet on multiplication tables',
      due_date: '2025-07-01',
      xp_reward: 50,
      child_id: 1,
      parent_id: 1
    };

    const createTaskResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    }, JSON.stringify(taskData));

    if (createTaskResult.status === 201) {
      console.log('✅ Task created successfully!');
      console.log('   Task ID:', createTaskResult.data.task?.id);
      console.log('   Title:', createTaskResult.data.task?.title);
    } else {
      console.log('❌ Task creation failed:', createTaskResult.status);
      console.log('   Response:', createTaskResult.data);
    }

    console.log('\n👨‍👩‍👧‍👦 2. Testing Parent Dashboard - Fetching Parent Tasks...');
    
    const parentTasksResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks?userId=1&role=parent',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    if (parentTasksResult.status === 200) {
      console.log('✅ Parent tasks fetched successfully!');
      console.log('   Number of tasks:', parentTasksResult.data.length || 0);
      if (parentTasksResult.data.length > 0) {
        console.log('   Latest task:', parentTasksResult.data[0].title);
      }
    } else {
      console.log('❌ Parent tasks fetch failed:', parentTasksResult.status);
      console.log('   Response:', parentTasksResult.data);
    }

    console.log('\n🧒 3. Testing Child Dashboard - Fetching Child Tasks...');
    
    const childTasksResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/tasks?userId=1&role=child',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    if (childTasksResult.status === 200) {
      console.log('✅ Child tasks fetched successfully!');
      console.log('   Number of tasks:', childTasksResult.data.length || 0);
      if (childTasksResult.data.length > 0) {
        console.log('   Latest task:', childTasksResult.data[0].title);
        console.log('   XP Reward:', childTasksResult.data[0].xp_reward);
      }
    } else {
      console.log('❌ Child tasks fetch failed:', childTasksResult.status);
      console.log('   Response:', childTasksResult.data);
    }

    console.log('\n👤 4. Testing User Info Fetch...');
    
    const userResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/1',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    if (userResult.status === 200) {
      console.log('✅ User info fetched successfully!');
      console.log('   Name:', userResult.data.name);
      console.log('   Role:', userResult.data.role);
      console.log('   Total XP:', userResult.data.total_xp);
    } else {
      console.log('❌ User info fetch failed:', userResult.status);
      console.log('   Response:', userResult.data);
    }

    console.log('\n📋 5. Testing Submission Summary...');
    
    const summaryResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/submissions/child/1/summary',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    if (summaryResult.status === 200) {
      console.log('✅ Submission summary fetched successfully!');
      console.log('   Response:', JSON.stringify(summaryResult.data, null, 2));
    } else {
      console.log('❌ Submission summary fetch failed:', summaryResult.status);
      console.log('   Response:', summaryResult.data);
    }

    console.log('\n🎯 SUMMARY:');
    console.log('- Task Creation:', createTaskResult.status === 201 ? '✅ Working' : '❌ Failed');
    console.log('- Parent Task View:', parentTasksResult.status === 200 ? '✅ Working' : '❌ Failed');
    console.log('- Child Task View:', childTasksResult.status === 200 ? '✅ Working' : '❌ Failed');
    console.log('- User Info:', userResult.status === 200 ? '✅ Working' : '❌ Failed');
    console.log('- Submission Summary:', summaryResult.status === 200 ? '✅ Working' : '❌ Failed');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Check if server is running first
console.log('🔍 Checking if backend server is running...');
makeRequest({
  hostname: 'localhost',
  port: 5000,
  path: '/test',
  method: 'GET'
}).then((result) => {
  if (result.status === 200) {
    console.log('✅ Backend server is running!\n');
    testTaskFlow();
  } else {
    console.log('❌ Backend server is not responding. Please start it with:');
    console.log('   cd /home/vasanth/vscode/gameUP/task-tracker-backend && node test-auth.js');
  }
}).catch((error) => {
  console.log('❌ Cannot connect to backend server:', error.message);
  console.log('   Please start it with:');
  console.log('   cd /home/vasanth/vscode/gameUP/task-tracker-backend && node test-auth.js');
});
