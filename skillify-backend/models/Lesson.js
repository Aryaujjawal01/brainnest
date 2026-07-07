import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, default: 0 },
    notesUrl: { type: String, default: '' },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Lesson', lessonSchema)
