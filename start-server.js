const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GameUP Backend Server...');

// Change to the backend directory
process.chdir('/home/vasanth/vscode/gameUP/task-tracker-backend');

// Start the test-auth.js server
const server = spawn('node', ['test-auth.js'], {
  stdio: ['inherit', 'inherit', 'inherit'],
  detached: false
});

console.log(`📋 Backend server started with PID: ${server.pid}`);
console.log('✅ Backend server should be running on http://localhost:5000');
console.log('🔍 Test endpoint: http://localhost:5000/test');

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
  } else {
    console.log('✅ Server stopped gracefully');
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('🛑 Stopping server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Stopping server...');
  server.kill('SIGTERM');
  process.exit(0);
});
