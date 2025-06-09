```markdown
# Backend Implementation Guide: Todo AI

**Version: 1.0**
**Date: June 9, 2025**

This document outlines the backend implementation plan for the Todo AI application, focusing on the core features described in the project brief.

## 1. Document Header

*   **Document Title:** Backend Implementation Guide: Todo AI
*   **Version:** 1.0
*   **Date:** June 9, 2025

## 2. API Design

The backend will expose a RESTful API for the frontend application and potential future integrations (like calendar sync). All endpoints should require authentication where user-specific data is involved.

**Base URL:** `/api/v1`

**Authentication:** JWT (JSON Web Tokens) will be used for stateless authentication. Tokens will be passed in the `Authorization: Bearer <token>` header.

---

**Authentication Endpoints:**

*   **POST `/auth/signup`**
    *   **Description:** Registers a new user.
    *   **Request Body:** `{ "email": "...", "password": "...", "name": "..." }`
    *   **Response:** `{ "token": "...", "user": { "id": "...", "email": "...", "name": "..." } }` or error.
    *   **Status Codes:** 201 Created, 400 Bad Request, 409 Conflict

*   **POST `/auth/login`**
    *   **Description:** Logs in an existing user.
    *   **Request Body:** `{ "email": "...", "password": "..." }`
    *   **Response:** `{ "token": "...", "user": { "id": "...", "email": "...", "name": "..." } }` or error.
    *   **Status Codes:** 200 OK, 401 Unauthorized, 400 Bad Request

*   **GET `/auth/me`**
    *   **Description:** Gets the currently authenticated user's details. Requires `Authorization` header.
    *   **Response:** `{ "id": "...", "email": "...", "name": "..." }` or error.
    *   **Status Codes:** 200 OK, 401 Unauthorized

---

**Goals Endpoints:**

*   **POST `/goals`**
    *   **Description:** Creates a new goal and initiates the AI plan generation. Requires `Authorization` header.
    *   **Request Body:** `{ "name": "Learn Python", "duration_days": 90, "time_per_day_hours": 1, "skill_level": "beginner" }` (Duration can be in days/weeks/months, backend standardizes to days).
    *   **Response:** `{ "id": "...", "name": "...", "status": "PLANNING", ... }`. The plan generation happens asynchronously.
    *   **Status Codes:** 202 Accepted (if async), 201 Created (if sync, less ideal), 400 Bad Request, 401 Unauthorized

*   **GET `/goals`**
    *   **Description:** Gets a list of all goals for the authenticated user. Requires `Authorization` header.
    *   **Query Params:** `status=active|completed|archived` (optional filter)
    *   **Response:** `[{ "id": "...", "name": "...", "status": "...", "progress_percentage": "...", ... }, ...]`
    *   **Status Codes:** 200 OK, 401 Unauthorized

*   **GET `/goals/{goal_id}`**
    *   **Description:** Gets details of a specific goal and its roadmap. Requires `Authorization` header.
    *   **Response:** `{ "id": "...", "name": "...", "status": "...", "progress_percentage": "...", "roadmap": [...], ... }`
        *   `roadmap` structure could be like: `[{ "week": 1, "milestone": "...", "days": [{ "day": 1, "task_id": "...", "description": "...", "status": "...", "due_date": "..." }, ...] }, ...]`
    *   **Status Codes:** 200 OK, 404 Not Found, 401 Unauthorized, 403 Forbidden (if not user's goal)

*   **PATCH `/goals/{goal_id}`**
    *   **Description:** Updates a goal's details (e.g., name, time per day). May trigger plan adaptation. Requires `Authorization` header.
    *   **Request Body:** `{ "name": "...", "time_per_day_hours": "...", ... }` (partial update)
    *   **Response:** `{ "id": "...", "name": "...", "status": "...", ... }`
    *   **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

*   **DELETE `/goals/{goal_id}`**
    *   **Description:** Deletes a goal and all associated tasks/roadmap data. Requires `Authorization` header.
    *   **Response:** `{ "message": "Goal deleted successfully" }`
    *   **Status Codes:** 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found

---

**Tasks Endpoints:**

*   **GET `/tasks/today`**
    *   **Description:** Gets all tasks scheduled for today for the authenticated user, across all active goals. Requires `Authorization` header.
    *   **Response:** `[{ "id": "...", "goal_id": "...", "description": "...", "due_date": "...", "status": "...", "goal_name": "...", ... }, ...]`
    *   **Status Codes:** 200 OK, 401 Unauthorized

*   **GET `/tasks`**
    *   **Description:** Gets tasks for a specific goal or time range. Requires `Authorization` header.
    *   **Query Params:** `goal_id=...`, `start_date=YYYY-MM-DD`, `end_date=YYYY-MM-DD`, `status=pending|completed|overdue` (flexible filtering)
    *   **Response:** `[{ "id": "...", "goal_id": "...", "description": "...", "due_date": "...", "status": "...", ... }, ...]`
    *   **Status Codes:** 200 OK, 401 Unauthorized, 404 Not Found (if goal_id invalid)

*   **PATCH `/tasks/{task_id}`**
    *   **Description:** Updates a task's status or details (e.g., mark as done, reschedule). Requires `Authorization` header. May trigger plan adaptation.
    *   **Request Body:** `{ "status": "completed" }` or `{ "due_date": "YYYY-MM-DD" }`
    *   **Response:** `{ "id": "...", "status": "...", "completion_date": "...", ... }`
    *   **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

---

**AI Feedback/Interaction (Potential Future Endpoints):**

*   **POST `/goals/{goal_id}/tasks/{task_id}/feedback`**
    *   **Description:** Send task completion context to AI for potential "Want to learn more?" suggestions.
*   **POST `/goals/{goal_id}/revise`**
    *   **Description:** Request AI to revise the plan based on current progress or user input.

---

## 3. Data Models

Using a relational database (like PostgreSQL) is suitable for managing users, goals, and structured tasks.

**1. `users` Table:**

*   `id` (UUID/INT, Primary Key)
*   `email` (VARCHAR, Unique, Not Null)
*   `password_hash` (VARCHAR, Not Null)
*   `name` (VARCHAR)
*   `created_at` (TIMESTAMP, Default NOW())
*   `updated_at` (TIMESTAMP, Default NOW())

**2. `goals` Table:**

*   `id` (UUID/INT, Primary Key)
*   `user_id` (UUID/INT, Foreign Key to `users.id`, Not Null)
*   `name` (VARCHAR, Not Null)
*   `topic` (VARCHAR) - Parsed from name/input
*   `skill_level` (VARCHAR)
*   `duration_days` (INT) - Standardized duration
*   `time_per_day_hours` (FLOAT) - User preference
*   `start_date` (DATE) - When the goal officially starts
*   `end_date` (DATE) - Calculated end date based on start + duration
*   `status` (ENUM: 'PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED', 'FAILED', Not Null, Default 'PLANNING')
*   `current_progress_percentage` (FLOAT, Default 0.0)
*   `created_at` (TIMESTAMP, Default NOW())
*   `updated_at` (TIMESTAMP, Default NOW())

**3. `tasks` Table:**

*   `id` (UUID/INT, Primary Key)
*   `goal_id` (UUID/INT, Foreign Key to `goals.id`, Not Null)
*   `description` (TEXT, Not Null)
*   `original_planned_date` (DATE) - The date from the original AI plan
*   `current_due_date` (DATE, Not Null) - The date the task is currently assigned to
*   `completion_date` (TIMESTAMP) - Null if not completed
*   `status` (ENUM: 'PENDING', 'COMPLETED', 'SKIPPED', 'OVERDUE', Not Null, Default 'PENDING')
*   `order_in_goal` (INT) - Helps maintain original sequence
*   `week_number` (INT) - From AI output
*   `day_number_in_week` (INT) - From AI output
*   `milestone` (VARCHAR) - Associated milestone from AI output
*   `created_at` (TIMESTAMP, Default NOW())
*   `updated_at` (TIMESTAMP, Default NOW())

**Relationships:**

*   `users` 1-to-Many `goals`
*   `goals` 1-to-Many `tasks`

**Indexing:**

*   Index `email` in `users` for login.
*   Index `user_id` in `goals` for retrieving user goals.
*   Index `goal_id` in `tasks` for retrieving tasks per goal.
*   Compound index on `(user_id, current_due_date, status)` or `(goal_id, current_due_date, status)` in `tasks` for efficient retrieval of daily/weekly tasks and progress tracking.

## 4. Business Logic

This section details the core backend processes.

**4.1. Goal Creation & AI Plan Generation:**

1.  Receive user input (name, duration, time/day, skill level) via `POST /goals`.
2.  Create a new `goal` entry in the database with status `PLANNING`.
3.  Validate input (duration format, etc.).
4.  Construct the AI prompt:
    *   Use a template like the one provided in the brief.
    *   Inject parsed goal name, duration (standardized), time per day, and skill level.
    *   Specify required JSON output structure.
5.  **Asynchronous AI Call:** Send the prompt to the AI (GPT) API. This *must* be asynchronous. Use a background worker or message queue (e.g., Celery with RabbitMQ/Redis, or cloud functions/queues like AWS SQS/Lambda) to avoid blocking the API request.
6.  **Process AI Response (in background worker):**
    *   Receive the JSON output from the AI.
    *   Validate the JSON structure and content. Handle cases where the AI provides invalid or poorly formatted JSON. Implement retry logic for AI calls.
    *   If valid, parse the JSON into a list of tasks.
    *   For each task in the parsed output:
        *   Calculate its `original_planned_date` and `current_due_date` based on the goal's `start_date` and the task's week/day number.
        *   Create a `task` entry in the database linked to the new goal.
        *   Store description, dates, status ('PENDING'), order, week/day numbers, and milestone.
    *   Update the goal's status from `PLANNING` to `ACTIVE` and set `start_date`/`end_date`.
    *   If AI generation fails after retries, update goal status to indicate an error or notify the user.

**4.2. Task Management (Marking Complete, Rescheduling):**

1.  Receive request (e.g., `PATCH /tasks/{task_id}`).
2.  Authenticate and authorize the user (ensure the task belongs to them).
3.  Update the task's status (`COMPLETED`, `SKIPPED`) and `completion_date` if applicable, or update `current_due_date` for rescheduling/snoozing.
4.  **Trigger Plan Adaptation:** If a task is marked completed (especially early) or skipped/missed, this action might trigger a plan adaptation process. This should also ideally run asynchronously.

**4.3. Progress Tracking:**

1.  When a goal is viewed (`GET /goals/{goal_id}`) or user goals are listed (`GET /goals`), calculate the `current_progress_percentage`.
2.  Calculation: `(Number of tasks with status 'COMPLETED') / (Total number of tasks) * 100`.
3.  Store this percentage on the `goals` table or calculate it on the fly. Updating it asynchronously when tasks are completed is more efficient for read operations.
4.  Identify overdue tasks by comparing `current_due_date` with the current date where status is `PENDING`.

**4.4. Plan Adaptation (Core AI Feature):**

This is the most complex part. It needs to intelligently adjust the plan when progress deviates significantly.

*   **Triggers:**
    *   User marks tasks complete significantly ahead of schedule.
    *   User marks tasks as skipped, or tasks become overdue.
    *   User edits goal parameters (e.g., changes time per day).
*   **Process (Asynchronous):**
    *   Identify the affected goal.
    *   Retrieve all tasks for that goal, including their original plan data and current status.
    *   Determine the current state: What was planned up to today? What is actually completed? What is pending/overdue? What is planned for the future?
    *   **Option 1 (Heuristic based):**
        *   If tasks are overdue: Shift overdue tasks and potentially subsequent pending tasks by the required number of days. Distribute missed workload? (e.g., can some be added to other days?). This can become complex quickly.
        *   If tasks are completed early: Pull subsequent tasks forward? (Less common, user might want to use freed up time differently).
    *   **Option 2 (AI Re-planning - Preferred for "intelligent" adaptation):**
        *   Construct a new AI prompt.
        *   Include: Original goal, remaining duration (or target end date), time per day, *a summary of completed tasks/topics*, and *a list of pending/overdue tasks* that need to be integrated into the *new* plan.
        *   Ask the AI to generate a *new* plan covering the remaining period, incorporating the unfinished work and leveraging the completed work.
        *   Receive and validate the new AI JSON.
        *   **Crucially:** Compare the new plan with the old one.
            *   Map existing *pending* tasks from the old plan to the new plan if they cover similar ground. Update their `current_due_date`, `week_number`, `milestone` based on the new plan structure.
            *   Add *new* tasks generated by the AI that cover remaining ground or missed topics.
            *   Mark tasks from the *old* plan that are not present in the *new* plan as `SKIPPED` or `ARCHIVED` (carefully, maybe prompt user?).
        *   Update the goal's `end_date` if the plan duration changed.
        *   Notify the user about the plan update.
    *   **Handling Complexity:** AI re-planning is powerful but can be unreliable. Start with simpler heuristics (Option 1) or implement AI re-planning for major deviations only. Provide users with a preview of proposed changes before applying them.

**4.5. Calendar Integration (Optional):**

1.  Implement logic to connect to Google Calendar/Apple Calendar APIs (using OAuth 2.0).
2.  When a user enables integration for a goal:
    *   Fetch existing tasks for the goal.
    *   Create/Update calendar events for each task based on its `current_due_date` and estimated time (e.g., `time_per_day_hours` divided by number of tasks per day).
    *   Use calendar API features to update events when tasks are rescheduled or completed.
    *   Handle synchronization: If a user moves an event in their calendar, update the task's `current_due_date` in the app (requires setting up webhooks or polling).

## 5. Security

*   **Authentication:**
    *   Implement secure password hashing (e.g., bcrypt).
    *   Use JWTs: Generate token on login, verify on subsequent requests. Store tokens securely on the client-side (e.g., HTTP-only cookies or secure local storage). Include user ID in the token payload. Tokens should have an expiry time and refresh mechanism if needed.
*   **Authorization:**
    *   Middleware or decorators on API endpoints to check for a valid JWT.
    *   For any request accessing/modifying a resource (goal, task), verify that the `user_id` associated with the resource matches the `user_id` from the authenticated JWT. Return 403 Forbidden if not authorized.
*   **API Security:**
    *   Validate and sanitize all incoming user input to prevent injection attacks (SQL injection, etc.). Use ORMs that protect against SQL injection.
    *   Implement rate limiting on authentication and potentially other heavy endpoints to prevent brute-force attacks and abuse.
    *   Use HTTPS to encrypt all communication between the client and backend.
    *   Securely store API keys (for AI, calendar services) and database credentials using environment variables or a dedicated secret management system.
*   **Data Security:** Encrypt sensitive data at rest in the database (less critical for task descriptions, but good practice for PII). Implement database backups.

## 6. Performance

*   **Database:**
    *   Ensure proper indexing as described in the Data Models section.
    *   Optimize queries, especially those retrieving lists of tasks (`/tasks/today`, `/goals/{goal_id}`). Use pagination for large result sets.
*   **AI Integration:**
    *   AI calls are the main bottleneck and cost factor. **Must** be asynchronous.
    *   Handle AI service downtime and latency gracefully. Implement timeouts and retries.
*   **Caching:**
    *   Cache frequently accessed user data (e.g., basic user profile).
    *   Cache data for the daily dashboard (`/tasks/today`) as it will be hit frequently. Use an in-memory cache like Redis. Invalidate cache when tasks are completed or rescheduled.
*   **Asynchronous Processing:** Use message queues/background workers for:
    *   AI plan generation (POST /goals)
    *   AI plan adaptation (triggered by PATCH /tasks or PATCH /goals)
    *   Calendar synchronization
    *   Sending notifications (if implemented)
*   **Efficient Data Serialization:** Return only necessary fields in API responses. Use efficient JSON serialization libraries.

## 7. Code Examples

Let's use Python with FastAPI as an example framework, suitable for building APIs.

**Example 1: Goal Creation & Triggering Async AI Plan Generation**

```python
# Assuming SQLAlchemy ORM for database interaction
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from pydantic import BaseModel
from datetime import date, timedelta

