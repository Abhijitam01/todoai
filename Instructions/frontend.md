```markdown
# Todo AI - Frontend Implementation Guide

*   **Version:** 1.0
*   **Date:** June 9, 2025

This document provides a technical implementation guide for the frontend of the Todo AI application, based on the core concept and features outlined in the project brief.

## 1. Component Architecture

The application will be built using a component-based frontend framework like React, Vue, or Angular. For this guide, we'll lean towards concepts applicable to React, but the principles are transferable. We'll follow a container/presentational pattern where appropriate, separating concerns between UI logic and data handling.

**Recommended Framework:** React (with Hooks and potentially Context API or a dedicated state management library)

**Core Components:**

*   **App (Container):** Root component, handles routing and global state initialization.
*   **Auth Pages (Container):** `LoginPage`, `SignupPage`. Handle user authentication forms and logic.
*   **DashboardPage (Container):** Main user landing page post-login. Fetches and displays daily tasks and progress.
    *   `DailyTaskList (Presentational/Container):` Displays today's tasks.
        *   `TaskItem (Presentational):` Displays a single task, checkbox, text, and actions (snooze, edit, reschedule - via props).
    *   `ProgressTracker (Presentational):` Visualizes overall goal progress (bar, stats).
    *   `GoalSummary (Presentational):` Displays the current goal's title, timeframe, etc.
*   **CreateGoalPage (Container):** Handles the form for creating a new goal.
    *   `GoalInputForm (Presentational):` Form fields for goal name, duration, time per day, skill level.
    *   `PlanPreview (Presentational):` Displays the AI-generated plan summary before confirmation.
*   **GoalDetailsPage (Container):** Displays the full roadmap for a specific goal (weekly/daily breakdown).
    *   `WeeklyView (Presentational):` Displays milestones and weekly goals.
    *   `DailyPlanAccordion (Presentational/Container):` Collapsible sections for daily tasks within a week.
*   **MultipleGoalsPage (Container):** Lists all active goals.
    *   `GoalCard (Presentational):` Summary card for each goal.
*   **SettingsPage (Container):** User settings, potentially calendar integration setup.
*   **Reusable UI Components:**
    *   `Button`
    *   `Input`
    *   `Modal`
    *   `LoadingSpinner`
    *   `ErrorMessage`
    *   `ProgressBar`

**Conceptual Component Tree Snippet:**

```
App
├── AuthPages
│   ├── LoginPage
│   └── SignupPage
├── DashboardPage
│   ├── GoalSummary
│   ├── DailyTaskList
│   │   └── TaskItem (xN)
│   └── ProgressTracker
├── CreateGoalPage
│   ├── GoalInputForm
│   └── PlanPreview
├── GoalDetailsPage
│   ├── WeeklyView
│   └── DailyPlanAccordion
│       └── TaskItem (xN)
└── ...other pages (MultipleGoalsPage, SettingsPage)
```

## 2. State Management

Effective state management is crucial for handling user data, goal plans, task status, loading states, and errors across different components.

**Key Application State:**

*   `user`: User authentication status and profile information.
*   `goals`: Array of user's goals.
*   `currentGoal`: The goal currently being viewed or acted upon (including its full plan).
*   `dailyTasks`: Tasks scheduled for the current day.
*   `loading`: Flags for API calls (e.g., `isCreatingGoal`, `isLoadingTasks`).
*   `error`: Stores error messages for display.
*   `uiState`: UI specific states like modal open/closed, form field values before submission.

**Recommended Approach:**

Use a dedicated state management library for global application state, especially for `user`, `goals`, and `currentGoal`/`dailyTasks`. Options include:

*   **Zustand:** Lightweight, hook-based, simple to learn and use. Good for moderate to complex state needs.
*   **Redux Toolkit:** More structured, excellent for larger applications, includes helpful utilities (slices, thunks).
*   **Context API (React):** Suitable for simpler global state or passing props down deeply, but can lead to performance issues with frequent updates if not used carefully.

**Recommendation:** Start with **Zustand** for its balance of simplicity and capability. For larger, more complex applications or teams familiar with Redux patterns, **Redux Toolkit** is a robust choice.

Local component state (`useState` in React) is perfect for managing UI-specific state like form input values, checkbox states within a single item, or modal visibility.

## 3. UI Design

The UI should be clean, intuitive, and focused on guiding the user from goal definition to daily execution.

**Key Layout Considerations:**

*   **Mobile-First Responsive Design:** Users will likely interact with the app on mobile for daily tasks. Ensure layouts adapt gracefully.
*   **Dashboard:** Clear hierarchy. Today's tasks prominent at the top. Progress and goal summary visible.
*   **Goal Creation:** Step-by-step form or a clear single form. Instant feedback/preview of the generated plan is essential.
*   **Daily Task View:** Each task item should be clearly distinguishable. Checkbox/completion status should be easy to interact with. Options (snooze, reschedule) should be accessible but not clutter the view.
*   **Weekly/Roadmap View:** Needs a clear visual structure (e.g., accordion, timeline, calendar-like grid) to show the progression of milestones and tasks.
*   **Progress Tracker:** Simple, visually appealing charts or bars.
*   **Navigation:** Clear navigation between Dashboard, Create Goal, Multiple Goals, Settings.

**User Interactions:**

*   **Goal Input:** Simple form submission. Show a loading state while AI generates the plan.
*   **Task Completion:** Single click/tap on a checkbox or button. Instant visual feedback (strike-through, fade). State updates should be quick.
*   **Task Actions (Snooze, Reschedule, Edit):** These might trigger a modal or inline form for selecting new parameters.
*   **Plan Adaptation:** When the plan changes (due to missed tasks), clearly notify the user and highlight the changes on the roadmap view. Perhaps a modal explaining the adjustments.
*   **AI Feedback:** Integrate optional AI interaction subtly, maybe as a small chat bubble or suggestion after completing a relevant task.

**Styling & UI Libraries:**

Consider using a CSS framework or UI library for speed and consistency:

*   **Tailwind CSS:** Utility-first, highly customizable, great for responsive design.
*   **Material UI (React):** Implements Material Design principles. Provides pre-built components.
*   **Ant Design (React):** Enterprise-class UI toolkit.

## 4. API Integration

The frontend will communicate with the backend API for core functionalities like authentication, goal management, plan generation, and task updates.

**Conceptual Backend Endpoints:**

*   `POST /api/auth/signup`: User registration.
*   `POST /api/auth/login`: User login.
*   `POST /api/goals`: Create a new goal (sends goal details, receives AI-generated plan).
*   `GET /api/goals`: Get all user's goals.
*   `GET /api/goals/:id`: Get a specific goal and its detailed plan.
*   `GET /api/tasks/today`: Get tasks for the current day.
*   `PATCH /api/tasks/:id`: Update task status (complete, snooze, reschedule).
*   `PUT /api/goals/:id/update-plan`: Request plan re-adaptation (backend triggers AI/logic).
*   `GET /api/goals/:id/progress`: Get progress data for a goal.
*   `POST /api/calendar/sync`: Trigger calendar integration sync.

**Communication Method:** REST API is the standard and suitable choice.

**Libraries:**

*   **Axios:** A popular promise-based HTTP client for the browser and Node.js. Provides convenient features like interceptors.
*   `fetch` API (built-in): Can be used directly, potentially with helper functions for error handling and JSON parsing.

**Handling API Calls:**

*   **Async Operations:** All API calls are asynchronous. Use `async/await` or `.then().catch()` with Promises.
*   **Loading States:** Display loading indicators while waiting for responses (e.g., when creating a goal, fetching tasks).
*   **Error Handling:** Implement robust error handling. Display user-friendly error messages. Log errors on the frontend console (during development) or send to a logging service (in production). Handle specific HTTP status codes (401 for unauthorized, 404 not found, 500 server error).
*   **Authentication:** Include the user's authentication token (e.g., JWT in an `Authorization: Bearer ...` header) with protected API requests after login. Store the token securely (e.g., in `localStorage` or `sessionStorage`, with appropriate security considerations).
*   **Data Transformation:** Backend JSON structure might need to be transformed into a format suitable for frontend components and state management.

## 5. Testing Approach

A multi-layered testing strategy ensures application quality, prevents regressions, and facilitates future development.

**Types of Testing:**

*   **Unit Tests:** Test individual functions, small components (e.g., pure components, utility functions) in isolation. Verify they produce expected output for given inputs.
*   **Component Tests:** Test UI components in isolation or shallowly rendered. Verify rendering, props handling, state updates, and user interaction simulation (clicks, input).
*   **Integration Tests:** Test the interaction between multiple components or between components and external services (like a mocked API). Verify data flow and feature workflows (e.g., submitting the goal form and seeing a preview).
*   **End-to-End (E2E) Tests:** Test full user flows through the application in a realistic browser environment. Verify critical paths like user signup/login, creating a goal, viewing the dashboard, marking a task complete.

**Recommended Tools:**

*   **Jest:** JavaScript testing framework. Excellent for unit tests and can be used with React Testing Library for component tests.
*   **React Testing Library (RTL):** (If using React) Focuses on testing components the way users interact with them (querying by text, labels, roles) rather than implementation details.
*   **Cypress or Playwright:** Powerful tools for writing E2E tests with interactive debugging capabilities.

**Testing Strategy:**

1.  **Start with Unit/Component Tests:** Cover core logic and presentational components. Ensure individual pieces work correctly. Aim for good code coverage on key components and utility functions.
2.  **Add Integration Tests:** Test the crucial workflows where components interact (e.g., a form component calling an API hook, a list component rendering items correctly based on data). Mock API calls in these tests.
3.  **Implement E2E Tests:** Cover the most critical user journeys (login -> create goal -> view dashboard -> complete task). These provide confidence that the entire system works together. They are typically fewer in number but catch issues missed by lower-level tests.

**Mocking:** Use mocking libraries (Jest has built-in support, or libraries like `msw` for API mocking) to isolate tests and control external dependencies like API calls.

## 6. Code Examples

Here are simplified code examples illustrating key concepts using React with Hooks and a conceptual Zustand store.

**Example 1: Goal Input Form Component (React with Hooks)**

This component handles user input for creating a new goal.

```jsx
// src/components/GoalInputForm.jsx
import React, { useState } from 'react';
import { useGoalStore } from '../store/goalStore'; // Assuming a Zustand store

