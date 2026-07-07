import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { FiArrowLeft, FiUploadCloud } from 'react-icons/fi'

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: '', subtitle: '', description: '', shortDescription: '', category: '', level: 'Beginner', price: '', discountPrice: '', thumbnail: ''
  })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.post('/courses', form)
      toast.success('Course created!')
      navigate(`/dashboard/instructor/course/${data._id}/edit`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Course</h1>
            <p className="text-gray-500 dark:text-gray-400">Create a new course and publish it for students.</p>
          </div>
          <Link 
            to="/dashboard/instructor" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FiArrowLeft /> Back to Courses
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
              <input name="title" required value={form.title} onChange={handleChange} placeholder="Enter course title"
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Enter a short subtitle for the course"
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select name="category" required value={form.category} onChange={handleChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
                <option value="" disabled>Select category</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
              <select name="level" required value={form.level} onChange={handleChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
              <input type="number" name="price" required value={form.price} onChange={handleChange} placeholder="Enter course price"
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
              <span className="absolute right-4 top-[38px] text-gray-400">$</span>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount Price (Optional)</label>
              <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} placeholder="Enter discount price"
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
              <span className="absolute right-4 top-[38px] text-gray-400">$</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Thumbnail</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl p-8 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <FiUploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upload thumbnail</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG or WEBP (max. 2MB)</p>
                <input type="text" name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="Or enter URL here..."
                  className="mt-4 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
              <textarea name="shortDescription" rows={5} value={form.shortDescription} onChange={handleChange} placeholder="Enter short description about the course"
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none" />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{form.shortDescription?.length || 0}/200 characters</p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Description</label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex gap-2">
                <button type="button" className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Normal</button>
                <button type="button" className="p-2 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">B</button>
                <button type="button" className="p-2 italic text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">I</button>
                <button type="button" className="p-2 underline text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">U</button>
              </div>
              <textarea name="description" rows={8} required value={form.description} onChange={handleChange} placeholder="Write a detailed description about the course..."
                className="w-full bg-transparent text-gray-900 dark:text-gray-200 px-4 py-3 focus:outline-none resize-none" />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-md">
              {saving ? 'Creating...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
