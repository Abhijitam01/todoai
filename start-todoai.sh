#!/bin/bash

# TodoAI Startup Script
echo "🚀 Starting TodoAI Application..."

# Navigate to project root
cd /home/dubeyji/Downloads/todoai

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "tsx.*server.ts" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:4001 | xargs kill -9 2>/dev/null || true

sleep 3

# Function to check if port is free
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null; then
        echo "Port $1 is in use"
        return 1
    else
        echo "Port $1 is available"
        return 0
    fi
}

# Check ports
check_port 3000
check_port 4001

echo ""
echo "📚 Building packages..."
npm run build --silent || echo "Build had issues but continuing..."

echo ""
echo "⚡ Starting API server on port 4001..."
cd apps/api
PORT=4001 npm run dev > ../../api.log 2>&1 &
API_PID=$!
echo "API PID: $API_PID"

sleep 5

# Test API
echo "🔍 Testing API connection..."
if curl -s http://localhost:4001/health > /dev/null; then
    echo "✅ API server is responding on port 4001"
else
    echo "❌ API server not responding - check api.log"
    cat ../../api.log | tail -20
fi

echo ""
echo "🌐 Starting frontend on port 3000..."
cd ../web
npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

sleep 5

# Test Frontend
echo "🔍 Testing frontend connection..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is responding on port 3000"
else
    echo "❌ Frontend not responding - check frontend.log"
fi

echo ""
echo "🎉 TodoAI Application Status:"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API: http://localhost:4001"
echo "🏥 Health Check: http://localhost:4001/health"
echo ""
echo "📋 Important: Make sure you've created the database tables in Neon console"
echo "📋 SQL Script: /home/dubeyji/Downloads/todoai/create-tables.sql"
echo ""
echo "📊 Logs:"
echo "   API: tail -f /home/dubeyji/Downloads/todoai/api.log"
echo "   Frontend: tail -f /home/dubeyji/Downloads/todoai/frontend.log"
echo ""
echo "🛑 To stop: pkill -f 'next dev'; pkill -f 'tsx.*server.ts'"
echo ""
echo "Press Ctrl+C to stop monitoring (apps will continue running)"

# Wait for user interrupt
trap "echo 'Monitoring stopped. Apps are still running.'; exit 0" INT
while true; do
    sleep 10
    # Check if processes are still running
    if ! kill -0 $API_PID 2>/dev/null; then
        echo "⚠️  API process died!"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "⚠️  Frontend process died!"
        break
    fi
done 