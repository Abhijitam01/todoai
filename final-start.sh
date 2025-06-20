#!/bin/bash

echo "🚀 Final TodoAI Startup Script"
echo "============================================"

# Navigate to project
cd /home/dubeyji/Downloads/todoai

# Kill ALL existing processes aggressively
echo "🧹 Cleaning up ALL existing processes..."
pkill -9 -f "tsx.*server.ts" 2>/dev/null || true
pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "node.*next" 2>/dev/null || true
for port in 3000 4000 4001 4002; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

sleep 3

echo "✅ All processes killed"
echo ""

# Start API server on port 4002 (different port to avoid conflicts)
echo "⚡ Starting API server on port 4002..."
cd apps/api
PORT=4002 npm run dev > ../../api-final.log 2>&1 &
API_PID=$!
echo "API PID: $API_PID"

sleep 8

# Test API
echo "🔍 Testing API..."
if curl -s http://localhost:4002/health > /dev/null; then
    echo "✅ API server running on port 4002"
    
    # Update frontend config
    echo "🔧 Updating frontend API URL..."
    cd ../web
    echo 'NEXT_PUBLIC_API_URL=http://localhost:4002/api/v1' > .env.local
    
    # Start frontend
    echo "🌐 Starting frontend on port 3000..."
    npm run dev > ../../frontend-final.log 2>&1 &
    FRONTEND_PID=$!
    
    sleep 5
    
    echo ""
    echo "🎉 TodoAI IS RUNNING!"
    echo "============================================"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 API: http://localhost:4002"
    echo "🏥 Health: http://localhost:4002/health"
    echo "============================================"
    echo ""
    echo "🧪 Testing registration..."
    response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:4002/api/v1/auth/register \
      -H "Content-Type: application/json" \
      -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}')
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "Registration Test Status: $status_code"
    
    if [ "$status_code" = "201" ]; then
        echo "✅ REGISTRATION WORKS! You can now create accounts!"
    elif [ "$status_code" = "409" ]; then
        echo "✅ REGISTRATION ENDPOINT WORKS! (Email already exists)"
    else
        echo "❌ Registration issue - probably missing database tables"
        echo "Response: $body"
        echo ""
        echo "🚨 MAKE SURE YOU'VE CREATED DATABASE TABLES:"
        echo "   1. Go to https://console.neon.tech/"
        echo "   2. Select project: weathered-mouse-a80t01b0"
        echo "   3. SQL Editor → Copy ALL from create-tables.sql → Execute"
    fi
    
    echo ""
    echo "📊 Logs available at:"
    echo "   API: tail -f /home/dubeyji/Downloads/todoai/api-final.log"
    echo "   Frontend: tail -f /home/dubeyji/Downloads/todoai/frontend-final.log"
    
else
    echo "❌ API failed to start - check api-final.log"
    tail -20 ../../api-final.log
fi

echo ""
echo "Press Ctrl+C to exit (apps will continue running)"
trap "echo 'Exiting monitor...'; exit 0" INT
while true; do sleep 10; done 