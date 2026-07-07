import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { FiUsers, FiBookOpen, FiDollarSign, FiActivity, FiUserCheck, FiUserX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          api.get('/users'),
          api.get('/courses')
        ])
        setUsers(usersRes.data)
        setCourses(coursesRes.data.courses || coursesRes.data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await api.delete(`/courses/${id}`)
      setCourses(courses.filter(c => c._id !== id))
      toast.success('Course deleted')
    } catch (err) {
      toast.error('Failed to delete course')
    }
  }

  const totalStudents = users.filter(u => u.role === 'student').length
  const totalInstructors = users.filter(u => u.role === 'instructor').length
  const totalRevenue = courses.reduce((acc, c) => acc + ((c.totalStudents || 0) * c.price), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 pb-20">
      {/* Dashboard Header */}
      <div className="bg-slate-900 text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 -right-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-400 to-orange-500 p-1">
              <img 
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}&backgroundColor=0f172a,1e293b,334155`} 
                alt="Avatar" 
                className="w-full h-full rounded-full border-2 border-white dark:border-slate-800"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1">Admin Dashboard</h1>
              <p className="text-slate-300">Platform overview, user management, and system health.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FiUserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInstructors}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Instructors</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FiBookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Courses</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalRevenue}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Revenue</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Users Management */}
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-dark-bg/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><FiUsers /> User Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-sm">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.slice(0, 8).map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            u.role === 'instructor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u.role === 'admin'}
                            className="text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors"
                          >
                            <FiUserX className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Courses Management */}
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-dark-bg/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><FiBookOpen /> Course Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-sm">
                      <th className="p-4 font-medium">Course</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {courses.slice(0, 8).map(c => (
                      <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.instructor?.name || 'Unknown'}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            c.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {c.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteCourse(c._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FiUserX className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
