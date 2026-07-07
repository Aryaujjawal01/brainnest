import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifies JWT from Authorization header, attaches req.user
export const protect = async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' })
    }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' })
  }
}
