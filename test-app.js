const http = require('http');

console.log('🧪 Testing GameUP Application...');

// Test function
function testEndpoint(options, description) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`${res.statusCode === 200 ? '✅' : '❌'} ${description}: ${res.statusCode}`);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.message || parsed.success !== undefined) {
              console.log(`   Response: ${parsed.message || JSON.stringify(parsed)}`);
            }
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
        }
        resolve({ status: res.statusCode, data });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve({ status: 'error', error: err.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Timeout`);
      req.destroy();
      resolve({ status: 'timeout' });
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n🔍 Testing Backend Endpoints...');
  
  // Test server health
  await testEndpoint({
    hostname: 'localhost',
    port: 5000,
    path: '/test',
    method: 'GET'
  }, 'Backend Health Check');
  
  // Test CORS preflight
  await testEndpoint({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/parent/login',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  }, 'CORS Preflight Check');
  
  console.log('\n🔍 Testing Frontend Server...');
  
  // Test frontend server
  await testEndpoint({
    hostname: 'localhost',
    port: 5173,
    path: '/',
    method: 'GET'
  }, 'Frontend Server Check');
  
  console.log('\n✅ Testing completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. If backend is not running, start it with: node test-auth.js');
  console.log('2. Frontend should be accessible at: http://localhost:5173');
  console.log('3. Backend API should be accessible at: http://localhost:5000');
}

runTests();
