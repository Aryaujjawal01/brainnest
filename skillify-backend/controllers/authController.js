import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'instructor' ? 'instructor' : 'student',
    })

    generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    generateToken(res, user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: 'Logged out successfully' })
}

// @desc    Verify email (Mock)
// @route   POST /api/auth/verify
// @access  Private
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.isVerified = true
    await user.save()

    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Get logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
        enrolledCourses: user.enrolledCourses,
        wishlist: user.wishlist
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    next(err)
  }
}

// @desc    Forgot Password (Mock)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    // Mocking email send
    res.status(200).json({ message: 'Password reset link sent to your email (mocked)' })
  } catch (err) {
    next(err)
  }
}
