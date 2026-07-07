import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import CourseCard from '../components/CourseCard'
import { FiHeart, FiLoader } from 'react-icons/fi'

export default function Wishlist() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get(`/users/${user._id}/wishlist`)
        setCourses(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchWishlist()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-4 text-center">
        <FiHeart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h2>
        <p className="text-gray-500 mb-6">Please log in to view your wishlist.</p>
        <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Login Now</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 pb-20">
      <div className="bg-indigo-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FiHeart className="text-red-400" /> My Wishlist
          </h1>
          <p className="text-indigo-200 mt-2">Courses you've saved for later.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading wishlist...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-10 h-10 text-red-300" />
            </div>
            <p className="text-xl text-gray-900 dark:text-white font-medium mb-2">Your wishlist is empty</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Explore our library and find something you'd like to learn.</p>
            <Link to="/courses" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
