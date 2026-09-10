# LoopBoard API — Users, Projects & Tasks Backend

An Express + TypeScript REST API that powers user, project, and task data for the LoopBoard dashboard. Built as Task 2 (REST API) and Task 3 (Database Integration) of the Innovation Hacks Full Stack Development Internship.

---

## Tech Stack

| Layer         | Choice                          |
| ------------- | -------------------------------- |
| Runtime       | Node.js + Express                |
| Language      | TypeScript                       |
| Validation    | Zod                               |
| Auth prep     | bcrypt (password hashing)         |
| Database      | PostgreSQL                        |
| ORM           | Prisma                            |

---

## Features

- Full CRUD for **Users**, **Projects**, **Tasks**, and **Team Members**, backed by PostgreSQL
- Real relational modeling: `Task.assigneeId` is a foreign key to `TeamMember`; `Project` ↔ `TeamMember` is a many-to-many relation via an explicit `ProjectMember` join table
- Task status management (`todo` / `in-progress` / `review` / `done`)
- Centralized error handling via custom `AppError` classes and a single Express error-handling middleware — Prisma constraint errors (bad foreign keys, missing records) are translated into the same `NotFoundError`/`ValidationError` shape as everything else
- Request validation with Zod on every write operation (`POST` / `PATCH`) — malformed requests return a `400` with details, never reach the data layer
- Consistent, meaningful HTTP status codes across every route
- Passwords hashed with bcrypt before being stored; never returned in API responses
- Environment-based configuration via `.env` — no credentials in source control

---

## Getting Started

```bash
cd server
npm install                    # also runs `prisma generate` via postinstall
cp .env.example .env           # then fill in DATABASE_URL
npm run prisma:migrate         # creates tables from prisma/schema.prisma
npm run prisma:seed            # loads sample projects/tasks/team members
npm run dev
```

Server runs at `http://localhost:4000` by default (configurable via `.env`).

You need a Postgres database to point `DATABASE_URL` at. Easiest options for local dev:
- A free hosted instance on [Neon](https://neon.tech) or [Supabase](https://supabase.com) — copy the connection string they give you.
- Or run Postgres locally / via Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`.

### Scripts

```bash
npm run dev               # start with hot-reload (ts-node-dev)
npm run build              # prisma generate + compile TypeScript
npm start                   # run compiled build
npm run prisma:migrate       # create/apply a migration in dev
npm run prisma:deploy         # apply existing migrations (production/CI)
npm run prisma:seed            # (re)populate sample data
npm run prisma:studio           # open Prisma's DB browser GUI
```

### Environment Variables

| Variable       | Description                    | Example |
| -------------- | -------------------------------- | ------- |
| `PORT`         | Port the server listens on         | `4000` |
| `DATABASE_URL` | Postgres connection string           | `postgresql://user:pass@host:5432/loopboard?schema=public` |

See `.env.example` for the full template — real values live only in your local `.env`, which is gitignored.

---

## Project Structure

```
server/
  prisma/
    schema.prisma           # data model — Users, Projects, Tasks, TeamMembers, relations
    migrations/                # generated SQL migrations (created by `prisma migrate dev`)
    seed.js                      # populates sample data
  src/
    index.ts                       # app entry point, middleware & router mounting
    lib/
      prisma.ts                      # shared PrismaClient instance
    data/
      store.ts                         # Prisma-backed CRUD helper functions
    routes/
      users.ts, projects.ts, tasks.ts, team.ts
    schemas/
      user.ts, project.ts, task.ts, teamMember.ts   # Zod validation schemas
    errors/
      AppError.ts              # AppError, NotFoundError, ValidationError
    middleware/
      errorHandler.ts           # centralized error-response formatting
      asyncHandler.ts            # wraps async routes so thrown errors reach errorHandler
  .env.example
  package.json
  tsconfig.json
```

Shared types (`Task`, `Project`, `User`, `TeamMember`) live in `/shared/types.ts` at the repo root and are imported here via the `@shared/*` path alias, kept identical to what the frontend uses.

---

## Data Model & Relationships

```
User            — standalone, for authentication (Task 4)
TeamMember      — assignable people
Project 1───* Task           (Task.projectId, cascade delete)
TeamMember 1───* Task        (Task.assigneeId, nullable, set-null on delete)
Project *───* TeamMember     (via ProjectMember join table, cascade delete)
```

`User` and `TeamMember` are intentionally kept separate for now — `User` is the auth-facing identity that Task 4's login will use; `TeamMember` is the "who can this task be assigned to" concept the dashboard already displays. They may get merged once real auth lands in Task 4.

### API contract note (Task 2 → Task 3 change)

Task 2's in-memory store matched people by **name string** (`assignee: "Sarah Patel"`, `members: ["Sarah Patel", ...]`) with no real relation. Task 3 replaces this with foreign keys:

- **Write requests** now send `assigneeId` (Task) and `memberIds` (Project) — real `TeamMember` IDs.
- **Read responses** still include the resolved `assignee` name / `members` names (for the existing frontend), *plus* the new `assigneeId` / `memberIds` fields, so nothing currently consuming the API breaks.

---

## API Documentation

See [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) for the full endpoint reference, including request/response examples for every route.

**Quick reference:**

| Resource | Base path       |
| -------- | ---------------- |
| Users    | `/api/users`      |
| Projects | `/api/projects`   |
| Tasks    | `/api/tasks`       |
| Team     | `/api/team`         |

Each resource supports: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`.

---

## Error Response Format

All errors return a consistent shape:

```json
{
  "error": {
    "message": "Task not found",
    "details": []
  }
}
```

| Status | Meaning                          |
| ------ | ---------------------------------- |
| 400    | Validation failed on request body, or an invalid foreign key was referenced |
| 404    | Resource not found                  |
| 500    | Unexpected server error              |

---

## Roadmap

- **Task 4**: add registration/login/logout and protected routes on top of the existing hashed-password foundation; wire the frontend's `lib/mock-data.ts` layer to call these `/api/*` endpoints instead of in-memory mocks; deploy the server (Render/Railway) alongside the existing Vercel frontend.

## License

MIT
