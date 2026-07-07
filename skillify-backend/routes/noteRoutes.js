import express from 'express'
import { getNotes, saveNote } from '../controllers/noteController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:courseId/:lessonId', protect, getNotes)
router.post('/', protect, saveNote)

export default router
