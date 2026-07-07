import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'

import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { apiLimiter } from './middleware/rateLimiter.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import quizRoutes from './routes/quizRoutes.js'

dotenv.config()
connectDB()

const app = express()

// --- Core middleware ---
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize()) // strips $ and . from req.body/query/params to prevent NoSQL injection

// Request logging — 'dev' format in development, 'combined' in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// General rate limit on all /api routes (auth routes have their own stricter limit)
app.use('/api', apiLimiter)

app.use('/uploads', express.static('uploads'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// --- Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/quizzes', quizRoutes)

// --- Error handling (must be last) ---
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`BrainNest API running on port ${PORT}`))