from . import models, schemas, deps # Assuming models.py, schemas.py, deps.py exist
from .ai import generate_plan # Assuming ai.py has the AI interaction logic
from .tasks import process_ai_plan_task # Assuming tasks.py has async worker logic

router = APIRouter()

class GoalCreate(BaseModel):
    name: str
    duration_days: int # Standardize duration input
    time_per_day_hours: float = 1.0
    skill_level: str = "beginner"

@router.post("/goals", status_code=status.HTTP_202_ACCEPTED)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
    background_tasks: BackgroundTasks = None # FastAPI's way to run tasks in background
):
    """
    Creates a new goal and triggers asynchronous AI plan generation.
    """
    # 1. Create goal entry in DB with PLANNING status
    db_goal = models.Goal(
        user_id=current_user.id,
        name=goal_data.name,
        duration_days=goal_data.duration_days,
        time_per_day_hours=goal_data.time_per_day_hours,
        skill_level=goal_data.skill_level,
        status="PLANNING", # Initial status
        start_date=date.today(), # Assuming plan starts today, adjust if needed
        end_date=date.today() + timedelta(days=goal_data.duration_days) # Tentative end date
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)

    # 2. Construct AI prompt payload (example)
    ai_payload = {
        "goal_name": goal_data.name,
        "duration_days": goal_data.duration_days,
        "time_per_day_hours": goal_data.time_per_day_hours,
        "skill_level": goal_data.skill_level,
        "goal_id": db_goal.id, # Pass goal ID to associate results later
        "user_id": current_user.id # Pass user ID for context/auth in worker
    }

    # 3. Trigger asynchronous processing of the AI call and plan saving
    # In a real app, this might publish to a message queue (Celery, etc.)
    # FastAPI's BackgroundTasks is simple for basic cases but a queue is better for robustness/scaling
    if background_tasks:
         background_tasks.add_task(process_ai_plan_task, ai_payload, db)
    else:
         # Fallback/dev mode: run inline (will block!)
         print("WARNING: Running AI task synchronously. Use background tasks in production.")
         process_ai_plan_task(ai_payload, db)


    # 4. Return a 202 Accepted response indicating processing is underway
    return {"id": db_goal.id, "name": db_goal.name, "status": db_goal.status}

