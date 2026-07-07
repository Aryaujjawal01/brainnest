import express from 'express'
import { getNotifications, markAsRead, createNotification } from '../controllers/notificationController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getNotifications)
router.post('/', protect, createNotification)
router.put('/:id/read', protect, markAsRead)

export default router
