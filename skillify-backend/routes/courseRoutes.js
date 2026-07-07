import express from 'express'
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getRecommendations
} from '../controllers/courseController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import lessonRoutes from './lessonRoutes.js'
import reviewRoutes from './reviewRoutes.js'

const router = express.Router()

// Nested routes
router.use('/:courseId/lessons', lessonRoutes)
router.use('/:courseId/reviews', reviewRoutes)

router.get('/recommendations', protect, getRecommendations)

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse)

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse)

export default router
