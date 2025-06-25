#!/bin/bash

# Kill any existing node processes on port 5000
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*5000" 2>/dev/null || true
pkill -f "node.*test-auth" 2>/dev/null || true

# Wait a moment
sleep 2

# Start the test server
echo "🚀 Starting backend server..."
cd /home/vasanth/vscode/gameUP/task-tracker-backend
nohup node test-auth.js > server.log 2>&1 &

# Get the PID
PID=$!
echo "📋 Backend server started with PID: $PID"

# Wait a moment and check if it's running
sleep 3

if ps -p $PID > /dev/null; then
    echo "✅ Backend server is running successfully on http://localhost:5000"
    echo "📄 Check server.log for details"
    echo "🔍 Test endpoint: http://localhost:5000/test"
else
    echo "❌ Backend server failed to start"
    echo "📄 Checking logs:"
    cat server.log
fi
