#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting GameUP Backend...');

// Change to backend directory and start the server
const backendPath = '/home/vasanth/vscode/gameUP/task-tracker-backend';
const serverProcess = spawn('node', ['test-auth.js'], {
  cwd: backendPath,
  stdio: 'inherit'
});

console.log(`📋 Server PID: ${serverProcess.pid}`);
console.log('✅ Backend running on http://localhost:5000');

serverProcess.on('error', (err) => {
  console.error('❌ Server error:', err);
});

serverProcess.on('close', (code) => {
  console.log(`🔄 Server process exited with code ${code}`);
});
