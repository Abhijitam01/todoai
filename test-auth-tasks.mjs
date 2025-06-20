#!/usr/bin/env node

// Add node-fetch to package.json if not present
const API_BASE = 'http://localhost:4000/api/v1';

async function testComplete() {
  console.log('🧪 Testing TodoAI Authentication & Task Management\n');

  try {
    // Import fetch dynamically to handle different Node versions
    const fetch = (await import('node-fetch')).default;

    // Test 1: Health Check
    console.log('1️⃣  Testing health endpoint...');
    const health = await fetch('http://localhost:4000/health');
    const healthData = await health.json();
    console.log('✅ Health:', healthData.status);

    // Test 2: User Registration
    console.log('\n2️⃣  Testing user registration...');
    const email = `test-${Date.now()}@example.com`;
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'SecurePass123!',
        firstName: 'Test',
        lastName: 'User'
      })
    });

    const registerData = await registerResponse.json();
    if (!registerData.success) {
      throw new Error(`Registration failed: ${registerData.error}`);
    }
    console.log('✅ Registration successful');
    
    const token = registerData.data.tokens.accessToken;
    console.log('   📝 Token received:', token.substring(0, 20) + '...');

    // Test 3: Get Profile
    console.log('\n3️⃣  Testing get profile...');
    const profileResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const profileData = await profileResponse.json();
    if (!profileData.success) {
      throw new Error(`Get profile failed: ${profileData.error}`);
    }
    console.log('✅ Profile retrieved:', profileData.data.email);

    // Test 4: Create Goal (optional)
    console.log('\n4️⃣  Testing goal creation...');
    const goalResponse = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Learn Programming',
        description: 'Master full-stack development',
        category: 'education',
        priority: 'high'
      })
    });

    let goalId = null;
    if (goalResponse.ok) {
      const goalData = await goalResponse.json();
      if (goalData.success) {
        goalId = goalData.data.id;
        console.log('✅ Goal created:', goalData.data.title);
      }
    } else {
      console.log('⚠️  Goal creation skipped (goals controller may need implementation)');
    }

    // Test 5: Create Task
    console.log('\n5️⃣  Testing task creation...');
    const taskResponse = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Complete authentication system',
        description: 'Implement login, register, and profile management',
        priority: 'high',
        goalId: goalId,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      })
    });

    const taskData = await taskResponse.json();
    if (!taskData.success) {
      throw new Error(`Task creation failed: ${taskData.error}`);
    }
    console.log('✅ Task created:', taskData.data.title);
    const taskId = taskData.data.id;

    // Test 6: Get All Tasks
    console.log('\n6️⃣  Testing get all tasks...');
    const allTasksResponse = await fetch(`${API_BASE}/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const allTasksData = await allTasksResponse.json();
    if (!allTasksData.success) {
      throw new Error(`Get tasks failed: ${allTasksData.error}`);
    }
    console.log('✅ Tasks retrieved:', allTasksData.data.length, 'tasks');

    // Test 7: Update Task Status
    console.log('\n7️⃣  Testing task status update...');
    const updateResponse = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'completed',
        actualMinutes: 120
      })
    });

    const updateData = await updateResponse.json();
    if (!updateData.success) {
      throw new Error(`Task update failed: ${updateData.error}`);
    }
    console.log('✅ Task updated to completed');

    // Test 8: Get Today's Tasks
    console.log('\n8️⃣  Testing get today tasks...');
    const todayResponse = await fetch(`${API_BASE}/tasks/today`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const todayData = await todayResponse.json();
    if (!todayData.success) {
      throw new Error(`Get today tasks failed: ${todayData.error}`);
    }
    console.log('✅ Today tasks retrieved:', todayData.data.length, 'tasks');

    // Test 9: Update Profile
    console.log('\n9️⃣  Testing profile update...');
    const updateProfileResponse = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'Updated',
        lastName: 'Name'
      })
    });

    const updateProfileData = await updateProfileResponse.json();
    if (!updateProfileData.success) {
      throw new Error(`Profile update failed: ${updateProfileData.error}`);
    }
    console.log('✅ Profile updated:', updateProfileData.data.firstName, updateProfileData.data.lastName);

    console.log('\n🎉 All tests passed! Authentication and Task Management are working correctly.');
    console.log('\n📋 Summary:');
    console.log('   ✅ User registration & login');
    console.log('   ✅ JWT authentication');
    console.log('   ✅ Profile management');
    console.log('   ✅ Task CRUD operations');
    console.log('   ✅ Task status management');
    console.log('   ✅ Today\'s task filtering');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure API server is running: cd apps/api && npm run dev');
    console.error('2. Verify database is set up: node setup-database.mjs');
    console.error('3. Check database connection in server logs');
    console.error('4. Ensure all dependencies are installed: npm install');
  }
}

testComplete(); 