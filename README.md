# BrainNest — Learning & Course Management Platform

BrainNest is a full-stack e-learning platform where students can discover,
enroll in, and take courses, while instructors can create, manage, and
publish their content — built end-to-end using the MERN stack.

---

## Motivation

Many modern LMS (Learning Management Systems) are either too complex for
simple use cases or lock you into expensive SaaS models (like Teachable or
Kajabi).

BrainNest solves this by providing a lightweight, self-hostable course
platform with clear separation between student and instructor roles, secure
authentication, and real progress tracking — the core building blocks any
learning platform needs.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 (Vite) | Component-based UI |
| Styling | Tailwind CSS | Utility-first responsive design |
| Routing | React Router v6 | Client-side navigation, protected routes |
| Backend | Node.js + Express | REST API server |
| Database | MongoDB + Mongoose | Document-based data storage |
| Auth | JWT + bcrypt | Stateless authentication, password hashing |
| File Handling | Multer | Video/image uploads |

## System Architecture

```
┌─────────────────┐        REST API (JSON)        ┌──────────────────┐
│  React Frontend │ ───────────────────────────▶  │  Express Backend │
│  (Vite + Tailwind)│ ◀───────────────────────────  │  (Node.js)        │
└─────────────────┘        JWT in headers          └──────────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │     MongoDB       │
                                                    │  (Mongoose ODM)   │
                                                    └──────────────────┘
```

- **Frontend** handles UI, routing, and client-side state (AuthContext);
  talks to the backend only via `axios` calls to `/api/...`.
- **Backend** exposes REST endpoints, validates JWTs, enforces role-based
  access control, and talks to MongoDB via Mongoose models.
- **Auth** is stateless — JWT is issued on login/register and sent as a
  Bearer token on every subsequent request.

## Core Features

- **Authentication** — JWT-based register/login, bcrypt password hashing
- **Role-Based Access** — student vs. instructor permissions enforced at
  the API layer, not just hidden in the UI
- **Course Management** — instructors create, edit, delete their own
  courses and lectures (CRUD)
- **Enrollment System** — students enroll in courses; enrollment is
  tracked per student per course
- **Progress Tracking** — lecture completion updates a percentage-complete
  field per enrollment
- **Search & Filter** — full-text search plus category/level filters on
  the course listing
- **Video Learning** — dedicated course player with a lecture sidebar
- **Profile Management** — students and instructors can update their bio,
  name, and avatar
- **Responsive UI** — Tailwind breakpoints across all pages

## Database Schema (ER Overview)

```
User ──┬── (as instructor) ──▶ Course ──▶ Lecture
        └── (as student)   ──▶ Enrollment ──▶ Course
                              └──▶ Progress ──▶ completedLectures[]
```

Five collections: `users`, `courses`, `lectures`, `enrollments`, `progress`.
Full field-level schema is documented in `skillify-backend/README.md`.

## Project Structure

```
skillify/
├── skillify-frontend/     React + Tailwind client
└── skillify-backend/      Express + MongoDB API
```

Each half has its own README with setup instructions and API reference.

## Getting Started

```bash
# 1. Backend
cd skillify-backend
npm install
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm run dev                # runs on http://localhost:5000

# 2. Frontend (separate terminal)
cd skillify-frontend
npm install
cp .env.example .env
npm run dev                # runs on http://localhost:5173
```

MongoDB must be running locally, or point `MONGO_URI` at a MongoDB Atlas
cluster.

## API Reference

Full endpoint documentation with request/response shapes is in
[`skillify-backend/README.md`](../skillify-backend/README.md).

## Future Scope

- Course ratings and reviews
- Payment gateway integration (Razorpay/Stripe) for paid courses
- Certificate generation on course completion
- Admin panel for platform-wide moderation
- Discussion forum / Q&A per course
- Email notifications (enrollment confirmation, course updates)

## Author's Note

This project was built as a demonstration of full-stack MERN development
practices — RESTful API design, JWT authentication, role-based
authorization, and a component-driven React frontend — structured the way
a production learning platform would be, at a scope appropriate for a
major academic/portfolio project.
