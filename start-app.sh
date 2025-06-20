#!/bin/bash

echo "🚀 Starting TodoAI Application..."

# Kill any existing processes on the ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:4001 | xargs kill -9 2>/dev/null || true

sleep 2

echo "📚 Building packages..."
npm run build --silent

echo "🌐 Starting frontend on port 3000..."
cd apps/web && npm run dev &
FRONTEND_PID=$!

sleep 3

echo "⚡ Starting API on port 4001..."
cd ../api && PORT=4001 npm run dev &
API_PID=$!

sleep 5

echo ""
echo "🎉 TodoAI is now running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API: http://localhost:4001"
echo "🏥 Health Check: http://localhost:4001/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $FRONTEND_PID $API_PID 