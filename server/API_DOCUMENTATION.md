# LoopBoard API Documentation

Base URL (local): `http://localhost:4000`

All request/response bodies are JSON. All write operations (`POST`, `PATCH`) are validated with Zod — invalid data returns `400` before touching the data layer.

---

## Error Format

Every error response follows this shape:

```json
{
  "error": {
    "message": "Task not found",
    "details": []
  }
}
```

`details` is populated for `400` validation errors and contains the list of specific field issues.

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 204 | Success, no content (used for DELETE) |
| 400 | Invalid request body |
| 404 | Resource not found |
| 500 | Unexpected server error |

---

## Users

### `GET /api/users`
Returns all users. Passwords are never included in the response.

**Response `200`**
```json
[
  { "id": "u1", "name": "Sarah Patel", "role": "Frontend Engineer", "email": "sarah@xyz.com" }
]
```

### `GET /api/users/:id`
Returns a single user by id, or `404` if not found.

### `POST /api/users`
Creates a user. Password is hashed with bcrypt before storage.

**Request body**
```json
{
  "name": "Max Lee",
  "role": "Full-stack Engineer",
  "email": "max@xyz.com",
  "password": "securepass123"
}
```

**Response `201`** — same shape as `GET /:id`, password omitted.

### `PATCH /api/users/:id`
Partial update. Any subset of `name`, `role`, `email`, `password`. If `password` is included, it's re-hashed.

### `DELETE /api/users/:id`
Returns `204` on success, `404` if the user doesn't exist.

---

## Projects

### `GET /api/projects`
Returns all projects. `taskCount`/`completedTaskCount` are computed live from related tasks, not stored counters.

**Response `200`**
```json
[
  {
    "id": "clx1a2b3c",
    "name": "Design System v2",
    "description": "Unify tokens and components across product surfaces.",
    "status": "on-track",
    "progress": 72,
    "memberIds": ["clx9m1", "clx9m2", "clx9m3"],
    "members": ["Sarah Patel", "Alex Kim", "Jo Chen"],
    "taskCount": 24,
    "completedTaskCount": 17,
    "dueDate": "2026-09-15"
  }
]
```
`members` (names) is resolved server-side from `memberIds` and included for convenience — write requests should send `memberIds`, not `members`.

### `GET /api/projects/:id`
Single project by id, or `404`.

### `POST /api/projects`
**Request body**
```json
{
  "name": "New Project",
  "description": "Short description.",
  "status": "on-track",
  "progress": 0,
  "memberIds": ["clx9m1"],
  "dueDate": "2026-12-01"
}
```
`status` must be one of: `on-track`, `at-risk`, `delayed`, `completed`. `memberIds` must reference existing team members (`GET /api/team` for ids) — an unknown id returns `404`.

**Response `201`** — created project object.

### `PATCH /api/projects/:id`
Partial update of any field above. Sending `memberIds` replaces the full membership list (not a merge).

### `DELETE /api/projects/:id`
Returns `204` on success, `404` if not found. Deleting a project also deletes its tasks (cascade).

---

## Tasks

### `GET /api/tasks`
Returns all tasks.

**Response `200`**
```json
[
  {
    "id": "clx1t1",
    "title": "Finalize color token naming",
    "status": "in-progress",
    "priority": "high",
    "projectId": "clx1a2b3c",
    "assigneeId": "clx9m1",
    "assignee": "Sarah Patel",
    "dueDate": "2026-08-25"
  }
]
```
`assignee` (name) is resolved server-side from `assigneeId` and included for convenience — write requests should send `assigneeId`, not `assignee`. `assigneeId` is `null` for unassigned tasks.

### `GET /api/tasks/:id`
Single task by id, or `404`.

### `POST /api/tasks`
**Request body**
```json
{
  "title": "Write release notes",
  "status": "todo",
  "priority": "medium",
  "projectId": "clx1a2b3c",
  "assigneeId": "clx9m2",
  "dueDate": "2026-09-10"
}
```
`status` must be one of: `todo`, `in-progress`, `review`, `done`.
`priority` must be one of: `low`, `medium`, `high`.
`projectId` must reference an existing project; `assigneeId` (optional) must reference an existing team member — either returns `404` if not found.

**Response `201`** — created task object.

### `PATCH /api/tasks/:id`
Partial update — commonly used for status changes, e.g. `{ "status": "done" }`. Send `"assigneeId": null` to unassign a task.

### `DELETE /api/tasks/:id`
Returns `204` on success, `404` if not found.

---

## Team

### `GET /api/team`
Returns all team members.

**Response `200`**
```json
[
  { "id": "m1", "name": "Sarah Patel", "role": "Frontend Engineer", "email": "sarah@xyz.com" }
]
```

### `GET /api/team/:id`
Single member by id, or `404`.

### `POST /api/team`
**Request body**
```json
{ "name": "Priya Rao", "role": "Backend Engineer", "email": "priya@xyz.com" }
```

**Response `201`** — created member object.

### `PATCH /api/team/:id`
Partial update.

### `DELETE /api/team/:id`
Returns `204` on success, `404` if not found.