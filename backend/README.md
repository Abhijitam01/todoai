# TodoAI Backend

## Overview
TodoAI is an AI-powered goal and task management backend, built with Node.js, Express, TypeScript, Prisma, and OpenAI. It provides a robust, secure, and scalable REST API for managing users, goals, and tasks, with AI-driven planning and adaptation.

---

## Features
### Core Features
- User authentication (JWT, bcrypt)
- RESTful API for goals and tasks
- AI-powered goal plan generation (OpenAI integration)
- Asynchronous background processing for AI
- Progress tracking and plan adaptation
- Comprehensive validation (Zod)

### Production-Grade Enhancements (Planned/Recommended)
- API versioning (`/api/v1`)
- Standardized error responses
- Rate limiting, helmet, and strict CORS
- DB transactions, soft deletes, and indexing
- Real job queue for async/AI tasks
- Structured logging, error tracking, and metrics
- Pagination, caching, and connection pooling
- Dockerization, health checks, and automated backups
- OpenAPI/Swagger docs
- Audit logging and GDPR endpoints
- User notifications for async events

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Yarn or npm
- [Optional] Docker

### Setup
1. Clone the repo:
   ```sh
   git clone <repo-url>
   cd todoai/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in values:
     ```env
     DATABASE_URL=postgresql://user:pass@host:port/db
     JWT_SECRET=your_jwt_secret
     OPENAI_API_KEY=your_openai_key
     # ...other vars
     ```
4. Run database migrations:
   ```sh
   npx prisma migrate dev --name init --schema=src/prisma/schema.prisma
   ```
5. Start the server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

---

## Database & Migrations
- Prisma ORM is used for schema and migrations.
- All schema changes must be migrated using Prisma Migrate.
- See `src/prisma/schema.prisma` for models.

---

## Testing & CI
- Run tests:
  ```sh
  npm test
  ```
- Tests use a dedicated test database (set `DATABASE_URL` in `.env.test`).
- CI runs linting, tests, and migration checks on every PR.

---

## API Documentation
- Endpoints follow REST conventions and are versioned under `/api/v1`.
- **Swagger/OpenAPI docs are available at [`/api/v1/docs`](http://localhost:5000/api/v1/docs) after starting the server.**
- The raw OpenAPI JSON is available at [`/api-docs.json`](http://localhost:5000/api-docs.json).
- Docs are auto-generated from route/controller JSDoc comments and include:
  - **Authentication endpoints**: `/auth/signup`, `/auth/login`, `/auth/me`
  - **Goals endpoints**: `/goals` (create goal with AI planning)
  - **Tasks endpoints**: `/tasks/today`, `/tasks` (with filters), `/tasks/:id` (update)
- To update docs, edit route/controller comments, then restart the server.
- In production, `/api/v1/docs` can be protected with basic auth by setting `SWAGGER_PROTECT=true` and `SWAGGER_USER`/`SWAGGER_PASS` in your environment.

### Current API Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/goals` - Create goal with AI planning (requires auth)
- `GET /api/tasks/today` - Get today's tasks (requires auth) *[planned]*
- `GET /api/tasks` - Get tasks with filters (requires auth) *[planned]*
- `PATCH /api/tasks/:id` - Update task status (requires auth) *[planned]*

---

## Security & Production Best Practices
- Use HTTPS in production.
- Set strong JWT secrets and API keys via environment variables.
- Enable rate limiting and helmet for security headers.
- Use DB transactions for multi-step operations.
- Monitor logs and errors (integrate Sentry, Prometheus, etc.).
- Run regular DB backups and test restores.
- Use Docker for deployment and local dev parity.

---

## How to Request New Features or Improvements

**Prompt Template:**
```
I want to add/modify the following feature(s) in the TodoAI backend:
- [Describe the feature, endpoint, or improvement you want.]
- [Reference the section in backend.md if relevant.]
- [Specify any business logic, validation, or async/AI requirements.]

Please:
- Follow production best practices (validation, error handling, security, async, etc.)
- Update tests and documentation as needed.
```

**Example Prompt:**
```
Add PATCH /goals/{goal_id} to allow updating a goal's name and time_per_day_hours, with full validation and async plan adaptation if parameters change. Follow the backend.md spec and ensure robust error handling and tests.
```

---

## Contribution Guidelines
- Fork the repo and create a feature branch.
- Write clear, tested, and documented code.
- Run all tests and linting before PRs.
- Describe your changes and reference relevant issues or docs.

---

## Contact & Support
- For questions, open an issue or discussion on GitHub.
- For urgent support, contact the maintainer at [your-email@example.com].

---

## References
- See `Instructions/backend.md` for the full implementation guide, API spec, and business logic details. 