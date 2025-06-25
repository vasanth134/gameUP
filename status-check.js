#!/usr/bin/env node

const http = require('http');
const { exec } = require('child_process');

console.log('🔍 GameUP Application Status Check\n');

// Function to test a URL
function testURL(url, name) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      console.log(`✅ ${name}: Running (Status: ${res.statusCode})`);
      resolve(true);
    });

    req.on('error', () => {
      console.log(`❌ ${name}: Not running`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name}: Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function checkStatus() {
  console.log('📡 Checking Server Status...');
  
  const frontendRunning = await testURL('http://localhost:5173', 'Frontend (Vite)');
  const backendRunning = await testURL('http://localhost:5000/test', 'Backend (Express)');
  
  console.log('\n📋 Status Summary:');
  console.log(`Frontend: ${frontendRunning ? '✅ Running' : '❌ Not Running'}`);
  console.log(`Backend: ${backendRunning ? '✅ Running' : '❌ Not Running'}`);
  
  if (!frontendRunning) {
    console.log('\n🚀 To start frontend:');
    console.log('cd /home/vasanth/vscode/gameUP/gamified-task-frontend && npm run dev');
  }
  
  if (!backendRunning) {
    console.log('\n🚀 To start backend:');
    console.log('cd /home/vasanth/vscode/gameUP/task-tracker-backend && node test-auth.js');
  }
  
  if (frontendRunning && backendRunning) {
    console.log('\n🎉 Both servers are running!');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔗 Backend: http://localhost:5000');
    console.log('\n✨ Application should be fully functional!');
  }
}

checkStatus();
