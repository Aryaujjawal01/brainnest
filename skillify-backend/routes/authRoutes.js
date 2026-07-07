import express from 'express'
import { registerUser, loginUser, logoutUser, getMe, forgotPassword, verifyEmail } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { registerValidation, loginValidation } from '../middleware/validators.js'

const router = express.Router()

router.post('/register', authLimiter, registerValidation, registerUser)
router.post('/login', authLimiter, loginValidation, loginUser)
router.post('/logout', logoutUser)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/verify', protect, verifyEmail)
router.get('/me', protect, getMe)

export default router
