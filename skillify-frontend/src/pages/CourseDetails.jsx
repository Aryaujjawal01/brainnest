import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { FiClock, FiBookOpen, FiStar, FiCheck, FiPlayCircle, FiShield, FiMonitor, FiX, FiCreditCard } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'

const MockPaymentModal = ({ course, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      onSuccess()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <FiX className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-2 dark:text-white flex items-center gap-2">
          <FiCreditCard className="text-indigo-600" /> Secure Checkout
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">You are enrolling in <strong>{course.title}</strong></p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number (Mock)</label>
            <input type="text" placeholder="**** **** **** 4242" disabled className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry</label>
              <input type="text" placeholder="12/28" disabled className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
              <input type="text" placeholder="***" disabled className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
          <div className="flex justify-between text-lg font-bold dark:text-white">
            <span>Total:</span>
            <span>₹{course.price}</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing Payment...' : `Pay ₹${course.price}`}
        </button>
      </motion.div>
    </div>
  )
}

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        const [courseRes, reviewsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/reviews`)
        ])
        setCourse(courseRes.data)
        setReviews(reviewsRes.data)

        // Add to recently viewed in localStorage
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        const filteredRecent = recent.filter(c => c._id !== courseRes.data._id)
        const newRecent = [courseRes.data, ...filteredRecent].slice(0, 4) // keep last 4
        localStorage.setItem('recentlyViewed', JSON.stringify(newRecent))

      } catch (err) {
        console.error(err)
        toast.error('Course not found')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourseAndReviews()
  }, [id, navigate])

  const handleEnrollClick = () => {
    if (!user) {
      toast.error('Please login to enroll')
      return navigate('/login')
    }
    if (course.price === 0) {
      processEnrollment() // Free courses skip payment
    } else {
      setShowPayment(true)
    }
  }

  const processEnrollment = async () => {
    try {
      await api.post('/enrollments', { courseId: id })
      toast.success('Enrolled successfully!')
      setShowPayment(false)
      navigate(`/learn/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed')
      setShowPayment(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-dark-bg">
      <Skeleton height={400} className="rounded-2xl mb-8" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <Skeleton height={200} className="rounded-2xl" />
          <Skeleton height={300} className="rounded-2xl" />
        </div>
        <Skeleton height={400} className="rounded-2xl" />
      </div>
    </div>
  )
  if (!course) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 pb-20">
      <AnimatePresence>
        {showPayment && (
          <MockPaymentModal 
            course={course} 
            onClose={() => setShowPayment(false)} 
            onSuccess={processEnrollment} 
          />
        )}
      </AnimatePresence>

      {/* Premium Hero Banner */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={course.thumbnail || 'https://placehold.co/1200x600/indigo/white?text=Course+Thumbnail'} 
            alt="Course Background" 
            className="w-full h-full object-cover opacity-20 filter blur-sm" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-sm font-semibold tracking-wide">
                  {course.category}
                </span>
                <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-1 rounded-full">
                  <FiStar className="fill-current" /> {course.rating > 0 ? course.rating.toFixed(1) : 'New'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">{course.title}</h1>
              <p className="text-lg text-slate-300 mb-8 max-w-3xl leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <img src={course.instructor?.profilePicture || 'https://placehold.co/100x100/purple/white?text=Instructor'} alt="Instructor" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
                  <div>
                    <p className="text-white font-medium">Created by {course.instructor?.name || 'Instructor'}</p>
                    <p className="text-xs">Expert Instructor</p>
                  </div>
                </div>
                <div className="flex items-center gap-2"><FiClock className="w-5 h-5 text-indigo-400" /> 12 Hours</div>
                <div className="flex items-center gap-2"><FiBookOpen className="w-5 h-5 text-indigo-400" /> {course.level || 'Beginner'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FiCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">Master the core concepts and advanced techniques needed for real-world projects.</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Curriculum</h2>
              {course.curriculum && course.curriculum.length > 0 ? (
                <div className="space-y-4">
                  {course.curriculum.map((lesson, idx) => (
                    <div key={lesson._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <FiPlayCircle /> Video Lesson
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Curriculum is being updated.</p>
              )}
            </div>

            {/* Student Reviews Section */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Reviews</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <FiStar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review._id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                          {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name || 'Anonymous'}</p>
                          <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-800 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md">
              <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group">
                <img src={course.thumbnail || 'https://placehold.co/600x400/indigo/white?text=Preview'} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors cursor-pointer">
                  <FiPlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </div>

              <button
                onClick={handleEnrollClick}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transform transition hover:-translate-y-1 mb-4"
              >
                Enroll Now
              </button>
              
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-6">30-Day Money-Back Guarantee</p>

              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <h4 className="font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">This course includes:</h4>
                <div className="flex items-center gap-3"><FiMonitor className="text-indigo-500" /> Full lifetime access</div>
                <div className="flex items-center gap-3"><FiBookOpen className="text-indigo-500" /> Access on mobile and TV</div>
                <div className="flex items-center gap-3"><FiShield className="text-indigo-500" /> Certificate of completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
