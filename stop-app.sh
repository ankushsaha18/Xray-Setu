#!/bin/bash

# Xray Setu App Stop Script

echo "Stopping Xray Setu Application..."

# Kill backend server
echo "Stopping backend server..."
pkill -f "manage.py runserver"

# Kill frontend server
echo "Stopping frontend server..."
pkill -f "next dev"

# Wait for processes to terminate
sleep 2

# Check if any processes are still running
BACKEND_COUNT=$(pgrep -f "manage.py runserver" | wc -l)
FRONTEND_COUNT=$(pgrep -f "next dev" | wc -l)

if [ $BACKEND_COUNT -eq 0 ]; then
    echo "✅ Backend server stopped successfully"
else
    echo "⚠️  Backend server may still be running"
fi

if [ $FRONTEND_COUNT -eq 0 ]; then
    echo "✅ Frontend server stopped successfully"
else
    echo "⚠️  Frontend server may still be running"
fi

echo ""
echo "Application stopped."