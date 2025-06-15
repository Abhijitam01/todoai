# TodoAI Implementation Guide 🛠️
*Step-by-step technical implementation for the next phase*

## 🎯 **Immediate Priority Tasks (Next 2 Weeks)**

### **Task 1: Neon Database Setup** ⚡ *Priority: Critical*

#### **Step 1.1: Create Neon Database**
```bash
# 1. Go to https://neon.tech and create account
# 2. Create new project: "todoai-production"
# 3. Copy connection string
```

#### **Step 1.2: Environment Configuration**
```bash
# Create .env files for each app
touch apps/api/.env
touch apps/web/.env.local
```

**apps/api/.env:**
```env
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
NODE_ENV="development"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
REFRESH_TOKEN_EXPIRES_IN="7d"
BCRYPT_ROUNDS="12"

# API
PORT="4000"
FRONTEND_URL="http://localhost:3001"

# AI (for later)
OPENAI_API_KEY="your-openai-key"
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3001"
```

#### **Step 1.3: Database Migration**
```bash
cd packages/database
npm run generate  # Generate migration files
npm run migrate   # Run migrations
```

#### **Step 1.4: Database Seeding**
Create `packages/database/src/seed.ts`:
```typescript
import { db } from './client';
import { users, goals, tasks } from './schema';

export async function seedDatabase() {
  // Create sample users
  const sampleUsers = await db.insert(users).values([
    {
      email: 'demo@todoai.com',
      password: 'hashedpassword', // Will implement proper hashing
      firstName: 'Demo',
      lastName: 'User',
      isEmailVerified: true,
    }
  ]).returning();

  // Create sample goals and tasks
  // ... implementation
}
```

---

### **Task 2: JWT Authentication Implementation** 🔐 *Priority: Critical*

#### **Step 2.1: Fix JWT Package Issues**
```bash
cd packages/auth
npm install --save-dev @types/jsonwebtoken@^9.0.6
```

**packages/auth/src/jwt.ts:** (New file)
```typescript
import jwt from 'jsonwebtoken';
import { JWTPayload, AuthTokens, User } from './types';

export class JWTService {
  private secret: string;
  private expiresIn: string;

  constructor(secret: string, expiresIn: string = '24h') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateTokens(user: User): AuthTokens {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });

    return {
      accessToken,
      refreshToken: accessToken, // Simplified for now
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
    };
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch {
      return null;
    }
  }
}
```

#### **Step 2.2: Update Auth Middleware**
**packages/auth/src/middleware.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './types';
import { JWTService } from './jwt';

const jwtService = new JWTService(process.env.JWT_SECRET!);

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user info to request
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

#### **Step 2.3: Password Hashing**
**packages/auth/src/password.ts:** (New file)
```typescript
import bcrypt from 'bcryptjs';

export class PasswordService {
  private rounds: number;

  constructor(rounds: number = 12) {
    this.rounds = rounds;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.rounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const passwordService = new PasswordService();
```

---

### **Task 3: API Database Integration** 🔌 *Priority: High*

#### **Step 3.1: Update API Routes with Database**
**apps/api/src/routes/auth.ts:**
```typescript
import express from 'express';
import { db } from '@todoai/database';
import { users } from '@todoai/database/schema';
import { passwordService } from '@todoai/auth/password';
import { JWTService } from '@todoai/auth/jwt';
import { eq } from 'drizzle-orm';

const router = express.Router();
const jwtService = new JWTService(process.env.JWT_SECRET!);

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await passwordService.hash(password);
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      })
      .returning();

    // Generate tokens
    const tokens = jwtService.generateTokens(newUser[0]);

    res.status(201).json({
      success: true,
      user: { ...newUser[0], password: undefined },
      tokens,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await passwordService.compare(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = jwtService.generateTokens(user[0]);

    res.json({
      success: true,
      user: { ...user[0], password: undefined },
      tokens,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

#### **Step 3.2: Goals API with Database**
**apps/api/src/routes/goals.ts:**
```typescript
import express from 'express';
import { db } from '@todoai/database';
import { goals } from '@todoai/database/schema';
import { authMiddleware, AuthRequest } from '@todoai/auth';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

