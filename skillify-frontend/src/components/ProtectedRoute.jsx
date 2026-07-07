import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Wrap protected pages: <ProtectedRoute allowedRoles={['instructor']}><InstructorDashboard/></ProtectedRoute>
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
