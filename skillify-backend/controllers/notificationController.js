import Notification from '../models/Notification.js'

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20)
    res.json(notifications)
  } catch (err) {
    next(err)
  }
}

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ message: 'Notification not found' })
    res.json(notification)
  } catch (err) {
    next(err)
  }
}

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res, next) => {
  try {
    const { message, type } = req.body
    const notification = await Notification.create({
      userId: req.user._id,
      message,
      type
    })
    res.status(201).json(notification)
  } catch (err) {
    next(err)
  }
}
