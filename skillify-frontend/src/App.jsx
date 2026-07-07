import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CourseListing from './pages/CourseListing'
import CourseDetails from './pages/CourseDetails'
import CoursePlayer from './pages/CoursePlayer'
import StudentDashboard from './pages/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import CreateCourse from './pages/CreateCourse'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import Wishlist from './pages/Wishlist'

function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      {!isDashboard && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/courses" element={<CourseListing />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          {/* Student-only routes */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* Instructor-only routes */}
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instructor/course/new"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Any logged-in user */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  )
}

export default App
