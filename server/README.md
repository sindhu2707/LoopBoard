# LoopBoard API — Users, Projects & Tasks Backend

An Express + TypeScript REST API that powers user, project, and task data for the LoopBoard dashboard. Built as Task 2 of the Innovation Hacks Full Stack Development Internship.

---

## Tech Stack

| Layer         | Choice                          |
| ------------- | -------------------------------- |
| Runtime       | Node.js + Express                |
| Language      | TypeScript                       |
| Validation    | Zod                               |
| Auth prep     | bcrypt (password hashing)         |
| Data layer    | In-memory store (`/src/data`) — will move to a real database in Task 3 |

---

## Features

- Full CRUD for **Users**, **Projects**, and **Tasks**
- Task status management (`todo` / `in-progress` / `review` / `done`)
- Centralized error handling via custom `AppError` classes and a single Express error-handling middleware
- Request validation with Zod on every write operation (`POST` / `PATCH`) — malformed requests return a `400` with details, never reach the data layer
- Consistent, meaningful HTTP status codes across every route
- Passwords hashed with bcrypt before being stored; never returned in API responses
- Environment-based configuration via `.env`

---

## Getting Started

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server runs at `http://localhost:4000` by default (configurable via `.env`).

### Scripts

```bash
npm run dev       # start with hot-reload (ts-node-dev)
npm run build      # compile TypeScript
npm start           # run compiled build
```

### Environment Variables

| Variable | Description            | Example |
| -------- | ----------------------- | ------- |
| `PORT`   | Port the server listens on | `4000` |

See `.env.example` for the full list — real values live only in your local `.env`, which is gitignored.

---

## Project Structure

```
server/
  src/
    index.ts               # app entry point, middleware & router mounting
    data/
      store.ts               # in-memory data store + CRUD helper functions
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
| 400    | Validation failed on request body   |
| 404    | Resource not found                  |
| 500    | Unexpected server error              |

---

## Roadmap

- **Task 3**: replace the in-memory store with a real database (PostgreSQL/MongoDB), matching the existing function signatures in `data/store.ts`
- **Task 4**: add registration/login/logout and protected routes on top of the existing hashed-password foundation

## License

MIT