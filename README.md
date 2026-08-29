# Loopboard — Developer Productivity Dashboard

A modern, fully interactive developer productivity dashboard built with Next.js App Router and TypeScript. Loopboard brings together project tracking, task management, team visibility, and analytics in one clean, theme-aware interface — backed by a realistic mock data layer that simulates loading states, errors, and network delay.

**[Live Demo](#https://loop-board-six.vercel.app/) · [Video Walkthrough](#https://drive.google.com/file/d/1qp_M-4iFi8FCSSAfOYvDn7ZBFUlytaLc/view?usp=sharing)**

---

## Features

### Dashboard
- At-a-glance stats (active projects, tasks completed this week, overdue tasks, team size) with click-through drill-down navigation
- Project overview cards with progress bars, avatar stacks, and status badges
- Debounced search + status filtering across projects, with filter state persisted in the URL
- Recent tasks list and a live Activity Feed showing real actions (status changes, task creation, reassignment) as they happen

### Tasks
- **List view** — search by title/assignee, filter by priority, sort by due date/priority/title
- **Board view** — full drag-and-drop Kanban board (To Do → In Progress → In Review → Done) with optimistic updates and automatic rollback on failure
- **Bulk actions** — multi-select tasks and apply a status change to all of them at once
- **Full CRUD** — create, edit, and delete tasks directly from the list or board, including reassigning the owner
- Deep-linkable filtered views (`?status=done`, `?overdue=true`) driven from the dashboard stat cards

### Projects
- Project list with live progress, task counts, and due dates
- **Project detail page** per project — full overview, progress, due date, and:
  - Team members with their roles (cross-referenced from the team directory)
  - Project-scoped task list with the same add/edit/delete/reassign flow as the global Tasks page
  - Task counts recalculate automatically as tasks are added, completed, or removed

### Team
- Directory of team members with roles and avatars

### Analytics
- Task status breakdown (donut chart)
- Project progress comparison (bar chart)

### Productivity tools
- **Command palette (⌘K / Ctrl+K)** — fuzzy-search and jump to any project, task, or team member from anywhere in the app
- **Notifications dropdown** — unread indicator, mark-as-read, relative timestamps

### Settings
- **Profile** — update your name and role
- **Appearance** — light / dark / system theme, persisted across the app
- **Notification preferences** — toggle which events you get notified about
- **Developer controls** — force simulated errors or override network delay app-wide, useful for demoing loading/error states on any screen

### Polish
- Fully responsive (375 / 768 / 1280px breakpoints), keyboard accessible, focus-visible states throughout
- Loading skeletons, empty states, and error banners with retry — for every data-driven view
- Light/dark theme toggle with no flash-of-unstyled-content on load
- A dedicated landing page ("Get Started") in front of the dashboard

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` design tokens) |
| Icons | lucide-react |
| Theming | next-themes |
| Drag & drop | @dnd-kit/core |
| Charts | Recharts |
| Data layer | In-memory mock data with simulated latency & error injection |

No backend or database — all data lives in `lib/mock-data.ts` and resets on a full reload. This keeps the project easy to run, demo, and extend without any setup.

---

## Getting Started

```bash
git clone <repo-url>
cd dev-productivity-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the "Get Started" screen; click through to reach the dashboard.

### Scripts

```bash
npm run dev          # start the dev server
npm run build         # production build
npm run lint          # eslint
npx tsc --noEmit       # type-check without emitting
```

---

## Project Structure

```
src/
  app/
    page.tsx                    # landing page ("Get Started")
    dashboard/page.tsx          # main dashboard
    projects/
      page.tsx                  # project list (searchable/filterable)
      [id]/page.tsx             # project detail (overview, team, tasks CRUD)
    tasks/page.tsx               # task list + Kanban board, search/sort/filter, bulk actions
    team/page.tsx                 # team directory
    analytics/page.tsx            # charts
    settings/page.tsx             # profile, appearance, notifications, dev controls
    layout.tsx, globals.css

  components/
    layout/     — Navbar, Sidebar, AppShell, ProfileMenu, ThemeProvider,
                  ThemeToggle, NotificationsDropdown, CommandPalette
    ui/         — Card, Badge, ProgressBar, Avatar (+ AvatarStack), Skeleton, EmptyState
    dashboard/  — StatsRow, ProjectCard, TaskCard, KanbanBoard, ActivityFeed,
                  AnalyticsCharts, TaskFormModal, SearchFilterBar (+ skeleton variants)

  lib/
    mock-data.ts        # simulated async data layer (fetch + create/update/delete)
    utils.ts             # cn() class-merging helper
    hooks/useDebounce.ts

  types/index.ts          # Task, Project, User, TeamMember, ActivityEvent, etc.
```

---

## Design Notes

- **Tailwind v4** uses `@theme` in `globals.css` instead of `tailwind.config.ts`, with semantic tokens (`surface`, `ink`, `accent`, `status-*`) that adapt between light and dark mode.
- **Mock data layer** mimics a real API: every fetch takes a configurable delay and can simulate failure via `simulateError`, letting every screen's loading/empty/error states be tested deliberately — including a global override in Settings → Developer Controls.
- **Optimistic UI**: drag-and-drop and bulk actions update the screen immediately and roll back automatically if the simulated request fails.

---

## License

MIT
