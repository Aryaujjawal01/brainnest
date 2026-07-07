import Note from '../models/Note.js'

// @desc    Get notes for a lesson
// @route   GET /api/notes/:courseId/:lessonId
// @access  Private
export const getNotes = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params
    const note = await Note.findOne({ userId: req.user._id, courseId, lessonId })
    res.json(note || { content: '' })
  } catch (err) {
    next(err)
  }
}

// @desc    Save note for a lesson
// @route   POST /api/notes
// @access  Private
export const saveNote = async (req, res, next) => {
  try {
    const { courseId, lessonId, content } = req.body
    let note = await Note.findOne({ userId: req.user._id, courseId, lessonId })
    
    if (note) {
      note.content = content
      await note.save()
    } else {
      note = await Note.create({ userId: req.user._id, courseId, lessonId, content })
    }
    
    res.json(note)
  } catch (err) {
    next(err)
  }
}