# --- ai.py (Simplified) ---
import openai
import json

def generate_plan(goal_data: dict):
    """Calls the OpenAI API to generate a plan."""
    prompt = f"""You are a productivity coach AI. A user has the following goal: "{goal_data['goal_name']}"
They want to complete it in {goal_data['duration_days']} days, dedicating approximately {goal_data['time_per_day_hours']} hour{'s' if goal_data['time_per_day_hours'] != 1 else ''} per day.
Their current skill level is {goal_data['skill_level']}.
Generate a plan broken into weekly goals and daily tasks. Include periodic checkpoints every ~2 weeks and end with a project milestone.
Provide the output as a JSON array of weeks. Each task should be achievable within the daily time limit.

Expected JSON structure:
[
  {{
    "week": 1,
    "milestone": "...",
    "days": [
      {{"day": 1, "task": "..."}},
      ...
    ]
  }},
  ...
]
Ensure the plan covers the full {goal_data['duration_days']} days, distributing tasks logically across weeks.
"""
    try:
        response = openai.chat.completions.create(
            model="gpt-4o", # Or another suitable model
            messages=[{"role": "system", "content": "You are a helpful assistant designed to output JSON."},
                      {"role": "user", "content": prompt}],
            response_format={"type": "json_object"} # Request JSON output
        )
        plan_json_string = response.choices[0].message.content
        return json.loads(plan_json_string) # Parse JSON string
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        # Implement more robust error handling, logging, and potentially retries
        raise

