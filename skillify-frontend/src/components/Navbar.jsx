import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ThemeContext } from '../context/ThemeProvider'
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiUser, FiSettings, FiBell, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { formatDistanceToNow } from 'date-fns'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => setNotifications(res.data)).catch(console.error)
    }
  }, [user])

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="glass sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            BrainNest
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Courses</Link>

            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {!user && (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            )}

            {user && user.role === 'student' && (
              <Link to="/dashboard/student" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
            )}

            {user && user.role === 'instructor' && (
              <Link to="/dashboard/instructor" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/dashboard/admin" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
            )}

            {user && (
              <div className="flex items-center gap-4">
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition-colors relative"
                  >
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                          <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map(notification => (
                              <div 
                                key={notification._id}
                                className={`p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-3 ${!notification.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                              >
                                <div className="flex-1">
                                  <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); markAsRead(notification._id) }}
                                    className="text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 p-1.5 rounded-full self-start"
                                    title="Mark as read"
                                  >
                                    <FiCheck className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/wishlist" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Wishlist</Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Profile</Link>
                <button onClick={handleLogout} className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
