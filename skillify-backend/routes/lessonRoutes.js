import express from 'express'
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router({ mergeParams: true }) // Merge params to get courseId

router.route('/')
  .get(protect, getLessons)
  .post(protect, authorize('instructor', 'admin'), createLesson)

router.route('/:id')
  .put(protect, authorize('instructor', 'admin'), updateLesson)
  .delete(protect, authorize('instructor', 'admin'), deleteLesson)

export default router
