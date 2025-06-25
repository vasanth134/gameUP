#!/bin/bash

echo "Stopping existing backend processes..."
pkill -f "node.*task-tracker-backend" || true
pkill -f "ts-node.*task-tracker-backend" || true

echo "Starting backend server..."
cd /home/vasanth/vscode/gameUP/task-tracker-backend
npm run dev &

echo "Backend server starting in background..."
echo "Waiting 3 seconds for server to start..."
sleep 3

echo "Testing backend endpoints..."
echo "Testing parent children endpoint..."
curl -s "http://localhost:5000/api/users/parent/1/children" | jq . || echo "Endpoint not ready yet"

echo "Testing tasks endpoint for parent..."
curl -s "http://localhost:5000/api/tasks?userId=1&role=parent" | jq . || echo "Endpoint not ready yet"

echo "Testing tasks endpoint for child..."
curl -s "http://localhost:5000/api/tasks?userId=2&role=child" | jq . || echo "Endpoint not ready yet"
