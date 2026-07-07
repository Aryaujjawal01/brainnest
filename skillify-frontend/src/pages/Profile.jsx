import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { FiUser, FiMail, FiEdit3, FiAward, FiClock, FiBookOpen } from 'react-icons/fi'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    bio: user?.bio || '', 
    profilePicture: user?.profilePicture || '' 
  })
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ courses: 0, hours: 0, completed: 0 })

  useEffect(() => {
    // Fetch mock stats or actual stats
    api.get('/enrollments/my-courses').then(res => {
      const enrollments = res.data
      setStats({
        courses: enrollments.length,
        completed: enrollments.filter(e => e.progress === 100).length,
        hours: Math.round(enrollments.length * 12.5) // mock calculation
      })
    }).catch(console.error)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAvatarChange = () => {
    const randomSeed = Math.random().toString(36).substring(7)
    setForm(prev => ({ ...prev, profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}` }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put(`/users/${user._id}`, form)
      // Force auth context update
      const updatedUser = { ...user, ...data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('storage')) // Trigger cross-tab sync if implemented
      toast.success('Profile updated!')
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="glass rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 border-4 border-white dark:border-dark-card shadow-md flex items-center justify-center">
              {form.profilePicture ? (
                <img src={form.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-16 h-16 text-indigo-400" />
              )}
            </div>
            <button 
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors opacity-0 group-hover:opacity-100"
              title="Generate new avatar"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h1>
            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mb-4">
              <FiMail /> {user?.email}
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wide">
                {user?.role}
              </span>
            </p>
            {user?.role === 'student' && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <FiBookOpen className="text-blue-500" />
                  <span className="font-bold dark:text-white">{stats.courses}</span>
                  <span className="text-sm text-gray-500">Enrolled</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <FiCheck className="text-green-500" />
                  <span className="font-bold dark:text-white">{stats.completed}</span>
                  <span className="text-sm text-gray-500">Completed</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <FiClock className="text-orange-500" />
                  <span className="font-bold dark:text-white">{stats.hours}h</span>
                  <span className="text-sm text-gray-500">Learned</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Form */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-gray-700/50 pb-4">Profile Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                value={user?.email || ''} disabled
                className="w-full border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio / About Me</label>
              <textarea
                name="bio" rows={4} value={form.bio} onChange={handleChange}
                placeholder="Write something about yourself..."
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-y"
              />
            </div>
            <button
              type="submit" disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
