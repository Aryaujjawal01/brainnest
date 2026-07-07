import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { FiPlus, FiEdit2, FiEye, FiUsers, FiDollarSign, FiBookOpen, FiBarChart2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get('/courses', { params: { instructor: user?._id } })
        setCourses(data.courses || data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (user?._id) fetchMyCourses()
  }, [user])

  const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0)
  const totalRevenue = courses.reduce((acc, c) => acc + ((c.totalStudents || 0) * c.price), 0)

  const mockChartData = [
    { name: 'Jan', revenue: 4000, students: 240 },
    { name: 'Feb', revenue: 3000, students: 139 },
    { name: 'Mar', revenue: 2000, students: 980 },
    { name: 'Apr', revenue: 2780, students: 390 },
    { name: 'May', revenue: 1890, students: 480 },
    { name: 'Jun', revenue: 2390, students: 380 },
    { name: 'Jul', revenue: 3490, students: 430 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 pb-20">
      {/* Dashboard Header */}
      <div className="bg-slate-900 text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 p-1">
              <img 
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}&backgroundColor=0f172a,1e293b,334155`} 
                alt="Avatar" 
                className="w-full h-full rounded-full border-2 border-white dark:border-slate-800"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1">Instructor Dashboard</h1>
              <p className="text-slate-300">Manage your courses, track student progress, and grow your revenue.</p>
            </div>
          </div>
          <Link
            to="/dashboard/instructor/course/new"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-1"
          >
            <FiPlus className="w-5 h-5" /> Create Course
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
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
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Students</p>
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
          <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <FiBarChart2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg. Rating</p>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Revenue Overview</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Courses</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBookOpen className="w-10 h-10 text-indigo-300" />
            </div>
            <p className="text-xl text-gray-900 dark:text-white font-medium mb-2">You haven't created any courses yet</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Start sharing your knowledge with the world today.</p>
            <Link to="/dashboard/instructor/course/new" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors">
              <FiPlus /> Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={course._id} 
                className="glass rounded-2xl overflow-hidden flex flex-col group border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail || 'https://placehold.co/600x400/indigo/white?text=Course'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    course.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/80 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/80 dark:text-yellow-300'
                  }`}>
                    {course.status === 'published' ? 'Published' : 'Draft'}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span className="flex items-center gap-1"><FiUsers /> {course.totalStudents || 0}</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{course.price}</span>
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link
                      to={`/dashboard/instructor/course/${course._id}/edit`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <FiEdit2 className="w-4 h-4" /> Edit
                    </Link>
                    <Link
                      to={`/courses/${course._id}`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl font-medium transition-colors border border-indigo-100 dark:border-indigo-800"
                    >
                      <FiEye className="w-4 h-4" /> View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
