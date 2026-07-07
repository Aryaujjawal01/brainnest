# Skillify — Frontend

React (Vite) + Tailwind CSS + React Router frontend for Skillify.

## Setup

```bash
cd skillify-frontend
npm install
cp .env.example .env
npm run dev
```

App will run at http://localhost:5173

Make sure the backend is running at http://localhost:5000 (or update
`VITE_API_BASE_URL` in `.env`).

## Folder Structure

- `src/components/` — reusable UI components (Navbar, Footer, CourseCard, ProtectedRoute)
- `src/pages/` — route-level pages (Home, Login, Register, CourseListing, CourseDetails, CoursePlayer, dashboards, Profile)
- `src/context/AuthContext.jsx` — global auth state (login/register/logout, JWT storage)
- `src/hooks/useAuth.js` — hook to consume AuthContext
- `src/services/api.js` — axios instance with JWT interceptor

## Notes

- All pages are wired to call backend REST APIs at `/api/...` (see api.js).
  Backend routes need to match: `/api/auth`, `/api/courses`, `/api/enrollments`, `/api/users`.
- `ProtectedRoute` handles both auth-check and role-based access
  (`allowedRoles={['student']}` or `['instructor']`).
- Tailwind's `primary` color (indigo) is configured in `tailwind.config.js` — change freely.
