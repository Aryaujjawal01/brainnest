import { useState, useEffect } from 'react'
import api from '../services/api'
import CourseCard from '../components/CourseCard'
import { FiSearch, FiFilter, FiLoader } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const categories = [
  'All Categories', 'Web Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Cloud Computing', 'Cyber Security'
]

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const prices = ['All Prices', 'Free', 'Paid']

export default function CourseListing() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [activeFilter, setActiveFilter] = useState('All Categories')
  const [levelFilter, setLevelFilter] = useState('All Levels')
  const [priceFilter, setPriceFilter] = useState('All Prices')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchCourses = async (pageNum = 1, append = false) => {
    if (!append) setLoading(true)
    else setLoadingMore(true)

    try {
      const queryCategory = activeFilter === 'All Categories' ? '' : activeFilter
      const queryLevel = levelFilter === 'All Levels' ? '' : levelFilter
      const queryPrice = priceFilter === 'All Prices' ? '' : priceFilter
      
      const { data } = await api.get('/courses', { 
        params: { 
          search, 
          category: queryCategory, 
          level: queryLevel,
          priceType: queryPrice,
          page: pageNum, 
          limit: 8, 
          sort: 'recent' 
        } 
      })
      
      if (append) {
        setCourses(prev => [...prev, ...data.courses])
      } else {
        setCourses(data.courses)
      }
      
      setHasMore(pageNum < data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(1, false)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search, activeFilter, levelFilter, priceFilter])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchCourses(nextPage, true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Skill</h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Browse through our extensive library of premium courses crafted by industry experts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Section */}
        <div className="glass rounded-2xl p-4 md:p-6 shadow-sm mb-10 mt-[-5rem] relative z-20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 md:py-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors shadow-sm"
              />
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <FiFilter /> Filter by Category
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
                <select 
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {prices.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm">
                <Skeleton height={160} className="rounded-xl mb-4" />
                <Skeleton count={2} className="mb-2" />
                <Skeleton width={100} />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-xl text-gray-500 dark:text-gray-400">No courses found matching your criteria.</p>
            <button 
              onClick={() => { setSearch(''); setActiveFilter('All Categories'); setLevelFilter('All Levels'); setPriceFilter('All Prices'); }}
              className="mt-4 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </motion.div>
            
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-full text-indigo-600 dark:text-indigo-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <><FiLoader className="animate-spin" /> Loading...</>
                  ) : (
                    'Load More Courses'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
