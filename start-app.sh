#!/bin/bash

# Xray Setu App Startup Script

echo "Starting Xray Setu Application..."

# Kill any existing processes
echo "Killing existing processes..."
pkill -f "manage.py runserver" 2>/dev/null
pkill -f "next dev" 2>/dev/null

# Wait a moment for processes to terminate
sleep 2

# Start backend server
echo "Starting backend server..."
cd backend/core
python manage.py runserver > /tmp/cdss-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd ../../xraysetu
npm run dev > /tmp/cdss-frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Check if processes are running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend server started successfully (PID: $BACKEND_PID)"
    echo "   Access at: http://localhost:8000"
else
    echo "❌ Backend server failed to start"
    echo "   Check /tmp/cdss-backend.log for details"
fi

if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend server started successfully (PID: $FRONTEND_PID)"
    
    # Try to get the actual port from the log file
    PORT=$(grep -o "Local:.*:[0-9]*" /tmp/cdss-frontend.log | grep -o "[0-9]*$")
    if [ ! -z "$PORT" ]; then
        echo "   Access at: http://localhost:$PORT"
    else
        echo "   Access at: http://localhost:3000 (or next available port)"
    fi
else
    echo "❌ Frontend server failed to start"
    echo "   Check /tmp/cdss-frontend.log for details"
fi

echo ""
echo "Application startup complete!"
echo "Use 'stop-app.sh' to stop the servers when finished."