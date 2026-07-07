import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'

// @desc    Get all courses (with search & filter)
// @route   GET /api/courses?search=&category=&level=&instructor=
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { search, category, instructor, sort, page = 1, limit = 10, level, priceType } = req.query
    
    let query = {}
    
    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }
    
    if (category) query.category = category
    if (instructor) query.instructor = instructor
    if (level) query.level = level
    
    if (priceType === 'Free') {
      query.price = 0
    } else if (priceType === 'Paid') {
      query.price = { $gt: 0 }
    }

    // Default status for students is published
    if (!instructor) {
      query.status = 'published'
    }

    let sortObj = { createdAt: -1 } // default sort: recent
    if (sort === 'popular') sortObj = { totalStudents: -1 }
    else if (sort === 'rating') sortObj = { rating: -1 }

    const skip = (Number(page) - 1) * Number(limit)

    const courses = await Course.find(query)
      .populate('instructor', 'name profilePicture')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      
    const total = await Course.countDocuments(query)

    res.json({ 
      courses, 
      count: courses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get single course details (with lessons populated)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name profilePicture bio')
      .populate({ path: 'curriculum', options: { sort: { order: 1 } } })

    if (!course) return res.status(404).json({ message: 'Course not found' })

    res.json(course)
  } catch (err) {
    next(err)
  }
}

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (instructor only)
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail, category, level, price, learningOutcomes, prerequisites } = req.body

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      level,
      price,
      learningOutcomes: learningOutcomes || [],
      prerequisites: prerequisites || [],
      instructor: req.user._id,
    })

    res.status(201).json(course)
  } catch (err) {
    next(err)
  }
}

// @desc    Update a course (only by its owning instructor)
// @route   PUT /api/courses/:id
// @access  Private (instructor only, owner)
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own courses' })
    }

    const fields = ['title', 'description', 'thumbnail', 'category', 'level', 'price', 'status', 'learningOutcomes', 'prerequisites']
    fields.forEach((field) => {
      if (req.body[field] !== undefined) course[field] = req.body[field]
    })

    const updated = await course.save()
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete a course (only by its owning instructor)
// @route   DELETE /api/courses/:id
// @access  Private (instructor only, owner)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own courses' })
    }

    await Lesson.deleteMany({ course: course._id })
    await course.deleteOne()

    res.json({ message: 'Course deleted' })
  } catch (err) {
    next(err)
  }
}

// @desc    Get AI recommendations (Mock)
// @route   GET /api/courses/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  try {
    // Mock logic: Just return top rated courses as a placeholder for AI
    const courses = await Course.find({ status: 'published' })
      .sort({ rating: -1 })
      .limit(3)
      .populate('instructor', 'name')
      
    res.json(courses)
  } catch (err) {
    next(err)
  }
}
