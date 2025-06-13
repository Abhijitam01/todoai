import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatar: text('avatar'),
  isEmailVerified: boolean('is_email_verified').default(false),
  emailVerificationToken: text('email_verification_token'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Goals table
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high, urgent
  status: varchar('status', { length: 20 }).default('active'), // active, completed, paused, cancelled
  targetDate: timestamp('target_date'),
  completedAt: timestamp('completed_at'),
  progress: integer('progress').default(0), // 0-100
  aiSuggestions: jsonb('ai_suggestions'), // Store AI-generated suggestions
  tags: jsonb('tags'), // Array of tags
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  goalId: uuid('goal_id').references(() => goals.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high, urgent
  status: varchar('status', { length: 20 }).default('pending'), // pending, in_progress, completed, cancelled
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  estimatedMinutes: integer('estimated_minutes'),
  actualMinutes: integer('actual_minutes'),
  tags: jsonb('tags'), // Array of tags
  dependencies: jsonb('dependencies'), // Array of task IDs this task depends on
  isRecurring: boolean('is_recurring').default(false),
  recurringPattern: jsonb('recurring_pattern'), // Store recurring pattern config
  parentTaskId: uuid('parent_task_id'),
  order: integer('order').default(0), // For ordering tasks
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Task comments/notes
export const taskComments = pgTable('task_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Time tracking
export const timeEntries = pgTable('time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  goalId: uuid('goal_id').references(() => goals.id, { onDelete: 'cascade' }),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in minutes
  isManual: boolean('is_manual').default(false), // true if manually added, false if tracked
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User preferences and settings
export const userSettings = pgTable('user_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  dateFormat: varchar('date_format', { length: 20 }).default('MM/DD/YYYY'),
  timeFormat: varchar('time_format', { length: 10 }).default('12h'), // 12h or 24h
  weekStartsOn: integer('week_starts_on').default(0), // 0 = Sunday, 1 = Monday
  theme: varchar('theme', { length: 20 }).default('light'), // light, dark, auto
  notifications: jsonb('notifications'), // Notification preferences
  aiPreferences: jsonb('ai_preferences'), // AI-related preferences
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// AI interactions and suggestions
export const aiInteractions = pgTable('ai_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // goal_planning, task_breakdown, productivity_insights, etc.
  input: jsonb('input').notNull(), // User input/context
  output: jsonb('output').notNull(), // AI response
  metadata: jsonb('metadata'), // Additional metadata (model used, tokens, etc.)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  goals: many(goals),
  tasks: many(tasks),
  timeEntries: many(timeEntries),
  taskComments: many(taskComments),
  settings: one(userSettings),
  aiInteractions: many(aiInteractions),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
  timeEntries: many(timeEntries),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  goal: one(goals, {
    fields: [tasks.goalId],
    references: [goals.id],
  }),
  comments: many(taskComments),
  timeEntries: many(timeEntries),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskComments.userId],
    references: [users.id],
  }),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
  goal: one(goals, {
    fields: [timeEntries.goalId],
    references: [goals.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const aiInteractionsRelations = relations(aiInteractions, ({ one }) => ({
  user: one(users, {
    fields: [aiInteractions.userId],
    references: [users.id],
  }),
}));

// Export all tables for easy access
export const schema = {
  users,
  goals,
  tasks,
  taskComments,
  timeEntries,
  userSettings,
  aiInteractions,
}; 