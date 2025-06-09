```markdown
# Todo AI System Flow Document

This document outlines the core system architecture and key flows for the Todo AI application.

## 1. Document Header

*   **Version:** 1.0
*   **Date:** June 9, 2025

## 2. System Overview

The Todo AI system is comprised of several key components that interact to translate user goals into actionable plans and manage their progress.

**Core Components:**

1.  **User Interface (UI):** The front-end application (Web/Mobile) where users input goals, view dashboards, manage tasks, and see progress.
2.  **Backend Application:** The central server-side logic responsible for handling user requests, orchestrating interactions between components, managing data, and executing core business logic (like plan adjustments).
3.  **Database:** Stores all persistent data, including user profiles, defined goals, generated plans (milestones, tasks, dates), task statuses, and progress history.
4.  **AI Service (GPT Integration):** An external or internal service (likely using an LLM like GPT) responsible for the complex task of decomposing high-level goals into structured weekly/daily tasks based on the user's input.
5.  **Scheduler/Job Processor:** A background process responsible for triggering scheduled tasks like plan adjustments (based on missed tasks), sending notifications, and potentially periodic plan reviews.
6.  **External Calendar Integration (Optional):** APIs for popular calendar services (Google Calendar, Apple Calendar) to allow users to export their planned tasks.

**Component Interactions:**

*   UI communicates with the Backend via API calls.
*   Backend interacts with the Database for all read/write operations.
*   Backend sends prompts to the AI Service and receives structured plan data.
*   Backend triggers the Scheduler for background processing.
*   Scheduler reads data from the Database and performs actions (e.g., updates plan in DB).
*   Backend or Scheduler interacts with External Calendar Integration APIs.

```mermaid
graph LR
    A[User Interface] --> B(Backend Application);
    B --> C(Database);
    B --> D(AI Service);
    B --> E(Scheduler/Job Processor);
    E --> C; % Scheduler reads/writes DB for plan adjustments
    B --> F(External Calendar Integration);
    E --> F; % Potentially Scheduler handles sync
    D -- JSON Plan Data --> B;
    C -- User Data, Plan Data --> B;
    B -- API Responses --> A;
