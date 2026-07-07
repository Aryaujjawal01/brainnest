import User from '../models/User.js'

// @desc    Get user profile by id
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// @desc    Update own profile
// @route   PUT /api/users/:id
// @access  Private (self only)
export const updateUserProfile = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own profile' })
    }

    const { name, bio, profilePicture } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name !== undefined) user.name = name
    if (bio !== undefined) user.bio = bio
    if (profilePicture !== undefined) user.profilePicture = profilePicture

    const updated = await user.save()
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// @desc    Delete own account
// @route   DELETE /api/users/:id
// @access  Private (self only or admin)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own account' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Account deleted' })
  } catch (err) {
    next(err)
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// @desc    Toggle wishlist item
// @route   PUT /api/users/:id/wishlist
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    const { courseId } = req.body
    if (!courseId) return res.status(400).json({ message: 'Course ID required' })
    
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    const index = user.wishlist.indexOf(courseId)
    if (index > -1) {
      user.wishlist.splice(index, 1) // Remove
    } else {
      user.wishlist.push(courseId) // Add
    }
    
    await user.save()
    res.json(user.wishlist)
  } catch (err) {
    next(err)
  }
}

// @desc    Get user's wishlist
// @route   GET /api/users/:id/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    const user = await User.findById(req.params.id).populate('wishlist')
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json(user.wishlist)
  } catch (err) {
    next(err)
  }
}
