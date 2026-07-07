import express from 'express'
import {
  addReview,
  getReviews,
  deleteReview,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true }) // Merge params to get courseId

router.route('/')
  .get(getReviews)
  .post(protect, addReview)

// The route below assumes we are mounted at /api/reviews directly or we are calling /api/courses/:courseId/reviews/:id
// If mounted at /api/reviews/:id in server.js, we should handle that in a separate router or adjust.
// For now we'll put it here and adjust server.js later if needed.
router.route('/:id')
  .delete(protect, deleteReview)

export default router
