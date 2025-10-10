# TodoAI Notion Design System Plan

## 🎨 **Design System Overview**

Transform TodoAI into a Notion-like experience with enhanced productivity features, focusing on clean aesthetics, intuitive interactions, and powerful task management capabilities.

---

## 1. **Color Palette & Brand Identity**

### Primary Colors (Notion-inspired)
```css
/* Light Mode */
--notion-white: #FFFFFF;
--notion-gray-50: #FAFAFA;
--notion-gray-100: #F5F5F5;
--notion-gray-200: #EEEEEE;
--notion-gray-300: #E0E0E0;
--notion-gray-400: #BDBDBD;
--notion-gray-500: #9E9E9E;
--notion-gray-600: #757575;
--notion-gray-700: #616161;
--notion-gray-800: #424242;
--notion-gray-900: #212121;

/* Text Colors */
--notion-text-default: #37352F;
--notion-text-gray: #787774;
--notion-text-light: #9B9A97;
--notion-text-placeholder: #C1C1C0;

/* Brand Colors (TodoAI) */
--todoai-primary: #2563EB;    /* Blue for actions */
--todoai-success: #059669;    /* Green for completed tasks */
--todoai-warning: #D97706;    /* Orange for urgent tasks */
--todoai-error: #DC2626;      /* Red for overdue tasks */

/* Accent Colors */
--notion-blue: #2383E2;
--notion-purple: #9065B0;
--notion-green: #0F7B0F;
--notion-yellow: #E9AB01;
--notion-orange: #D9730D;
--notion-red: #E16259;
--notion-pink: #E155B7;
--notion-brown: #64473A;
```

### Dark Mode Colors
```css
/* Dark Mode */
--notion-dark-bg: #191919;
--notion-dark-surface: #2F3437;
--notion-dark-border: #3C4347;
--notion-dark-text: #FFFFFF;
--notion-dark-text-gray: #B4BEC9;
--notion-dark-text-light: #9CA3AF;
```

---

## 2. **Typography System**

### Font Stack
```css
/* Primary Font (Notion-like) */
--font-primary: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Monospace Font */
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
```

