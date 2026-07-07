import express from 'express'
import { getUserProfile, updateUserProfile, deleteUser, getUsers, toggleWishlist, getWishlist } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/', protect, authorize('admin'), getUsers)
router.get('/:id', getUserProfile)
router.put('/:id', protect, updateUserProfile)
router.delete('/:id', protect, deleteUser)

router.get('/:id/wishlist', protect, getWishlist)
router.put('/:id/wishlist', protect, toggleWishlist)

export default router
