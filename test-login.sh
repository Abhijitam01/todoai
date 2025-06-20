#!/bin/bash

echo "🔐 TodoAI Login Diagnostic & Fix"
echo "================================="

cd /home/dubeyji/Downloads/todoai

# Kill all processes
echo "🧹 Killing all processes..."
ps aux | grep -E "(tsx|next)" | grep -v grep | awk '{print $2}' | xargs kill 2>/dev/null || true
sleep 3

# Find an available port
find_port() {
    for port in 5000 5001 5002 5003 5004; do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
            echo $port
            return
        fi
    done
    echo "Error: No available ports"
    exit 1
}

API_PORT=$(find_port)
echo "✅ Using port: $API_PORT"

# Start API server
echo "⚡ Starting API server on port $API_PORT..."
cd apps/api
PORT=$API_PORT npm run dev > ../../api-test.log 2>&1 &
API_PID=$!
echo "API PID: $API_PID"

# Wait for API to start
echo "⏳ Waiting for API to start..."
sleep 8

# Test API health
echo "🔍 Testing API health..."
if curl -s http://localhost:$API_PORT/health > /dev/null; then
    echo "✅ API is running on port $API_PORT"
else
    echo "❌ API failed to start. Log:"
    tail -20 ../../api-test.log
    exit 1
fi

# Update frontend config
echo "🔧 Updating frontend API URL..."
cd ../web
echo "NEXT_PUBLIC_API_URL=http://localhost:$API_PORT/api/v1" > .env.local

# Test registration first (to create a user)
echo ""
echo "📝 Step 1: Testing Registration..."
reg_response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:$API_PORT/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"testuser@example.com","password":"password123"}')

reg_status=$(echo "$reg_response" | tail -n1)
reg_body=$(echo "$reg_response" | head -n -1)

echo "Registration Status: $reg_status"

if [ "$reg_status" = "201" ]; then
    echo "✅ Registration successful!"
    echo "Response: $reg_body"
elif [ "$reg_status" = "409" ]; then
    echo "⚠️  User already exists (testing login with existing user)"
else
    echo "❌ Registration failed!"
    echo "Response: $reg_body"
    echo ""
    echo "This might be a database issue. Make sure you've created tables in Neon:"
    echo "1. Go to https://console.neon.tech/"
    echo "2. Select project: weathered-mouse-a80t01b0"
    echo "3. SQL Editor → Copy from create-tables.sql → Execute"
    echo ""
    echo "API is running on: http://localhost:$API_PORT"
    echo "Check logs: tail -f api-test.log"
    exit 1
fi

# Test login
echo ""
echo "🔑 Step 2: Testing Login..."
login_response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:$API_PORT/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}')

login_status=$(echo "$login_response" | tail -n1)
login_body=$(echo "$login_response" | head -n -1)

echo "Login Status: $login_status"

if [ "$login_status" = "200" ]; then
    echo "✅ LOGIN SUCCESSFUL!"
    echo "Response: $login_body"
    
    # Extract token for testing protected routes
    token=$(echo "$login_body" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$token" ]; then
        echo ""
        echo "🔒 Step 3: Testing Protected Route..."
        profile_response=$(curl -s -w "\n%{http_code}" -X GET http://localhost:$API_PORT/api/v1/auth/me \
          -H "Authorization: Bearer $token")
        
        profile_status=$(echo "$profile_response" | tail -n1)
        profile_body=$(echo "$profile_response" | head -n -1)
        
        echo "Profile Status: $profile_status"
        if [ "$profile_status" = "200" ]; then
            echo "✅ Protected route working!"
            echo "Profile: $profile_body"
        else
            echo "❌ Protected route failed: $profile_body"
        fi
    fi
    
elif [ "$login_status" = "401" ]; then
    echo "❌ LOGIN FAILED: Invalid credentials"
    echo "Response: $login_body"
    echo ""
    echo "This could mean:"
    echo "1. Password doesn't match"
    echo "2. User doesn't exist"
    echo "3. Database/auth issues"
    
elif [ "$login_status" = "000" ]; then
    echo "❌ LOGIN FAILED: API not responding"
    
else
    echo "❌ LOGIN FAILED with status $login_status"
    echo "Response: $login_body"
fi

# Start frontend if login works
if [ "$login_status" = "200" ]; then
    echo ""
    echo "🌐 Starting frontend..."
    npm run dev > ../../frontend-test.log 2>&1 &
    FRONTEND_PID=$!
    
    sleep 5
    
    echo ""
    echo "🎉 TODOAI IS READY!"
    echo "==================="
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 API: http://localhost:$API_PORT"
    echo "🏥 Health: http://localhost:$API_PORT/health"
    echo ""
    echo "✅ You can now:"
    echo "  - Login with: testuser@example.com / password123"
    echo "  - Create new accounts on the signup page"
    echo "  - Access the dashboard after login"
    echo ""
    echo "📊 Logs:"
    echo "  API: tail -f api-test.log"
    echo "  Frontend: tail -f frontend-test.log"
else
    echo ""
    echo "🚨 LOGIN ISSUES DETECTED"
    echo "========================"
    echo "API is running on: http://localhost:$API_PORT"
    echo "Check API logs: tail -f api-test.log"
    echo ""
    echo "Common fixes:"
    echo "1. Ensure database tables exist in Neon"
    echo "2. Check database connection string"
    echo "3. Verify user exists with correct password"
fi

echo ""
echo "Press Ctrl+C to exit (servers will continue running)"
trap "echo 'Exiting...'; exit 0" INT
while true; do sleep 10; done 