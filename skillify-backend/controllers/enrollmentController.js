import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'

// @desc    Enroll student in a course
// @route   POST /api/enrollments
// @access  Private (student)
export const enrollInCourse = async (req, res, next) => {
  try {
    const { course: courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId })
    if (existing) return res.status(400).json({ message: 'Already enrolled in this course' })

    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId, progress: 0, completedLessons: [] })

    course.totalStudents += 1
    await course.save()

    res.status(201).json(enrollment)
  } catch (err) {
    next(err)
  }
}

// @desc    Get logged-in student's enrolled courses (with progress)
// @route   GET /api/enrollments/my-courses
// @access  Private (student)
export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name' } })
      .sort({ createdAt: -1 })

    res.json(enrollments)
  } catch (err) {
    next(err)
  }
}

// @desc    Update course progress (complete lesson)
// @route   PUT /api/enrollments/progress/:courseId
// @access  Private (student only)
export const updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.body
    if (!lessonId) return res.status(400).json({ message: 'Lesson ID required' })

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId })
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' })

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId)
    }

    const course = await Course.findById(req.params.courseId)
    const totalLessons = course.curriculum.length || 1
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100)

    await enrollment.save()
    res.json(enrollment)
  } catch (err) {
    next(err)
  }
}

// @desc    Toggle bookmark for a lesson
// @route   PUT /api/enrollments/bookmark/:courseId
// @access  Private (student only)
export const toggleBookmark = async (req, res, next) => {
  try {
    const { lessonId } = req.body
    if (!lessonId) return res.status(400).json({ message: 'Lesson ID required' })

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId })
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' })

    const index = enrollment.bookmarkedLessons.indexOf(lessonId)
    if (index > -1) {
      enrollment.bookmarkedLessons.splice(index, 1)
    } else {
      enrollment.bookmarkedLessons.push(lessonId)
    }

    await enrollment.save()
    res.json(enrollment.bookmarkedLessons)
  } catch (err) {
    next(err)
  }
}

// @desc    Get progress for a specific course
// @route   GET /api/enrollments/progress/:courseId
// @access  Private (enrolled student)
export const getProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId })
    if (!enrollment) return res.status(404).json({ message: 'No enrollment record found' })
    res.json({ progress: enrollment.progress, completedLessons: enrollment.completedLessons })
  } catch (err) {
    next(err)
  }
}
