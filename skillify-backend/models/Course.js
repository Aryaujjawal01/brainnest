import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    price: { type: Number, required: true, default: 0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    curriculum: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    rating: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published', 'pending'], default: 'published' },
    learningOutcomes: [{ type: String }],
    prerequisites: [{ type: String }],
  },
  { timestamps: true }
)

// Text index for search
courseSchema.index({ title: 'text', description: 'text', category: 'text' })

export default mongoose.model('Course', courseSchema)
