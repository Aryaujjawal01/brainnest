import Quiz from '../models/Quiz.js'
import Course from '../models/Course.js'

// @desc    Get quiz for a course
// @route   GET /api/quizzes/:courseId
// @access  Private
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId })
    if (!quiz) return res.status(404).json({ message: 'Quiz not found for this course' })
    res.json(quiz)
  } catch (err) {
    next(err)
  }
}

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:courseId/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body // Array of selected option indexes
    const quiz = await Quiz.findOne({ courseId: req.params.courseId })
    
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' })

    let score = 0
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctOptionIndex) {
        score += 1
      }
    })

    const passed = score >= (quiz.questions.length / 2) // Passing is 50%
    
    res.json({
      score,
      total: quiz.questions.length,
      passed,
      percentage: Math.round((score / quiz.questions.length) * 100)
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Create quiz (Admin/Instructor)
// @route   POST /api/quizzes/:courseId
// @access  Private/Instructor
export const createQuiz = async (req, res, next) => {
  try {
    const { title, description, questions } = req.body
    
    let quiz = await Quiz.findOne({ courseId: req.params.courseId })
    if (quiz) {
      quiz.title = title
      quiz.description = description
      quiz.questions = questions
      await quiz.save()
    } else {
      quiz = await Quiz.create({
        courseId: req.params.courseId,
        title,
        description,
        questions
      })
    }
    
    res.status(201).json(quiz)
  } catch (err) {
    next(err)
  }
}
