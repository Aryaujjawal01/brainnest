import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Enrollment from '../models/Enrollment.js'

// @desc    Get all lessons of a course
// @route   GET /api/courses/:courseId/lessons
// @access  Private (enrolled student or owning instructor/admin)
export const getLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const isOwner = course.instructor.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'
    const isEnrolled = await Enrollment.findOne({ student: req.user._id, course: courseId })

    if (!isOwner && !isAdmin && !isEnrolled) {
      return res.status(403).json({ message: 'Enroll in this course to view lessons' })
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 })
    res.json(lessons)
  } catch (err) {
    next(err)
  }
}

// @desc    Add a lesson to a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (owning instructor only)
export const createLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params
    const { title, videoUrl, duration, order, notesUrl, isFreePreview } = req.body

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only add lessons to your own courses' })
    }

    if (!title || !videoUrl) {
      return res.status(400).json({ message: 'Please provide title and videoUrl' })
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      videoUrl,
      duration: duration || 0,
      notesUrl: notesUrl || '',
      isFreePreview: isFreePreview || false,
      order: order ?? course.curriculum.length,
    })

    course.curriculum.push(lesson._id)
    await course.save()

    res.status(201).json(lesson)
  } catch (err) {
    next(err)
  }
}

// @desc    Update a lesson
// @route   PUT /api/courses/:courseId/lessons/:id
// @access  Private (owning instructor only)
export const updateLesson = async (req, res, next) => {
  try {
    const { courseId, id } = req.params
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit lessons in your own courses' })
    }

    const lesson = await Lesson.findById(id)
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' })

    const fields = ['title', 'videoUrl', 'duration', 'order', 'notesUrl', 'isFreePreview']
    fields.forEach((field) => {
      if (req.body[field] !== undefined) lesson[field] = req.body[field]
    })

    const updated = await lesson.save()
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete a lesson
// @route   DELETE /api/courses/:courseId/lessons/:id
// @access  Private (owning instructor only)
export const deleteLesson = async (req, res, next) => {
  try {
    const { courseId, id } = req.params
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete lessons in your own courses' })
    }

    await Lesson.findByIdAndDelete(id)
    course.curriculum = course.curriculum.filter((lecId) => lecId.toString() !== id)
    await course.save()

    res.json({ message: 'Lesson deleted' })
  } catch (err) {
    next(err)
  }
}
