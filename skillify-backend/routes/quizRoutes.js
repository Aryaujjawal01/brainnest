import express from 'express'
import { getQuiz, submitQuiz, createQuiz } from '../controllers/quizController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/:courseId', protect, getQuiz)
router.post('/:courseId/submit', protect, submitQuiz)
router.post('/:courseId', protect, authorize('instructor', 'admin'), createQuiz)

export default router