# --- tasks.py (Simplified Background Worker/Task Handler) ---
# This function runs in a background process/thread/worker
from sqlalchemy.orm import Session
from . import models # Import your DB models

def process_ai_plan_task(ai_payload: dict, db: Session):
    """
    Background task to call AI, parse plan, and save to DB.
    Note: In a real worker, you'd get a *new* DB session, not pass one from the request.
    """
    goal_id = ai_payload['goal_id']
    # In a real worker, get DB session: db = SessionLocal()
    # try:
    #     ... use db ...
    # finally:
    #     db.close()

    try:
        # Call AI service
        ai_plan_data = generate_plan(ai_payload)

        # Validate AI output structure (simplified check)
        if not isinstance(ai_plan_data, list) or not all(isinstance(week, dict) and 'days' in week for week in ai_plan_data):
             raise ValueError("Invalid AI plan structure")

        # Save tasks to database
        task_order = 0
        for week_data in ai_plan_data:
            week_num = week_data.get("week")
            milestone = week_data.get("milestone")
            days = week_data.get("days", [])

            # Calculate start date for this week (relative to goal start)
            goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
            if not goal:
                 print(f"Goal {goal_id} not found in worker?")
                 return # Handle this error

            week_start_date = goal.start_date + timedelta(weeks=week_num - 1)


            for day_data in days:
                day_num_in_week = day_data.get("day")
                task_description = day_data.get("task")
                if not task_description: continue # Skip empty tasks

                # Calculate due date
                current_due_date = week_start_date + timedelta(days=day_num_in_week - 1)

                db_task = models.Task(
                    goal_id=goal_id,
                    description=task_description,
                    original_planned_date=current_due_date, # Original plan date
                    current_due_date=current_due_date,     # Initial due date
                    status="PENDING",
                    order_in_goal=task_order,
                    week_number=week_num,
                    day_number_in_week=day_num_in_week,
                    milestone=milestone
                )
                db.add(db_task)
                task_order += 1

        # Update goal status
        goal.status = "ACTIVE"
        db.commit() # Commit all tasks and goal status change

    except Exception as e:
        db.rollback() # Rollback changes if anything fails during save
        print(f"Error processing AI plan for goal {goal_id}: {e}")
        # TODO: Update goal status to 'FAILED' or 'ERROR', notify user
        goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
        if goal:
            goal.status = "ERROR"
            db.commit()

