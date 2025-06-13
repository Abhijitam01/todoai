# 🚀 TodoAI → World-Class Application Transformation

*Following [Dub's architecture](https://github.com/dubinc/dub/) patterns for enterprise success*

## 📊 **Why Dub's Architecture Works**

**Dub's Success Metrics:**
- 21.7k+ GitHub stars  
- 100M+ clicks monthly
- Used by Twilio, Buffer, Framer, Vercel
- Modern monorepo with TypeScript
- Enterprise features (SSO, analytics)

## 🏗️ **PHASE 1: Monorepo Foundation (Week 1)**

### **Current vs Target Structure**
```bash
# Current TodoAI Structure
todoai/
├── app/                    # Next.js pages
├── components/             # React components  
├── lib/                    # Utilities
├── backend/                # Express backend
└── package.json

# Target Structure (Like Dub)
todoai/
├── apps/
│   ├── web/               # Next.js frontend
│   ├── api/               # Backend API
│   ├── worker/            # Background jobs
│   └── docs/              # Documentation
├── packages/
│   ├── ui/                # Shared components
│   ├── database/          # Prisma schema
│   ├── auth/              # Authentication
│   ├── ai/                # AI services
│   ├── email/             # Email system
│   └── config/            # Shared configs
├── turbo.json
└── pnpm-workspace.yaml
```

### **Setup Commands**
```bash
# 1. Install modern package manager
curl -fsSL https://get.pnpm.io/install.sh | sh
source ~/.bashrc

# 2. Create monorepo structure
mkdir -p apps/{web,api,worker,docs}
mkdir -p packages/{ui,database,auth,ai,email,config}

# 3. Initialize workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# 4. Setup Turborepo
pnpm add -w turbo
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
EOF
```

## 💾 **PHASE 2: Database Architecture (Week 2)**

### **Modern Prisma Schema**
```typescript
// packages/database/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core Models
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String?
  avatar        String?
  tier          UserTier    @default(FREE)
  stripeId      String?     @unique
  
  // Relationships
  goals         Goal[]
  sessions      Session[]
  teamMembers   TeamMember[]
  
  // Metadata
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  @@map("users")
}

model Goal {
  id              String        @id @default(cuid())
  userId          String
  name            String
  description     String?
  category        GoalCategory
  skillLevel      SkillLevel
  timePerDay      Float
  targetDays      Int
  status          GoalStatus    @default(PLANNING)
  progress        Float         @default(0)
  startDate       DateTime?
  endDate         DateTime?
  
  // AI Features
  aiModelUsed     String?
  planVersion     Int           @default(1)
  adaptationCount Int           @default(0)
  
  // Relationships
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks           Task[]
  milestones      Milestone[]
  adaptations     PlanAdaptation[]
  analytics       GoalAnalytics[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([userId, status])
  @@map("goals")
}

model Task {
  id              String        @id @default(cuid())
  goalId          String
  description     String
  originalDate    DateTime
  currentDueDate  DateTime
  completionDate  DateTime?
  status          TaskStatus    @default(PENDING)
  priority        TaskPriority  @default(MEDIUM)
  estimatedTime   Int?          // minutes
  actualTime      Int?          // minutes
  
  // Organization
  orderInGoal     Int
  weekNumber      Int
  dayInWeek       Int
  milestoneId     String?
  
  // Relationships
  goal            Goal          @relation(fields: [goalId], references: [id], onDelete: Cascade)
  milestone       Milestone?    @relation(fields: [milestoneId], references: [id])
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([goalId, status, currentDueDate])
  @@map("tasks")
}

model Milestone {
  id          String   @id @default(cuid())
  goalId      String
  name        String
  description String?
  weekNumber  Int
  isCompleted Boolean  @default(false)
  
  // Relationships
  goal        Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)
  tasks       Task[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("milestones")
}

// Team Features (Enterprise)
model Team {
  id          String        @id @default(cuid())
  name        String
  slug        String        @unique
  plan        TeamPlan      @default(FREE)
  stripeId    String?       @unique
  
  members     TeamMember[]
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  @@map("teams")
}

model TeamMember {
  id       String    @id @default(cuid())
  teamId   String
  userId   String
  role     TeamRole  @default(MEMBER)
  
  team     Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([teamId, userId])
  @@map("team_members")
}

// Analytics
model GoalAnalytics {
  id              String    @id @default(cuid())
  goalId          String
  date            DateTime  @default(now())
  tasksCompleted  Int       @default(0)
  timeSpent       Int       @default(0) // minutes
  streakDays      Int       @default(0)
  
  goal            Goal      @relation(fields: [goalId], references: [id], onDelete: Cascade)
  
  @@unique([goalId, date])
  @@map("goal_analytics")
}

// Enums
enum UserTier {
  FREE
  PRO
  ENTERPRISE
}

enum GoalStatus {
  PLANNING
  ACTIVE
  PAUSED
  COMPLETED
  ARCHIVED
  FAILED
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  SKIPPED
  OVERDUE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum GoalCategory {
  LEARNING
  FITNESS
  CAREER
  CREATIVE
  BUSINESS
  PERSONAL
  HEALTH
  FINANCE
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum TeamPlan {
  FREE
  STARTUP
  BUSINESS
  ENTERPRISE
}

enum TeamRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}
```

## 🤖 **PHASE 3: AI Package (Week 3)**

### **Advanced AI Planning System**
```typescript
// packages/ai/src/goal-planner.ts
import { OpenAI } from 'openai'
import { z } from 'zod'
import { Goal, Task, PlanAdaptation } from '@todoai/database'

// Schemas
const TaskSchema = z.object({
  day: z.number(),
  task: z.string(),
  timeRequired: z.number().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prerequisites: z.array(z.string()).optional()
})

const WeekSchema = z.object({
  week: z.number(),
  milestone: z.string(),
  description: z.string().optional(),
  learningObjectives: z.array(z.string()).optional(),
  tasks: z.array(TaskSchema)
})

const PlanSchema = z.object({
  overview: z.string(),
  totalWeeks: z.number(),
  estimatedCompletion: z.string(),
  weeks: z.array(WeekSchema)
})

export class AdvancedGoalPlanner {
  private openai: OpenAI
  private model = "gpt-4o"
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    })
  }

  async generatePlan(goal: Goal): Promise<z.infer<typeof PlanSchema>> {
    const prompt = this.buildPlanPrompt(goal)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { 
            role: "system", 
            content: this.getSystemPrompt()
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      })
      
      const content = response.choices[0].message.content!
      const parsed = JSON.parse(content)
      
      return PlanSchema.parse(parsed)
    } catch (error) {
      console.error('AI Plan Generation Error:', error)
      throw new Error('Failed to generate plan')
    }
  }

  async adaptPlan(
    goal: Goal, 
    completedTasks: Task[], 
    overdueTasks: Task[],
    userFeedback?: string
  ): Promise<z.infer<typeof PlanSchema>> {
    const prompt = this.buildAdaptationPrompt(goal, completedTasks, overdueTasks, userFeedback)
    
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        { 
          role: "system", 
          content: this.getAdaptationSystemPrompt()
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    })
    
    const content = response.choices[0].message.content!
    const parsed = JSON.parse(content)
    
    return PlanSchema.parse(parsed)
  }

  async generateInsights(goal: Goal, analytics: any[]): Promise<string[]> {
    const prompt = `Analyze this learning goal progress and provide insights:
    
Goal: ${goal.name}
Progress: ${goal.progress}%
Analytics: ${JSON.stringify(analytics)}

Provide 3-5 actionable insights to improve learning efficiency.`

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: "You are a learning optimization expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    })

    const insights = response.choices[0].message.content!
    return insights.split('\n').filter(line => line.trim().length > 0)
  }

  private getSystemPrompt(): string {
    return `You are an expert learning architect and productivity coach. Your job is to create detailed, personalized learning plans that are:

1. PRACTICAL: Every task should be specific and actionable
2. PROGRESSIVE: Build complexity gradually 
3. ENGAGING: Include variety and real-world applications
4. MEASURABLE: Clear objectives and checkpoints
5. ADAPTIVE: Designed for different learning styles

Focus on creating plans that real people can actually follow and complete.`
  }

  private buildPlanPrompt(goal: Goal): string {
    const categoryContext = this.getCategoryContext(goal.category)
    const skillContext = this.getSkillLevelContext(goal.skillLevel)
    
    return `Create a comprehensive ${goal.targetDays}-day learning plan for: "${goal.name}"

GOAL DETAILS:
- Category: ${goal.category}
- Current Skill Level: ${goal.skillLevel}
- Daily Time Available: ${goal.timePerDay} hours
- Description: ${goal.description || 'No additional description'}

CONTEXT:
${categoryContext}
${skillContext}

REQUIREMENTS:
1. Break into weekly milestones (aim for ${Math.ceil(goal.targetDays / 7)} weeks)
2. Each task must fit within ${goal.timePerDay} hour(s) per day
3. Include progressive skill building
4. Add periodic reviews and practice sessions
5. Include a final project or assessment
6. Consider different learning modalities (reading, practice, projects)

STRUCTURE:
- Start with fundamentals
- Build to intermediate concepts
- End with practical application
- Include 20% buffer time for review and reinforcement

Return JSON with this exact structure:
{
  "overview": "Brief description of the learning journey",
  "totalWeeks": number,
  "estimatedCompletion": "realistic timeline description", 
  "weeks": [
    {
      "week": 1,
      "milestone": "Week milestone title",
      "description": "What will be accomplished this week",
      "learningObjectives": ["objective 1", "objective 2"],
      "tasks": [
        {
          "day": 1,
          "task": "Specific, actionable task description",
          "timeRequired": 1,
          "priority": "MEDIUM",
          "difficulty": "easy"
        }
      ]
    }
  ]
}`
  }

  private getCategoryContext(category: string): string {
    const contexts = {
      LEARNING: "Focus on information retention, skill building, and practical application",
      FITNESS: "Emphasize progressive overload, recovery, and habit formation",
      CAREER: "Balance skill development with networking and real-world application",
      CREATIVE: "Include inspiration, practice, and creative challenges",
      BUSINESS: "Focus on practical implementation and measurable outcomes",
      PERSONAL: "Emphasize habit formation and personal reflection"
    }
    return contexts[category as keyof typeof contexts] || "General skill development approach"
  }

  private getSkillLevelContext(level: string): string {
    const contexts = {
      BEGINNER: "Start with absolute basics, use lots of examples, focus on fundamentals",
      INTERMEDIATE: "Build on existing knowledge, introduce complex concepts gradually",
      ADVANCED: "Focus on nuanced understanding and practical application",
      EXPERT: "Emphasize cutting-edge concepts and mastery of advanced techniques"
    }
    return contexts[level as keyof typeof contexts] || "Adapt to current skill level"
  }
}
```

## 🔐 **PHASE 4: Authentication System (Week 4)**

### **NextAuth.js v5 Setup**
```typescript
// packages/auth/src/config.ts
import { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import { prisma } from "@todoai/database"

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "noreply@todoai.com"
    })
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        tier: user.tier,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.tier = user.tier
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/auth/error',
  },
  session: {
    strategy: "database"
  }
}

// Rate limiting with Upstash
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimits = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
  }),
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
  }),
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
  })
}
```

## 💰 **PHASE 5: Monetization (Week 5)**

### **Stripe Integration**
```typescript
// packages/stripe/src/config.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      '3 active goals',
      'Basic AI planning',
      'Progress tracking',
      'Mobile app access'
    ],
    limits: {
      goals: 3,
      aiGenerations: 5,
      planAdaptations: 2,
      teamMembers: 0
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 1900, // $19.00
    interval: 'month',
    stripeProductId: 'prod_pro',
    stripePriceId: 'price_pro_monthly',
    features: [
      'Unlimited goals',
      'Advanced AI planning',
      'Unlimited plan adaptations',
      'Calendar integration',
      'Progress analytics',
      'Team collaboration (5 members)',
      'Priority support'
    ],
    limits: {
      goals: -1,
      aiGenerations: 100,
      planAdaptations: -1,
      teamMembers: 5
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9900, // $99.00
    interval: 'month',
    stripeProductId: 'prod_enterprise',
    stripePriceId: 'price_enterprise_monthly',
    features: [
      'Everything in Pro',
      'SSO/SAML integration',
      'Advanced security features',
      'Custom AI models',
      'Unlimited team members',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations'
    ],
    limits: {
      goals: -1,
      aiGenerations: -1,
      planAdaptations: -1,
      teamMembers: -1
    }
  }
} as const

// Usage-based pricing for AI features
export const AI_PRICING = {
  planGeneration: 100,    // $1.00
  planAdaptation: 50,     // $0.50
  aiInsights: 25,         // $0.25
  customPrompt: 200       // $2.00
}
```

## 🎯 **Implementation Timeline**

### **Week 1-2: Foundation**
- [x] **Build issues fixed** ✅
- [ ] Set up monorepo structure
- [ ] Migrate to Turborepo
- [ ] Create database schema
- [ ] Set up development environment

### **Week 3-4: Core Features**
- [ ] Implement authentication
- [ ] Build API layer
- [ ] Create AI planning system
- [ ] Set up background jobs

### **Week 5-6: Advanced Features**
- [ ] Add monetization
- [ ] Build team collaboration
- [ ] Implement analytics
- [ ] Create mobile-responsive UI

### **Week 7-8: Production Ready**
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Launch preparation

## 🎯 **Success Metrics (Like Dub)**

### **Technical Excellence**
- ⚡ **Performance**: Sub-200ms API responses
- 🔒 **Security**: SOC 2 compliance ready
- 📈 **Scalability**: Handle 1M+ users
- 🧪 **Quality**: 90%+ test coverage

### **Business Growth**
- 👥 **Users**: 10k+ active users in 6 months
- 💰 **Revenue**: $10k+ MRR by month 6
- ⭐ **Satisfaction**: 4.8+ app store rating
- 🚀 **Enterprise**: 50+ enterprise customers

Would you like me to start implementing any specific part of this roadmap? 