function GoalInputForm() {
  const [goalName, setGoalName] = useState('');
  const [duration, setDuration] = useState('');
  const [timePerDay, setTimePerDay] = useState(''); // Optional
  const [skillLevel, setSkillLevel] = useState('beginner'); // Default
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { generatePlanPreview } = useGoalStore(); // Action from Zustand store

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call the store action to initiate API call and update state
      await generatePlanPreview({
        goalName,
        duration,
        timePerDay: timePerDay || undefined, // Send undefined if empty
        skillLevel,
      });
      // If successful, store might navigate or show preview component
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
      console.error(err); // Log detailed error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Goal</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="goalName">Goal:</label>
        <input
          id="goalName"
          type="text"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          placeholder="e.g., Learn Python"
          required
        />
      </div>

      <div>
        <label htmlFor="duration">Timeframe:</label>
        <input
          id="duration"
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 90 days, 3 weeks"
          required
        />
      </div>

      <div>
        <label htmlFor="timePerDay">Time per day (optional):</label>
        <input
          id="timePerDay"
          type="text"
          value={timePerDay}
          onChange={(e) => setTimePerDay(e.target.value)}
          placeholder="e.g., 1 hour"
        />
      </div>

      <div>
        <label htmlFor="skillLevel">Skill Level:</label>
        <select
          id="skillLevel"
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Generating Plan...' : 'Generate Plan'}
      </button>
    </form>
  );
}

