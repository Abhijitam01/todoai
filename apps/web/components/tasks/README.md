# Task Management Dialogs

This folder contains reusable task management dialog components for the TodoAI application.

## Components

### SnoozeDialog

A simple confirmation dialog that allows users to snooze a task until tomorrow.

**Features:**
- ✅ Simple "snooze until tomorrow" functionality
- ✅ Framer Motion slide-in animations
- ✅ Task preview with goal and status information
- ✅ Tomorrow's date preview
- ✅ Console logging for demo purposes

**Usage:**
```tsx
import { SnoozeDialog } from '@/components/tasks';

const task = {
  id: "task-1",
  title: "Design hero section",
  date: "2025-06-10",
  goal: "Launch Portfolio",
  status: "PENDING"
};

<SnoozeDialog
  open={isSnoozeOpen}
  onOpenChange={setIsSnoozeOpen}
  onSnooze={(taskId) => console.log(`Task ${taskId} snoozed`)}
  task={task}
/>
```

### RescheduleDialog

A comprehensive dialog for rescheduling tasks to custom dates with optional reasoning.

**Features:**
- ✅ Quick date options (Tomorrow, Next Week, Next Month)
- ✅ Custom date picker with date validation
- ✅ Optional reason field for rescheduling
- ✅ Rich preview showing date changes
- ✅ Framer Motion animations with staggered delays
- ✅ Task information display

**Usage:**
```tsx
import { RescheduleDialog } from '@/components/tasks';

<RescheduleDialog
  open={isRescheduleOpen}
  onOpenChange={setIsRescheduleOpen}
  onReschedule={(taskId, newDate, reason) => {
    console.log(`Task ${taskId} rescheduled to ${newDate}`, reason);
  }}
  task={task}
/>
```

## Task Interface

Both components expect a task object with the following structure:

```typescript
interface Task {
  id: string;       // Unique task identifier
  title: string;    // Task title/description
  date: string;     // Current due date (YYYY-MM-DD format)
  goal: string;     // Associated goal name
  status: string;   // Task status (e.g., "PENDING", "COMPLETED")
}
```

## Demo Component

The `TaskDialogDemo` component provides a working example of both dialogs in action:

- Sample task card with trigger buttons
- Feature overview cards
- Interactive demo with console logging
- Responsive design with Tailwind CSS

## Integration Notes

### Backend Integration
Both components include TODO comments indicating where backend integration should be added:

```typescript
// TODO: Hook up backend integration for snooze functionality
// TODO: Hook up backend integration for reschedule functionality
```

### Styling
- Uses shadcn/ui Dialog component as base
- Consistent dark theme with `bg-black` and white/opacity variations
- Tailwind CSS for responsive design
- Framer Motion for smooth animations

### Animation Details
- **Entry**: Scale and fade-in effects
- **Staggered**: Children animate with incremental delays
- **Exit**: Scale and fade-out transitions
- **Hover**: Subtle button hover states

## Development

The components are fully typed with TypeScript and follow React best practices:

- Controlled component pattern with `open` and `onOpenChange` props
- Proper state management with `useState`
- Event handling with console logging for development
- Accessible dialog implementation via shadcn/ui

## File Structure

```
components/tasks/
├── SnoozeDialog.tsx      # Simple snooze confirmation dialog
├── RescheduleDialog.tsx  # Advanced reschedule dialog with date picker
├── TaskDialogDemo.tsx    # Demo component showcasing both dialogs
├── index.ts              # Export declarations
└── README.md             # This documentation file
```

## Testing

Visit `/task-dialogs-demo` in your application to see both dialogs in action with interactive examples. 