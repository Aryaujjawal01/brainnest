import Review from '../models/Review.js'
import Course from '../models/Course.js'
import Enrollment from '../models/Enrollment.js'

// @desc    Add a review to a course
// @route   POST /api/courses/:courseId/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const { courseId } = req.params

    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const isEnrolled = await Enrollment.findOne({ student: req.user._id, course: courseId })
    if (!isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled to leave a review' })
    }

    const alreadyReviewed = await Review.findOne({ user: req.user._id, course: courseId })
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this course' })
    }

    const review = await Review.create({
      user: req.user._id,
      course: courseId,
      rating: Number(rating),
      comment,
    })

    // Update course rating
    const reviews = await Review.find({ course: courseId })
    course.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    await course.save()

    res.status(201).json(review)
  } catch (err) {
    next(err)
  }
}

// @desc    Get all reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId }).populate('user', 'name profilePicture')
    res.json(reviews)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    await review.deleteOne()

    // Update course rating
    const course = await Course.findById(review.course)
    if (course) {
      const reviews = await Review.find({ course: course._id })
      if (reviews.length === 0) {
        course.rating = 0
      } else {
        course.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      }
      await course.save()
    }

    res.json({ message: 'Review deleted' })
  } catch (err) {
    next(err)
  }
}