export default GoalInputForm;
```

**Example 2: Daily Task Item Component (React)**

Represents a single task with a checkbox and status display.

```jsx
// src/components/TaskItem.jsx
import React from 'react';

function TaskItem({ task, onTaskComplete, onReschedule }) {
  const handleCompleteClick = () => {
    // Optimistic UI update can be done here if desired,
    // then call the parent handler which triggers API call
    onTaskComplete(task.id, !task.isCompleted);
  };

  const handleRescheduleClick = () => {
      onReschedule(task.id); // Parent handles opening modal/form
  }

  const taskStatusClass = task.isCompleted ? 'task-completed' : (task.isOverdue ? 'task-overdue' : 'task-pending');

  return (
    <div className={`task-item ${taskStatusClass}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleCompleteClick}
        disabled={task.isCompleted} // Cannot un-complete for this app's flow?
      />
      <span className="task-text">{task.task}</span>
      {task.isOverdue && <span className="task-overdue-label">OVERDUE</span>}
      {!task.isCompleted && (
          <button onClick={handleRescheduleClick} className="reschedule-button">Reschedule</button>
      )}
      {/* Add snooze/edit buttons similarly */}
    </div>
  );
}

export default TaskItem;
```
*(Note: CSS classes like `task-item`, `task-completed` would be defined in a separate CSS file or styled component)*

**Example 3: Conceptual Zustand Store Slice for Goals/Plans**

This shows how a state management slice might handle fetching tasks and generating plans.

```javascript
// src/store/goalStore.js (Example using Zustand)
import { create } from 'zustand';
import api from '../api'; // Assuming an Axios instance or fetch wrapper

export const useGoalStore = create((set, get) => ({
  goals: [],
  currentGoal: null, // Detailed plan for the active goal
  dailyTasks: [],
  planPreview: null, // Holds the generated plan before user confirms
  isLoading: false,
  error: null,

  // --- Actions ---

  // Fetches daily tasks for the current user/day
  fetchDailyTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.get('/api/tasks/today'); // API call
      set({ dailyTasks: tasks.data, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch daily tasks', isLoading: false });
      console.error(err);
      throw err; // Re-throw for component error handling
    }
  },

  // Updates task status (e.g., complete)
  updateTaskStatus: async (taskId, isCompleted) => {
      // Optimistic update (optional but good UX)
      set(state => ({
          dailyTasks: state.dailyTasks.map(task =>
              task.id === taskId ? { ...task, isCompleted, isPending: false } : task // Assuming isPending exists
          )
      }));
    try {
      await api.patch(`/api/tasks/${taskId}`, { isCompleted }); // API call
      // If backend returns updated task, could refresh state here
      // Or handle potential backend errors rolling back optimistic update
    } catch (err) {
       // Handle error: potentially revert the optimistic update and show message
       set(state => ({
           dailyTasks: state.dailyTasks.map(task =>
               task.id === taskId ? { ...task, isCompleted: !isCompleted, isPending: true } : task
           ),
           error: 'Failed to update task status'
       }));
       console.error(err);
       throw err;
    }
  },

  // Initiates plan generation preview
  generatePlanPreview: async (goalDetails) => {
    set({ isLoading: true, error: null, planPreview: null });
    try {
      // API call to backend which calls GPT
      const previewData = await api.post('/api/goals/preview', goalDetails);
      set({ planPreview: previewData.data, isLoading: false });
      // Navigate to preview page or display modal
    } catch (err) {
      set({ error: 'Failed to generate plan preview', isLoading: false });
      console.error(err);
      throw err;
    }
  },

  // Saves the plan after user confirms the preview
  createGoal: async (goalDetails, planPreview) => {
      set({ isLoading: true, error: null });
      try {
          // API call to save the goal and plan generated server-side
          const newGoal = await api.post('/api/goals', { ...goalDetails, plan: planPreview });
          set(state => ({
              goals: [...state.goals, newGoal.data], // Add to goals list
              currentGoal: newGoal.data, // Set as current
              planPreview: null, // Clear preview
              isLoading: false
          }));
          // Navigate to dashboard or goal details page
      } catch (err) {
          set({ error: 'Failed to save goal', isLoading: false });
          console.error(err);
          throw err;
      }
  }

  // Add actions for fetching goals, fetching single goal, rescheduling, etc.
}));
```

These examples demonstrate how components interact with local state, props, and a global store (which in turn interacts with the API). They highlight the flow of data and user actions.

This guide provides a foundation for the frontend implementation, covering core architectural decisions, state management strategies, UI/UX considerations, API integration patterns, and testing approaches, alongside practical code examples for key areas.
```
