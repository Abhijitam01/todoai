#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Setting up TodoAI Development Environment...\n');

// Check if we're using Neon or local database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/todoai';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';

// Create environment files if they don't exist
const apiEnvPath = join(__dirname, 'apps/api/.env.local');
if (!existsSync(apiEnvPath)) {
  console.log('📝 Creating API environment file...');
  const envContent = `# TodoAI API Environment Configuration
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=12
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
`;
  
  writeFileSync(apiEnvPath, envContent);
  console.log('✅ API environment file created at apps/api/.env.local');
}

// Install dependencies if needed
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
}

// Build packages
console.log('\n🔨 Building packages...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Packages built successfully');
} catch (error) {
  console.error('❌ Failed to build packages:', error.message);
}

// Start the API server
console.log('\n🚀 Starting API server...');
console.log('Database URL:', DATABASE_URL);
console.log('API will be available at: http://localhost:4000');
console.log('Health check: http://localhost:4000/health');
console.log('\n📋 Next steps:');
console.log('1. Make sure your database is running and accessible');
console.log('2. Run database migrations if needed');
console.log('3. Test the API with: node test-api.mjs');
console.log('4. Start the frontend: cd apps/web && npm run dev');

try {
  execSync('cd apps/api && npm run dev', { stdio: 'inherit', cwd: __dirname });
} catch (error) {
  console.error('❌ Failed to start API server:', error.message);
  console.log('\n💡 Try manually:');
  console.log('cd apps/api');
  console.log('npm run dev');
} 