# 🚀 TodoAI - Turn Your Goals Into Daily Action

<div align="center">
  <img src="public/favicon.svg" alt="TodoAI Logo" width="80" height="80">
  
  **Transform your ambitions into personalized day-by-day plans with the power of AI**
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-todoai.klashr.com-brightgreen)](https://todoai.klashr.com)
  [![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4)](https://tailwindcss.com/)
  [![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00D9FF)](https://neon.tech/)
  ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Abhijitam01/todoai?utm_source=oss&utm_medium=github&utm_campaign=Abhijitam01%2Ftodoai&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
</div>

---

## 📖 Overview

TodoAI is a modern SaaS landing page and application that helps users transform their goals into actionable daily plans using artificial intelligence. The platform features a beautiful, responsive design with a fully functional waitlist system powered by NeonDB.

### ✨ Key Features

- 🎯 **AI-Powered Goal Planning** - Transform any goal into structured daily action plans
- 📧 **Waitlist Management** - Robust signup system with duplicate prevention
- 🎨 **Modern Design** - Dark theme with smooth animations and responsive layout
- ⚡ **Performance Optimized** - Built with Next.js 14 and optimized for speed
- 📊 **Analytics Ready** - Integrated Vercel Analytics and Speed Insights
- 🔒 **Production Ready** - Scalable database architecture with NeonDB
- 🌐 **SEO Optimized** - Complete meta tags and OpenGraph configuration

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://framer.com/motion/)** - Smooth animations
- **[Radix UI](https://radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & Database
- **[NeonDB](https://neon.tech/)** - Serverless PostgreSQL database
- **[@neondatabase/serverless](https://neon.tech/docs/serverless/serverless-driver)** - Serverless database driver
- **Next.js API Routes** - Serverless API endpoints

### Analytics & Monitoring
- **[Vercel Analytics](https://vercel.com/analytics)** - User behavior tracking
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Performance monitoring

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **NeonDB account** (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/Abhijitam01/todoai.git
cd todoai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# NeonDB Configuration
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# Example:
# DATABASE_URL=postgresql://user:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Get your DATABASE_URL:**
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Go to **Connection Details** and copy the connection string

### 4. Database Setup

1. **Create the waitlist table** in your Neon dashboard:
   - Go to **SQL Editor** in your Neon dashboard
   - Run this SQL:

```sql
-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100) DEFAULT 'landing_page',
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist(source);

-- Add email validation constraint
ALTER TABLE waitlist 
ADD CONSTRAINT IF NOT EXISTS valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

---

## 📁 Project Structure

```
todoai/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   └── waitlist/             # Waitlist API endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with Analytics
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── landing/                  # Landing page sections
│   │   ├── hero-section.tsx      # Hero with CTA
│   │   ├── how-it-works.tsx      # Process explanation
│   │   ├── features-section.tsx  # Feature highlights
│   │   ├── why-todoai.tsx        # Value propositions
│   │   ├── faq-section.tsx       # Frequently asked questions
│   │   ├── final-cta.tsx         # Final call to action
│   │   └── footer.tsx            # Footer section
│   ├── ui/                       # Reusable UI components
│   └── navigation.tsx            # Main navigation
├── lib/                          # Utility libraries
│   ├── neon.ts                   # NeonDB client configuration
│   └── utils.ts                  # General utilities
├── scripts/                      # Utility scripts
│   └── migrate-waitlist.js       # Data migration script
├── data/                         # Data files
│   └── waitlist.json             # Legacy waitlist data
└── public/                       # Static assets
    ├── favicon.svg
    └── site.webmanifest
```

---

## 🎯 Key Features Explained

### 🏠 Landing Page
- **Hero Section** - Compelling value proposition with waitlist signup
- **How It Works** - 3-step process explanation with icons
- **Features** - Key product capabilities and benefits
- **Why TodoAI** - Competitive advantages and social proof
- **FAQ Section** - Common questions and answers
- **Footer** - Links and company information

### 📧 Waitlist System
- **Email Validation** - Frontend and backend validation
- **Duplicate Prevention** - Database constraints prevent duplicate signups
- **Error Handling** - User-friendly error messages
- **Analytics** - Track signup conversion rates
- **Data Export** - Easy email list export for launch

### 📊 Database Schema

```sql
waitlist Table:
├── id (SERIAL PRIMARY KEY)
├── email (VARCHAR(255) UNIQUE NOT NULL)
├── source (VARCHAR(100) DEFAULT 'landing_page')
├── referrer (TEXT)
├── created_at (TIMESTAMP WITH TIME ZONE)
└── updated_at (TIMESTAMP WITH TIME ZONE)
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add `DATABASE_URL` with your NeonDB connection string
   - Apply to **Production**, **Preview**, and **Development**

3. **Deploy**
   - Push to your main branch
   - Vercel automatically deploys your application

### Deploy to Other Platforms

The application works on any platform that supports Next.js:
- **Netlify** - Add environment variables in site settings
- **Railway** - Connect GitHub and add DATABASE_URL
- **Render** - Deploy from GitHub with environment variables

---

## 🧪 Testing

### Test Database Connection

```bash
# Create a test file to verify your setup
node -e "
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT NOW()\`.then(r => console.log('✅ Connected:', r[0].now));
"
```

### Test Waitlist API

```bash
# Test POST endpoint
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"testing"}'

# Test GET endpoint
curl http://localhost:3000/api/waitlist
```

---

## 📈 Analytics & Monitoring

### Vercel Analytics
- **Page Views** - Track visitor behavior
- **Conversions** - Monitor waitlist signups
- **Traffic Sources** - Understand user acquisition
- **Real-time Data** - Live visitor tracking

### Speed Insights
- **Core Web Vitals** - LCP, FID, CLS metrics
- **Performance Scores** - Page load optimization
- **Real User Monitoring** - Actual user experience data

Access analytics at:
- [vercel.com/dashboard](https://vercel.com/dashboard) → Your Project → Analytics

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate-waitlist  # Migrate data from JSON to database
```

### Adding New Features

1. **New Landing Section**
   ```bash
   # Create component
   touch components/landing/new-section.tsx
   
   # Add to page
   # Import and use in app/page.tsx
   ```

2. **New API Endpoint**
   ```bash
   # Create API route
   mkdir app/api/new-endpoint
   touch app/api/new-endpoint/route.ts
   ```

3. **Database Changes**
   ```sql
   -- Run migrations in Neon SQL Editor
   ALTER TABLE waitlist ADD COLUMN new_field VARCHAR(100);
   ```

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🔒 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | NeonDB connection string | Yes | `postgresql://user:pass@host/db` |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Vercel](https://vercel.com)** - Hosting and analytics platform
- **[NeonDB](https://neon.tech)** - Serverless PostgreSQL database
- **[Next.js Team](https://nextjs.org)** - Amazing React framework
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework

---

## 📞 Support

- **Live Demo**: [todoai.klashr.com](https://todoai.klashr.com)
- **Issues**: [GitHub Issues](https://github.com/Abhijitam01/todoai/issues)
- **Documentation**: This README

---

<div align="center">
  <p>Built with ❤️ using Next.js, TypeScript, and NeonDB</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div> 