### Typography Scale
```css
/* Headings */
--text-h1: 2rem;      /* 32px - Page titles */
--text-h2: 1.5rem;    /* 24px - Section headers */
--text-h3: 1.25rem;   /* 20px - Subsection headers */
--text-h4: 1.125rem;  /* 18px - Card titles */
--text-h5: 1rem;      /* 16px - Block titles */

/* Body Text */
--text-body: 0.875rem;  /* 14px - Default text */
--text-small: 0.75rem;  /* 12px - Captions, metadata */
--text-xs: 0.6875rem;   /* 11px - Labels, timestamps */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 3. **Spacing & Layout System**

### Spacing Scale (8px base unit)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Layout Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 4. **Component Design System**

### Buttons
- **Primary**: Blue background, white text, subtle shadow
- **Secondary**: Gray background, dark text
- **Ghost**: Transparent background, hover state
- **Text**: Text-only with underline on hover

### Input Fields
- **Default**: Clean borders, focus states with blue outline
- **Search**: Rounded with search icon
- **Textarea**: Resizable with proper line height

### Cards & Containers
- **Subtle borders**: 1px solid with hover effects
- **Rounded corners**: 6-8px radius
- **Shadow**: Very subtle drop shadows
- **Hover states**: Slight elevation and color changes

---

## 5. **Workspace Layout**

### Sidebar Structure
```
┌─────────────────┐
│ TodoAI Logo     │
├─────────────────┤
│ Search          │
├─────────────────┤
│ Quick Actions   │
│ + New Page      │
│ + New Database  │
├─────────────────┤
│ Workspace       │
│ ├ Getting Started│
│ ├ Goals          │
│ ├ Tasks          │
│ ├ Projects       │
│ └ Resources      │
├─────────────────┤
│ Shared          │
├─────────────────┤
│ User Profile    │
│ Settings        │
└─────────────────┘
```

### Main Content Area
- **Page Header**: Title, breadcrumbs, actions
- **Content Blocks**: Editable blocks with slash commands
- **Database Views**: Table, Board, Calendar, Gallery
- **Sidebar Panels**: Properties, comments, activity

---

## 6. **Interaction Patterns**

### Hover States
- **Subtle background changes**: Gray-50 to Gray-100
- **Border highlighting**: Blue accent on focus
- **Icon color changes**: Gray-400 to Gray-600
- **Smooth transitions**: 150ms ease-in-out

### Focus States
- **Blue outline**: 2px solid blue-500
- **Keyboard navigation**: Clear focus indicators
- **Accessible contrast**: WCAG AA compliant

### Loading States
- **Skeleton screens**: For content loading
- **Spinner animations**: For actions
- **Progressive loading**: Content appears gradually

---

## 7. **Database & Template System**

### Task Database Properties
- **Title**: Main task description
- **Status**: To Do, In Progress, Done
- **Priority**: High, Medium, Low
- **Due Date**: Date picker
- **Assignee**: Person property
- **Tags**: Multi-select
- **Progress**: Number (0-100)
- **Notes**: Rich text

### Goal Database Properties
- **Title**: Goal name
- **Description**: Rich text
- **Start Date**: Date picker
- **Target Date**: Date picker
- **Status**: Planning, Active, Completed, Paused
- **Category**: Select field
- **Tasks**: Relation to task database
- **Progress**: Calculated field

### Templates
- **Personal Task Management**
- **Project Planning**
- **Goal Setting & Tracking**
- **Daily/Weekly Planning**
- **Team Collaboration**
- **Learning & Development**

---

## 8. **Advanced Features**

### Command Palette (Cmd+K)
- **Page Navigation**: Quick page switching
- **Action Commands**: Create, edit, delete
- **Template Insertion**: Quick template access
- **Search**: Global search across all content

### Slash Commands
- **Text Blocks**: `/text`, `/heading1`, `/heading2`, `/heading3`
- **Lists**: `/bullet`, `/number`, `/todo`
- **Media**: `/image`, `/video`, `/file`
- **Database**: `/table`, `/board`, `/calendar`
- **Advanced**: `/code`, `/quote`, `/divider`

### Keyboard Shortcuts
- **Navigation**: Cmd+Shift+N (new page), Cmd+P (search)
- **Editing**: Cmd+B (bold), Cmd+I (italic), Cmd+K (link)
- **Actions**: Cmd+Enter (save), Esc (cancel)

---

## 9. **Mobile Responsiveness**

### Breakpoint Strategy
- **Mobile First**: Start with mobile design
- **Progressive Enhancement**: Add features for larger screens
- **Touch Optimized**: Larger touch targets (44px minimum)
- **Swipe Gestures**: Navigation and actions

### Mobile Layout
- **Collapsible Sidebar**: Overlay on mobile
- **Bottom Navigation**: Quick access to main sections
- **Floating Action Button**: Quick task creation
- **Pull to Refresh**: Content updates

---

## 10. **Performance & Accessibility**

### Performance
- **Lazy Loading**: Load content as needed
- **Virtual Scrolling**: For large lists
- **Optimistic Updates**: Immediate UI feedback
- **Caching Strategy**: Smart content caching

### Accessibility
- **Screen Reader Support**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Clear focus indicators

---

## 11. **Implementation Phases**

### Phase 1: Foundation (Week 1-2)
- [ ] Color system implementation
- [ ] Typography setup
- [ ] Basic component library
- [ ] Layout system

### Phase 2: Core Features (Week 3-4)
- [ ] Sidebar implementation
- [ ] Page editor with blocks
- [ ] Basic database views
- [ ] Search functionality

### Phase 3: Advanced Features (Week 5-6)
- [ ] Command palette
- [ ] Templates system
- [ ] Mobile optimization
- [ ] Performance optimization

### Phase 4: Polish (Week 7-8)
- [ ] Animations and transitions
- [ ] Accessibility improvements
- [ ] Testing and bug fixes
- [ ] Documentation

---

## 12. **Success Metrics**

### User Experience
- **Time to First Task**: < 30 seconds
- **Task Creation Speed**: < 5 seconds
- **Navigation Efficiency**: < 3 clicks to any feature
- **Mobile Usability**: 90%+ mobile satisfaction

### Technical Performance
- **Page Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: 90+ across all metrics

---

This plan ensures TodoAI becomes a Notion-like experience that's even better for task management, with enhanced productivity features, beautiful design, and exceptional user experience.
