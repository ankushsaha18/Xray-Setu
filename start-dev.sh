#!/bin/bash

# Script to start both backend and frontend development servers

echo "Starting Xray Setu Development Environment..."

# Start backend server in background
echo "Starting backend server..."
cd backend/core
python manage.py runserver > ../../backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Start frontend server in background
echo "Starting frontend server..."
cd xraysetu
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "Backend server started with PID: $BACKEND_PID"
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Development servers are now running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000 (or next available port)"
echo ""
echo "To stop the servers, run: kill $BACKEND_PID $FRONTEND_PID"
echo "Logs are available in backend.log and frontend.log"