```

**Example 2: Marking a Task as Complete**

```python
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from pydantic import BaseModel

from . import models, schemas, deps
from .tasks import trigger_plan_adaptation # Assuming this exists

router = APIRouter()

class TaskUpdateStatus(BaseModel):
    status: str # e.g., "completed", "skipped"

@router.patch("/tasks/{task_id}")
def update_task_status(
    task_id: int, # Or UUID
    update_data: TaskUpdateStatus,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Updates a task's status and triggers potential plan adaptation.
    """
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Authorization check: Ensure task belongs to user's goal
    goal = db.query(models.Goal).filter(models.Goal.id == db_task.goal_id).first()
    if not goal or goal.user_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized to update this task")

    # Validate status transition (e.g., can't complete an already skipped task)
    valid_statuses = ["PENDING", "COMPLETED", "SKIPPED", "OVERDUE"]
    if update_data.status not in valid_statuses:
         raise HTTPException(status_code=400, detail="Invalid status")

    # Apply update
    db_task.status = update_data.status
    if update_data.status == "COMPLETED":
        db_task.completion_date = datetime.utcnow()
    elif update_data.status in ["SKIPPED", "PENDING", "OVERDUE"]:
        db_task.completion_date = None # Clear completion date if not completed

    db.commit()
    db.refresh(db_task)

    # Trigger Plan Adaptation (Asynchronously)
    # If the status change significantly impacts progress or misses deadlines
    if update_data.status in ["COMPLETED", "SKIPPED"] or (update_data.status == "OVERDUE" and db_task.current_due_date < date.today()):
         # This would typically queue a message for a worker to process adaptation
         print(f"Triggering plan adaptation for goal {db_task.goal_id}")
         # Example using a hypothetical async task queue function
         # trigger_plan_adaptation.delay(db_task.goal_id) # e.g., Celery syntax
         pass # Placeholder - implement async trigger here

    return db_task # Return updated task object

# --- tasks.py (Hypothetical Plan Adaptation Trigger/Worker) ---
# from .ai import replan_goal # Assume replan_goal function exists

# def trigger_plan_adaptation(goal_id: int):
#      """Placeholder function to be run by a background worker."""
#      # This worker would fetch goal/task data, decide on adaptation logic
#      # Option 1 (Heuristic): Update dates directly
#      # Option 2 (AI Replan): Call replan_goal(goal_id) and update tasks based on new plan
#      print(f"Worker processing plan adaptation for goal {goal_id}")
#      # ... adaptation logic ...
#      pass

```

---

This guide provides a solid foundation for building the backend of your AI-powered goal-planning application. Remember to choose appropriate technologies, implement robust error handling, logging, and monitoring as you develop. Good luck!
```
