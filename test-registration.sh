#!/bin/bash

echo "🧪 Testing TodoAI Registration..."

# Test if API is running
echo "1. Testing API health..."
if curl -s http://localhost:4001/health > /dev/null; then
    echo "✅ API is running"
else
    echo "❌ API is not running. Starting it now..."
    cd /home/dubeyji/Downloads/todoai/apps/api
    PORT=4001 npm run dev &
    sleep 8
fi

echo ""
echo "2. Testing registration..."
response=$(curl -s -w "\n%{http_code}" -X POST http://localhost:4001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}')

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

echo "Status Code: $status_code"
echo "Response: $body"

if [ "$status_code" = "201" ]; then
    echo "✅ Registration successful!"
    echo ""
    echo "🎉 Your TodoAI app is working!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 API: http://localhost:4001"
    echo ""
    echo "Try creating an account on the frontend now!"
elif [ "$status_code" = "409" ]; then
    echo "⚠️  Email already exists (this is expected if you test multiple times)"
    echo "✅ Registration endpoint is working!"
elif [ "$status_code" = "000" ]; then
    echo "❌ API not responding. Make sure you've:"
    echo "   1. Created database tables in Neon console"
    echo "   2. Started the API server"
else
    echo "❌ Registration failed with status $status_code"
    echo "Check error message above"
fi 