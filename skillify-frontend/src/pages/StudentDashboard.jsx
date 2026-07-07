import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { FiPlay, FiBook, FiAward, FiClock, FiChevronRight, FiChevronLeft, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import CourseCard from '../components/CourseCard'
import StudentDashboardLayout from '../components/dashboard/StudentDashboardLayout'

const PROGRESS_DATA = [
  { name: 'Completed', value: 24, color: '#10b981' }, // Emerald
  { name: 'In Progress', value: 18, color: '#8b5cf6' }, // Purple
  { name: 'Not Started', value: 11, color: '#f59e0b' }, // Amber
]

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All Courses')
  const { user } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollRes, recRes] = await Promise.all([
          api.get('/enrollments/my-courses'),
          api.get('/courses', { params: { limit: 3, sort: 'popular' } })
        ])
        setEnrollments(enrollRes.data)
        setRecommendations(recRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const completedCourses = enrollments.filter(e => e.progress === 100).length
  const ongoingCourses = enrollments.length - completedCourses

  return (
    <StudentDashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT CONTENT AREA (Takes 2 columns on XL screens) */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-gray-400">Continue your learning journey and achieve your goals.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-gray-800/80 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  <FiBook className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-white">{enrollments.length || 8}</p>
                  <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">↗ 2 this month</p>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-gray-800/80 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <FiPlay className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">Completed Lessons</p>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">↗ 8 this month</p>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-gray-800/80 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <FiClock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">Learning Hours</p>
                  <p className="text-2xl font-bold text-white">36.5</p>
                  <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">↗ 5.5 this week</p>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-gray-800/80 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-4">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">Certificates Earned</p>
                  <p className="text-2xl font-bold text-white">{completedCourses || 3}</p>
                  <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">↗ 1 this month</p>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                <Link to="/dashboard/student/courses" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                  View All <FiChevronRight />
                </Link>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/3 aspect-[16/9] rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center border border-gray-700/50 shadow-inner p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">MERN<br/><span className="text-sm font-semibold text-gray-300">STACK</span></h3>
                    <div className="flex justify-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center"><span className="text-[10px]">M</span></div>
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"><span className="text-[10px]">E</span></div>
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-[10px] text-blue-400">R</span></div>
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><span className="text-[10px] text-green-400">N</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold text-white mb-2">MERN Stack Masterclass</h3>
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Next Lesson</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300 font-medium">10. Express.js - Middleware</p>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      Continue Learning <FiChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Recommended for you</h2>
                <Link to="/courses" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                  View All <FiChevronRight />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.slice(0,3).map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
                {/* Fallbacks if DB is empty to match screenshot perfectly */}
                {recommendations.length === 0 && (
                  <>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group">
                      <div className="aspect-video bg-gradient-to-br from-blue-900 to-indigo-900 relative p-4 flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" className="w-16 h-16 relative z-10" />
                        <span className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white">12.5 hours</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm text-white mb-1 group-hover:text-primary-400 transition-colors">Python for Data Science</h3>
                        <p className="text-xs text-gray-500 mb-3">Dr. James Smith</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-yellow-500 font-bold">★ 4.8 <span className="text-gray-500 font-normal">(2.4K)</span></span>
                          <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded">Beginner</span>
                          <span className="font-bold text-white">Free</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group">
                      <div className="aspect-video bg-gradient-to-br from-cyan-900 to-blue-900 relative p-4 flex flex-col items-center justify-center">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="w-16 h-16 relative z-10" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm text-white mb-1 group-hover:text-primary-400 transition-colors">React.js Complete Guide</h3>
                        <p className="text-xs text-gray-500 mb-3">Jessica Lee</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-yellow-500 font-bold">★ 4.7 <span className="text-gray-500 font-normal">(3.1K)</span></span>
                          <span className="text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">Intermediate</span>
                          <span className="font-bold text-white">₹499</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group">
                      <div className="aspect-video bg-gradient-to-br from-purple-900 to-fuchsia-900 relative p-4 flex flex-col items-center justify-center">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h1 className="text-4xl font-black text-white relative z-10">AI</h1>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm text-white mb-1 group-hover:text-primary-400 transition-colors">Artificial Intelligence Basics</h3>
                        <p className="text-xs text-gray-500 mb-3">Prof. Michael Brown</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-yellow-500 font-bold">★ 4.9 <span className="text-gray-500 font-normal">(1.8K)</span></span>
                          <span className="text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">Beginner</span>
                          <span className="font-bold text-white">₹599</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* My Courses Tabs */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">My Courses</h2>
                <Link to="/dashboard/student/courses" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                  View All <FiChevronRight />
                </Link>
              </div>
              
              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                {['All Courses', 'In Progress', 'Completed', 'Not Started'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      activeTab === tab ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Sample Course Row */}
              <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer group">
                <div className="w-16 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Java</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">Java Programming - Basics to Advanced</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-700 h-1.5 rounded-full">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">40%</span>
                  </div>
                </div>
                <button className="bg-gray-800 border border-gray-700 group-hover:border-primary-500/50 text-gray-300 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                  Continue
                </button>
              </div>
            </div>

          </div>


          {/* RIGHT SIDEBAR (Takes 1 column on XL screens) */}
          <div className="space-y-8">
            
            {/* Calendar */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2"><FiClock className="text-gray-400"/> Calendar</h3>
                <button className="text-xs text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded border border-gray-700 transition-colors">View Full Calendar</button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <button className="text-gray-400 hover:text-white"><FiChevronLeft /></button>
                <span className="text-sm font-bold text-white">May 2025</span>
                <button className="text-gray-400 hover:text-white"><FiChevronRight /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-gray-500">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                <span className="py-1.5 text-gray-600">27</span>
                <span className="py-1.5 text-gray-600">28</span>
                <span className="py-1.5 text-gray-600">29</span>
                <span className="py-1.5 text-gray-600">30</span>
                <span className="py-1.5 text-gray-400">1</span>
                <span className="py-1.5 text-gray-400">2</span>
                <span className="py-1.5 text-gray-400">3</span>
                
                <span className="py-1.5 text-gray-400">4</span>
                <span className="py-1.5 text-gray-400 relative">5<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></span></span>
                <span className="py-1.5 text-gray-400">6</span>
                <span className="py-1.5 text-gray-400 relative">7<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></span>
                <span className="py-1.5 text-gray-400">8</span>
                <span className="py-1.5 text-gray-400">9</span>
                <span className="py-1.5 text-gray-400">10</span>
                
                <span className="py-1.5 text-gray-400">11</span>
                <span className="py-1.5 text-gray-400">12</span>
                <span className="py-1.5 text-gray-400">13</span>
                <span className="py-1.5 text-gray-400">14</span>
                <span className="py-1.5 text-gray-400">15</span>
                <span className="py-1.5 text-gray-400">16</span>
                <span className="py-1.5 text-gray-400">17</span>

                <span className="py-1.5 text-gray-400">18</span>
                <span className="py-1.5 text-gray-400">19</span>
                <span className="py-1.5 text-gray-400">20</span>
                <span className="py-1.5 bg-primary-600 text-white rounded-full font-bold shadow-lg shadow-primary-500/30">21</span>
                <span className="py-1.5 text-gray-400">22</span>
                <span className="py-1.5 text-gray-400">23</span>
                <span className="py-1.5 text-gray-400">24</span>

                <span className="py-1.5 text-gray-400">25</span>
                <span className="py-1.5 text-gray-400">26</span>
                <span className="py-1.5 text-gray-400">27</span>
                <span className="py-1.5 text-gray-400 relative">28<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></span></span>
                <span className="py-1.5 text-gray-400">29</span>
                <span className="py-1.5 text-gray-400 relative">30<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></span></span>
                <span className="py-1.5 text-gray-400 relative">31<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></span>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Your Progress</h3>
                <select className="bg-gray-800 border border-gray-700 text-gray-400 text-xs py-1 px-2 rounded outline-none cursor-pointer">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <div className="flex flex-col xl:flex-row items-center gap-6">
                <div className="w-32 h-32 relative flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PROGRESS_DATA}
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {PROGRESS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-white">75%</span>
                    <span className="text-[8px] text-gray-400 uppercase tracking-wider text-center px-2">Overall Progress</span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-3">
                  {PROGRESS_DATA.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.value} <span className="text-gray-500">({Math.round((item.value/53)*100)}%)</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Recent Activity</h3>
                <button className="text-xs text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded border border-gray-700 transition-colors">View All</button>
              </div>
              <div className="space-y-6">
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiCheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Completed Lesson</p>
                    <p className="text-sm font-bold text-gray-200 mb-1">React Hooks - useState</p>
                    <p className="text-[10px] text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiEdit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Quiz Attempted</p>
                    <p className="text-sm font-bold text-gray-200 mb-1">JavaScript Basics Quiz</p>
                    <p className="text-[10px] text-gray-500">5 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiAward className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Certificate Earned</p>
                    <p className="text-sm font-bold text-gray-200 mb-1">Python for Data Science</p>
                    <p className="text-[10px] text-gray-500">1 day ago</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}
