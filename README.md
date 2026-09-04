LoopBoard — Developer Productivity Dashboard

A modern, fully interactive developer productivity dashboard built with Next.js App Router and TypeScript. LoopBoard brings project tracking, task management, team visibility, and analytics together in one clean, responsive, theme-aware interface.

The application includes a realistic data layer with loading states, simulated network latency, error injection, optimistic updates, and a companion Express REST API for full-stack usage.

Live Demo · Backend Documentation

Features
Dashboard
At-a-glance statistics for:
Active projects
Tasks completed this week
Overdue tasks
Team size
Click-through stat cards with deep-linkable filtered views
Project overview cards with:
Progress bars
Avatar stacks
Status badges
Task counts
Due dates
Debounced project search
Status filtering with filter state persisted in the URL
Recent tasks
Live activity feed showing actions such as:
Task creation
Status changes
Task reassignment
Tasks
List View
Search tasks by title or assignee
Filter by priority
Sort by:
Due date
Priority
Title
Multi-select tasks
Bulk status updates
Create, edit, delete, and reassign tasks
Kanban Board
Drag-and-drop workflow using @dnd-kit/core
Columns:
To Do
In Progress
In Review
Done
Optimistic UI updates
Automatic rollback when an update fails
Task CRUD directly from the board
Deep Linking

Filtered task views can be opened directly through URL parameters:

/tasks?status=done
/tasks?overdue=true


Dashboard actions can therefore take users directly to the relevant task view.

Projects
Project List
Searchable project directory
Project status filtering
Live progress indicators
Task counts
Due dates
Team member avatars
Project Details

Each project has its own detail page containing:

Project overview
Progress
Due date
Team members and roles
Project-scoped task management
Add, edit, delete, and reassign tasks
Automatically recalculated task counts

Project members are cross-referenced with the main team directory.

Team

A centralized team directory displaying:

Team members
Roles
Avatars
Project participation
Analytics

LoopBoard includes visual analytics powered by Recharts:

Task status breakdown using a donut chart
Project progress comparison using a bar chart

These provide a quick overview of project health and task distribution.

Productivity Tools
Command Palette

Press:

Ctrl + K


or:

⌘ + K


to open the global command palette.

The command palette allows users to search and navigate across:

Projects
Tasks
Team members

It also supports:

Keyboard navigation
Arrow-key selection
Enter to navigate
Escape to close
Search filtering
Mouse selection
Notifications

The notification dropdown includes:

Unread indicator
Notification list
Relative timestamps
Mark-as-read functionality
Settings
Profile

Update:

Name
Role
Appearance

Choose between:

Light
Dark
System

Theme preferences are persisted across the application.

Notifications

Control which application events generate notifications.

Developer Controls

Developer/demo controls allow you to:

Force simulated API errors
Override network delay
Test loading states
Test error states
Test retry behavior

This makes it easy to demonstrate how the application behaves under different network conditions.

UX & Polish

LoopBoard is designed to behave like a production application rather than a static dashboard.

Responsive layouts for mobile, tablet, and desktop
Keyboard-accessible interactions
Focus-visible states
Loading skeletons
Empty states
Error banners with retry actions
Optimistic UI updates
Error rollback
Debounced search
URL-persisted filters
Light/dark theme support
No flash of unstyled content during theme initialization
Dedicated landing page before entering the dashboard
Tech Stack
Layer	Technology
Framework	Next.js App Router
Language	TypeScript
Styling	Tailwind CSS v4
Design System	Tailwind @theme design tokens
Icons	lucide-react
Theming	next-themes
Drag & Drop	@dnd-kit/core
Charts	Recharts
Frontend Data Layer	In-memory mock data
Backend	Express REST API
Shared Types	TypeScript types shared between frontend and backend
Architecture

LoopBoard supports two data modes.

Local Development / Demo Mode

When no backend API is configured, the application uses the local mock data layer:

lib/mock-data.ts


The mock layer simulates:

Network latency
Loading states
API failures
Create operations
Update operations
Delete operations

This allows the frontend to be developed and demonstrated without requiring a database or backend server.

Full-Stack Mode

The repository also contains a companion Express REST API:

server/


The backend provides API endpoints for:

Users
Projects
Tasks

It includes CRUD operations, validation, and centralized error handling.

For backend setup and API documentation, see:

server/README.md

Getting Started
Prerequisites
Node.js
npm
Installation
git clone <repo-url>
cd LoopBoard
npm install

Start the Development Server
npm run dev


Open:

http://localhost:3000


You'll first see the Get Started landing page. Continue through it to enter the dashboard.

Connecting the Backend

The frontend can run using local mock data by default.

To connect it to the Express API, first follow the backend setup instructions in:

server/README.md


Then create:

.env.local


at the project root and configure:

NEXT_PUBLIC_API_URL=<your-backend-url>

Available Scripts
npm run dev


Start the development server.

npm run build


Create a production build.

npm run lint


Run ESLint.

npx tsc --noEmit


Run TypeScript type checking without emitting files.

Project Structure
LoopBoard/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── team/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar
│   │   │   ├── Sidebar
│   │   │   ├── AppShell
│   │   │   ├── ProfileMenu
│   │   │   ├── ThemeProvider
│   │   │   ├── ThemeToggle
│   │   │   ├── NotificationsDropdown
│   │   │   └── CommandPalette
│   │   │
│   │   ├── ui/
│   │   │   ├── Card
│   │   │   ├── Badge
│   │   │   ├── ProgressBar
│   │   │   ├── Avatar
│   │   │   ├── AvatarStack
│   │   │   ├── Skeleton
│   │   │   ├── EmptyState
│   │   │   └── ConfirmDialog
│   │   │
│   │   └── dashboard/
│   │       ├── StatsRow
│   │       ├── ProjectCard
│   │       ├── TaskCard
│   │       ├── KanbanBoard
│   │       ├── ActivityFeed
│   │       ├── AnalyticsCharts
│   │       ├── TaskFormModal
│   │       ├── ProjectFormModal
│   │       └── SearchFilterBar
│   │
│   ├── lib/
│   │   ├── mock-data.ts
│   │   ├── utils.ts
│   │   └── hooks/
│   │       └── useDebounce.ts
│   │
│   └── types/
│       └── index.ts
│
├── shared/
│   └── types.ts
│
├── server/
│   └── README.md
│
├── public/
│   └── images/
│
└── package.json

Design Notes
Tailwind CSS v4

LoopBoard uses Tailwind CSS v4 with semantic design tokens defined through @theme in globals.css.

The design system includes tokens for concepts such as:

surface
surface-raised
surface-border
ink
ink-muted
accent
status-*


This allows the interface to adapt consistently between light and dark themes.

Simulated Data Layer

The local mock data layer behaves similarly to a real API instead of returning data synchronously.

Requests can simulate:

Delays
Failures
Successful mutations
Loading states

This allows every data-driven screen to demonstrate realistic UI states.

Optimistic Updates

Interactions such as Kanban drag-and-drop and bulk task updates use optimistic UI behavior.

The interface updates immediately while the request is processed. If the request fails, the previous state is restored automatically.

Screenshots
Dashboard

Projects Management

Kanban Tasks Board

Developer Settings & Themes

Backend

The repository includes a companion Express REST API located in:

/server


The backend provides the API layer for users, projects, and tasks.

For:

Backend installation
Environment variables
API endpoints
Request/response examples
Validation
Error handling

see the dedicated backend documentation:

Backend README →

Live Demo

Open LoopBoard

The live demo showcases the dashboard, project management, Kanban task board, analytics, team directory, command palette, notifications, settings, and responsive theme system.

License

MIT