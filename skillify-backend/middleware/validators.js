import { body, validationResult } from 'express-validator'

// Runs after the express-validator chain, converts errors to a clean 400 response
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'instructor']).withMessage('Role must be student or instructor'),
  handleValidation,
]

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
]

export const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
  handleValidation,
]

export const lectureValidation = [
  body('title').trim().notEmpty().withMessage('Lecture title is required'),
  body('videoUrl').trim().notEmpty().withMessage('Video URL is required'),
  body('duration').optional().isFloat({ min: 0 }).withMessage('Duration must be a positive number'),
  handleValidation,
]
