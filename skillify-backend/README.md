# Skillify — Backend

Node.js + Express + MongoDB REST API for Skillify, with JWT auth and
role-based access control (student / instructor).

## Setup

```bash
cd skillify-backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local MongoDB or MongoDB Atlas connection string)
#            set a strong JWT_SECRET
npm run dev
```

API runs at http://localhost:5000 — health check: `GET /api/health`

Requires MongoDB running locally (`mongod`) or a MongoDB Atlas cluster
(update `MONGO_URI` accordingly). Requires `nodemon` for `npm run dev`
(already in devDependencies, installed via `npm install`).

## Sample Data (Seed Script)

To quickly populate the database with demo instructors, students, and
courses:

```bash
npm run seed
```

This creates 2 instructors, 1 student (already enrolled in a course with
partial progress), 2 courses, and 5 lectures. Login credentials are printed
to the console after seeding — all sample accounts use `password123`.

## API Testing (Postman)

A ready-to-import Postman collection is included at
`postman/Skillify.postman_collection.json`. Import it into Postman, set the
`baseUrl` variable (defaults to `http://localhost:5000/api`), log in via the
`Auth > Login` request, then copy the returned token into the collection's
`token` variable to authenticate subsequent requests.

## Security Middleware

- **express-validator** — request body validation on register, login,
  course, and lecture creation (`middleware/validators.js`)
- **express-rate-limit** — 20 requests / 15 min on auth endpoints, 300
  requests / 15 min on the rest of the API (`middleware/rateLimiter.js`)
- **express-mongo-sanitize** — strips `$` and `.` operators from
  request bodies/params to block NoSQL injection
- **morgan** — request logging (`dev` format locally, `combined` in
  production)

## API Overview

### Auth — `/api/auth`

| Method | Route       | Access  | Description                                               |
| ------ | ----------- | ------- | --------------------------------------------------------- |
| POST   | `/register` | Public  | Register (body: name, email, password, role)              |
| POST   | `/login`    | Public  | Login (body: email, password) → returns `{ token, user }` |
| GET    | `/me`       | Private | Get logged-in user                                        |

### Users — `/api/users`

| Method | Route  | Access              |
| ------ | ------ | ------------------- |
| GET    | `/:id` | Public              |
| PUT    | `/:id` | Private (self only) |
| DELETE | `/:id` | Private (self only) |

### Courses — `/api/courses`

| Method | Route                                    | Access                                   |
| ------ | ---------------------------------------- | ---------------------------------------- |
| GET    | `/?search=&category=&level=&instructor=` | Public                                   |
| GET    | `/:id`                                   | Public (populates instructor + lectures) |
| POST   | `/`                                      | Instructor only                          |
| PUT    | `/:id`                                   | Instructor only (owner)                  |
| DELETE | `/:id`                                   | Instructor only (owner)                  |

### Lectures — `/api/courses/:courseId/lectures`

| Method | Route  | Access                                |
| ------ | ------ | ------------------------------------- |
| GET    | `/`    | Enrolled student or owning instructor |
| POST   | `/`    | Owning instructor                     |
| PUT    | `/:id` | Owning instructor                     |
| DELETE | `/:id` | Owning instructor                     |

### Enrollments & Progress — `/api/enrollments`

| Method | Route                 | Access                                                     |
| ------ | --------------------- | ---------------------------------------------------------- |
| POST   | `/`                   | Student (body: `{ course: courseId }`)                     |
| GET    | `/my-courses`         | Student — returns enrolled courses + progress %            |
| PUT    | `/progress/:courseId` | Student (body: `{ lectureId }`) — marks a lecture complete |
| GET    | `/progress/:courseId` | Student — get raw progress record                          |

## Auth Flow

1. Client sends `Authorization: Bearer <token>` header on every protected request.
2. `protect` middleware verifies the JWT and attaches `req.user`.
3. `authorize('instructor')` / `authorize('student')` middleware restricts
   routes by role — stack them after `protect`.

## Folder Structure

```
config/      MongoDB connection
models/      Mongoose schemas (User, Course, Lecture, Enrollment, Progress)
controllers/ Route handler logic
routes/      Express routers, one per resource
middleware/  auth (JWT), role (RBAC), error handling, file upload (multer)
utils/       generateToken helper
server.js    App entry point
```

## Connecting the Frontend

The frontend's `.env` should point `VITE_API_BASE_URL` at
`http://localhost:5000/api` — matches the route prefixes above exactly.
CORS is configured to allow `CLIENT_URL` (default `http://localhost:5173`).
