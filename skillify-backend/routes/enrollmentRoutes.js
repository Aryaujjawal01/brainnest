import express from 'express'
import {
  enrollInCourse,
  getMyCourses,
  updateProgress,
  getProgress,
  toggleBookmark,
} from '../controllers/enrollmentController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', protect, enrollInCourse)
router.get('/my-courses', protect, getMyCourses)
router.put('/progress/:courseId', protect, updateProgress)
router.put('/bookmark/:courseId', protect, toggleBookmark)
router.get('/progress/:courseId', protect, getProgress)

export default router