// Get all goals for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, req.user!.id));

    res.json({ success: true, data: userGoals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create new goal
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, category, priority, targetDate } = req.body;
    
    const newGoal = await db
      .insert(goals)
      .values({
        userId: req.user!.id,
        title,
        description,
        category,
        priority,
        targetDate: targetDate ? new Date(targetDate) : null,
      })
      .returning();

    res.status(201).json({ success: true, data: newGoal[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedGoal = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(goals.id, id), eq(goals.userId, req.user!.id)))
      .returning();

    if (updatedGoal.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ success: true, data: updatedGoal[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete goal
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const deletedGoal = await db
      .delete(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, req.user!.id)))
      .returning();

    if (deletedGoal.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
```

---

### **Task 4: Frontend API Integration** 🌐 *Priority: High*

#### **Step 4.1: API Client Setup**
**apps/web/lib/api-client.ts:** (New file)
```typescript
class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<any>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.tokens?.accessToken) {
      this.setToken(response.tokens.accessToken);
    }
    
    return response;
  }

  async register(userData: any) {
    const response = await this.request<any>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.tokens?.accessToken) {
      this.setToken(response.tokens.accessToken);
    }
    
    return response;
  }

  // Goals methods
  async getGoals() {
    return this.request<any>('/api/v1/goals');
  }

  async createGoal(goalData: any) {
    return this.request<any>('/api/v1/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async updateGoal(id: string, updates: any) {
    return this.request<any>(`/api/v1/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGoal(id: string) {
    return this.request<any>(`/api/v1/goals/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
);
```

#### **Step 4.2: Authentication Context**
**apps/web/contexts/AuthContext.tsx:** (New file)
```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = apiClient.getToken();
    if (token) {
      // Verify token and get user info
      // Implementation depends on your token verification endpoint
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiClient.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

### **Task 5: Basic AI Integration** 🤖 *Priority: Medium*

#### **Step 5.1: OpenAI Package Setup**
```bash
cd packages/ai
npm install openai@^4.0.0
```

**packages/ai/src/openai-client.ts:** (New file)
```typescript
import OpenAI from 'openai';

export class AIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async planGoal(goalTitle: string, goalDescription?: string): Promise<string[]> {
    try {
      const prompt = `
        Break down this goal into actionable tasks:
        Goal: ${goalTitle}
        ${goalDescription ? `Description: ${goalDescription}` : ''}
        
        Provide 5-8 specific, actionable tasks that would help achieve this goal.
        Format as a simple list.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('AI planning failed:', error);
      return ['Break down this goal into smaller tasks'];
    }
  }
}

export const aiService = new AIService(process.env.OPENAI_API_KEY || '');
```

#### **Step 5.2: AI API Endpoints**
**apps/api/src/routes/ai.ts:** (New file)
```typescript
import express from 'express';
import { aiService } from '@todoai/ai';
import { authMiddleware, AuthRequest } from '@todoai/auth';

const router = express.Router();

router.post('/plan-goal', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Goal title is required' });
    }

    const tasks = await aiService.planGoal(title, description);
    
    res.json({
      success: true,
      data: { suggestedTasks: tasks }
    });
  } catch (error) {
    res.status(500).json({ error: 'AI planning failed' });
  }
});

export default router;
```

---

## 🚀 **Implementation Timeline**

### **Week 1 (Current)**
- [x] Monorepo setup complete
- [x] Database schema designed
- [x] API server running
- [x] UI components built

### **Week 2 (Next Week)**
- [ ] **Day 1-2**: Neon database setup and migration
- [ ] **Day 3-4**: JWT authentication implementation
- [ ] **Day 5-7**: API database integration

### **Week 3**
- [ ] **Day 1-3**: Frontend API integration
- [ ] **Day 4-5**: Basic AI features
- [ ] **Day 6-7**: Testing and bug fixes

### **Week 4**
- [ ] **Day 1-3**: Advanced AI features
- [ ] **Day 4-5**: UI/UX improvements
- [ ] **Day 6-7**: Production deployment prep

---

## 📋 **Testing Strategy**

### **Unit Tests**
```bash
# Add to each package
npm install --save-dev jest @types/jest ts-jest

# Example test structure
packages/auth/__tests__/jwt.test.ts
packages/database/__tests__/schema.test.ts
apps/api/__tests__/routes/auth.test.ts
```

### **Integration Tests**
```bash
# API integration tests
apps/api/__tests__/integration/auth.integration.test.ts
apps/api/__tests__/integration/goals.integration.test.ts
```

### **E2E Tests**
```bash
# Frontend E2E tests
apps/web/__tests__/e2e/auth.e2e.test.ts
apps/web/__tests__/e2e/goals.e2e.test.ts
```

---

## 🔧 **Development Workflow**

### **Daily Development Process**
1. **Start servers**: `npm run dev` (runs both API and web)
2. **Database changes**: Update schema → generate migration → run migration
3. **API changes**: Update routes → test with Postman/curl
4. **Frontend changes**: Update components → test in browser
5. **Commit**: Use conventional commits (feat:, fix:, docs:, etc.)

### **Branch Strategy**
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Critical fixes

---

*This implementation guide provides the exact steps needed to transform TodoAI from a prototype into a fully functional AI-powered productivity platform. Follow the tasks in order for optimal results.* 