```

## 3. User Workflows

These diagrams and descriptions outline the primary paths a user takes through the system.

### 3.1. Goal Creation Workflow

This is the core initial workflow where a user's high-level goal is transformed into a structured plan.

```mermaid
graph TD
    A[User] --> B(Input Goal Details<br>(Goal, Duration, Time/Day, Skill));
    B --> C{UI Validation};
    C -- Valid --> D(Send Goal Details to Backend API);
    C -- Invalid --> B;
    D --> E(Backend: Receive & Process Goal);
    E --> F(Backend: Construct AI Prompt);
    F --> G(Call AI Service<br>(Prompt));
    G -- JSON Plan --> H(Backend: Receive & Validate AI Plan);
    H -- Valid Plan --> I(Backend: Save Plan to Database);
    H -- Invalid Plan --> E{Retry AI} -- Max Retries --> Z[Backend: Error Response to UI];
    I --> J(Backend: Send Plan Summary to UI);
    J --> K[User Interface: Display Plan Summary];
    K --> L{User Action<br>(Review & Confirm/Edit)};
    L -- Confirm --> M(Send Confirmation to Backend API);
    L -- Edit --> B; % Loop back to modify input or maybe a dedicated edit flow
    M --> N(Backend: Mark Plan as Active);
    N --> O[User Interface: Show Dashboard<br>with Today's Tasks];
    Z --> K; % Display error message to user
```

**Description:**
The user provides goal parameters. The UI and Backend validate inputs. The Backend formats a prompt for the AI service. The AI returns a structured plan. The Backend validates the AI output and saves the valid plan to the database. A summary is shown to the user for confirmation. Upon confirmation, the plan is activated, and the user is directed to their dashboard.

### 3.2. Daily Task Management Workflow

This describes how a user interacts with their plan daily.

```mermaid
graph TD
    P[User Interface: Dashboard] --> Q(Display Today's Tasks<br>from Database via Backend);
    Q --> R{User Action<br>(Mark Task Done, Snooze, Reschedule)};
    R -- Action --> S(Send Task Update to Backend API);
    S --> T(Backend: Update Task Status in Database);
    T --> U{Backend: Check for Plan Adjustment Needs<br>(e.g., Missed tasks, ahead of schedule)};
    U -- Needs Adjustment --> V(Backend: Trigger Scheduler<br>for Plan Rebalancing);
    V --> W(Scheduler: Read Plan Data from DB);
    W --> X(Scheduler: Apply Adjustment Logic);
    X --> Y(Scheduler: Update Plan Data in Database);
    Y --> Z(Backend: Notify UI/User of Plan Change - Optional);
    S -- No Adjustment Needed --> P; % Refresh Dashboard view if needed
    Z --> P; % Refresh Dashboard view
    R -- View Other Sections<br>(Weekly, Progress) --> AA[User Interface: Other Views];
    AA --> P; % Return to Dashboard
```

**Description:**
The dashboard displays the user's tasks for the day. The user marks tasks as done or takes other actions (snooze, reschedule). These updates are sent to the Backend and saved in the database. The Backend or a triggered Scheduler process checks if these updates necessitate a plan adjustment (e.g., falling behind). If so, the plan is rebalanced in the database, potentially notifying the user.

### 3.3. Goal Completion Workflow

When the user finishes all tasks in a plan or reaches the end date.

```mermaid
graph TD
    AB(Scheduler/Backend: Detect Goal Completion<br>or End Date Reached);
    AB --> AC(Backend: Calculate Summary Metrics<br>(Completion Rate, Timeline));
    AC --> AD(Backend: Mark Goal as Completed in Database);
    AD --> AE(Backend: Generate Completion Summary Data);
    AE --> AF[User Interface: Display Completion Summary];
    AF --> AG{User Action<br>(View Summary, Archive, Start New Goal)};
```

**Description:**
The system monitors plan progress. When a goal is completed (all tasks done) or the target date is reached, the Backend calculates summary statistics, marks the goal as completed, and presents a summary to the user.

## 4. Data Flows

This section describes the key data entities and how they move and transform within the system.

### 4.1. Plan Data Lifecycle Flow

Focuses on the creation, storage, and updating of the goal plan data.

```mermaid
graph LR
    A[User Input<br>(Goal Parameters)] --> B(Backend API<br>Receive Goal);
    B --> C(Backend: Construct AI Prompt);
    C --> D(AI Service<br>Prompt Request);
    D -- JSON Plan Data --> E(Backend: Receive & Validate AI Output);
    E --> F(Database<br>Write Plan Data);
    F --> G(Backend API<br>Read Plan Data for Display);
    G --> H[User Interface<br>Display Plan/Tasks];
    H --> I[User Action<br>(Task Completion/Update)];
    I --> J(Backend API<br>Receive Task Update);
    J --> K(Database<br>Update Task Status);
    K --> L(Scheduler/Backend<br>Monitor Plan Progress);
    L --> M{Trigger Plan Adjustment?};
    M -- Yes --> N(Scheduler<br>Read Plan Data);
    N --> O(Scheduler<br>Execute Adjustment Logic);
    O --> P(Database<br>Update Plan Data);
    P --> G; % Loop back to display updated plan
    M -- No --> L; % Continue monitoring
```

**Description:**
User input flows through the Backend to the AI service to generate the plan. The AI output (JSON plan) is validated by the Backend and saved to the Database. The Backend retrieves this data to display the plan and tasks in the UI. User interactions (marking tasks) update the plan status in the Database via the Backend. A monitoring process (Scheduler/Backend logic) detects if adjustments are needed based on task status and updates the plan in the Database accordingly, which is then reflected in the UI.

**Key Data Entities Involved:**

*   **Goal Entity:** User ID, Goal Name, Duration, Start Date, End Date, Time per Day, Skill Level, Status (Active, Completed, Archived).
*   **Plan Entity:** Goal ID, Milestone (text), Week Number, Day Number, Task Text, Due Date (calculated), Status (Pending, Completed, Missed, Snoozed), Completion Date.
*   **User Entity:** User ID, Email, Password Hash, Preferences.

## 5. Error Handling

Strategies to ensure system resilience and provide a good user experience even when failures occur.

*   **Input Validation:** Strict validation of user-provided goal details on both the UI and Backend to prevent invalid data from entering the system or being sent to the AI service.
*   **AI Service Robustness:**
    *   Implement retries for AI API calls in case of transient network issues or service downtime.
    *   Validate the structure and content of the AI's JSON response. If invalid, log the error, potentially retry with a modified prompt, or inform the user that plan generation failed and suggest retrying or contacting support.
    *   Implement timeouts for AI calls to prevent the system from hanging.
*   **Database Errors:** Implement proper error handling for database operations (connection errors, query failures). Use transactions for critical updates (like plan adjustments) to maintain data consistency. Log errors and alert operators.
*   **External API Failures (Calendar):** Calendar sync should be asynchronous and non-blocking for core user flows. Handle API errors gracefully, inform the user if sync fails, and potentially offer a manual export option.
*   **Backend Logic Errors:** Implement comprehensive logging and monitoring for the Backend application, especially for complex logic like plan adjustment algorithms. Use error reporting tools to capture exceptions.
*   **User Feedback:** Provide clear, user-friendly error messages in the UI when operations fail (e.g., "Failed to generate plan," "Could not save task update").
*   **Monitoring and Alerting:** Implement system-wide monitoring for component health, error rates, and performance metrics. Set up alerts for critical failures (e.g., AI service consistently failing, database connectivity issues).

## 6. Security Flows

Ensuring the confidentiality, integrity, and availability of user data and the system.

*   **Authentication:**
    *   Secure User Registration: Store password hashes using strong, modern algorithms (e.g., bcrypt). Require email verification.
    *   User Login: Authenticate users against stored password hashes.
    *   Session Management: Issue secure, short-lived tokens (e.g., JWT) upon successful login. Store tokens securely (e.g., HttpOnly cookies for web).
    *   Support for OAuth (Google, etc.): Delegate authentication to trusted third parties using standard OAuth flows.
*   **Authorization:**
    *   **Data Ownership:** The fundamental rule is that users can only access and modify data (Goals, Plans, Tasks) associated with *their* User ID. Every request to the Backend API that involves accessing or modifying data must include the user's authenticated identity, and the backend must verify that the user owns the data being acted upon.
    *   API Endpoint Protection: All API endpoints requiring user data access must require a valid authentication token.
    *   Role-Based Access Control (RBAC): If premium features like team planning are introduced, implement RBAC to define different permission levels (e.g., owner, member) for shared goals/plans.
*   **Data Protection:**
    *   Encryption in Transit: All communication between the UI and Backend, and between the Backend and internal/external services (like AI API, Database), must use TLS/SSL.
    *   Encryption at Rest: Encrypt sensitive data (like plan details, especially if they contain personal goals) in the database. Database backups should also be encrypted.
    *   Secure AI Prompt Handling: While the prompt template is public, the actual prompt sent to the AI includes user data. Handle this data securely and understand the AI provider's data retention and privacy policies. Avoid sending overly sensitive personal information to the AI unless necessary and explicitly consented to.
    *   Access Control to Infrastructure: Restrict access to servers, databases, and production environments to authorized personnel only using strong authentication and access controls.
*   **Auditing and Logging:** Maintain detailed logs of security-relevant events (login attempts, failed authorization checks, data modification events) for auditing and incident response.

```
```
