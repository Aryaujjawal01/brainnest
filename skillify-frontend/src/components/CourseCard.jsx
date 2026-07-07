import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiClock, FiBookOpen, FiHeart } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

export default function CourseCard({ course }) {
  const { user } = useAuth()
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.wishlist?.includes(course._id) || (user?.wishlist && user.wishlist.some(w => w._id === course._id))) {
      setInWishlist(true)
    }
  }, [user, course._id])

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return toast.error('Please login to use wishlist')
    
    setLoading(true)
    try {
      const { data } = await api.put(`/users/${user._id}/wishlist`, { courseId: course._id })
      const isNowInWishlist = data.includes(course._id)
      setInWishlist(isNowInWishlist)
      toast.success(isNowInWishlist ? 'Added to wishlist' : 'Removed from wishlist')
    } catch (err) {
      toast.error('Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Link
        to={`/courses/${course._id}`}
        className="glass rounded-3xl overflow-hidden flex flex-col h-full group hover:shadow-premium dark:hover:shadow-glass-dark transition-all duration-300"
      >
        <div className="relative overflow-hidden aspect-video">
          <img
            src={course.thumbnail || 'https://placehold.co/600x400/indigo/white?text=BrainNest+Pro'}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
            {course.category}
          </div>
          <button 
            onClick={toggleWishlist}
            disabled={loading}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors z-10 disabled:opacity-50"
          >
            <FiHeart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="flex items-center gap-1"><FiBookOpen /> {course.level}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-yellow-500">
              <FiStar className="fill-current" /> {course.rating > 0 ? course.rating.toFixed(1) : 'New'}
            </span>
          </div>

          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <img 
                src={course.instructor?.profilePicture || 'https://placehold.co/100x100/purple/white?text=Instructor'} 
                alt={course.instructor?.name}
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                {course.instructor?.name || 'Instructor'}
              </span>
            </div>
            <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {course.price === 0 ? 'Free' : `₹${course.price}`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
