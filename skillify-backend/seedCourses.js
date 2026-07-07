import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Course from './models/Course.js'
import Lesson from './models/Lesson.js'
import Category from './models/Category.js'
import bcrypt from 'bcryptjs'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brainnest')
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await connectDB()

    // Clear existing
    await Course.deleteMany()
    await Lesson.deleteMany()
    await Category.deleteMany()
    
    // Check if we have an instructor, if not create one
    let instructor = await User.findOne({ role: 'instructor' })
    if (!instructor) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash('123456', salt)
      instructor = await User.create({
        name: 'John Expert',
        email: 'john@expert.com',
        password: hashedPassword,
        role: 'instructor'
      })
    }

    const categories = [
      { name: 'Web Development', description: 'Learn to build websites' },
      { name: 'Data Science', description: 'Analyze data' },
      { name: 'UI/UX Design', description: 'Design interfaces' },
      { name: 'Cloud Computing', description: 'AWS, Azure, GCP' },
      { name: 'Cyber Security', description: 'Protect systems' }
    ]

    await Category.insertMany(categories)

    const courseData = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node, and MongoDB.',
        thumbnail: 'https://placehold.co/600x400/1e1b4b/ffffff?text=Web+Bootcamp',
        category: 'Web Development',
        level: 'Beginner',
        price: 4999,
        status: 'published',
        rating: 4.8,
        totalStudents: 1205
      },
      {
        title: 'Advanced React Patterns',
        description: 'Master React hooks, context, and performance optimization.',
        thumbnail: 'https://placehold.co/600x400/312e81/ffffff?text=React',
        category: 'Web Development',
        level: 'Advanced',
        price: 2999,
        status: 'published',
        rating: 4.9,
        totalStudents: 850
      },
      {
        title: 'Python for Data Science',
        description: 'Learn Pandas, NumPy, Matplotlib, and Scikit-Learn.',
        thumbnail: 'https://placehold.co/600x400/0f172a/ffffff?text=Data+Science',
        category: 'Data Science',
        level: 'Intermediate',
        price: 3499,
        status: 'published',
        rating: 4.7,
        totalStudents: 2200
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Figma, wireframing, prototyping, and user research.',
        thumbnail: 'https://placehold.co/600x400/831843/ffffff?text=UI/UX',
        category: 'UI/UX Design',
        level: 'Beginner',
        price: 3999,
        status: 'published',
        rating: 4.6,
        totalStudents: 1540
      },
      {
        title: 'AWS Certified Solutions Architect',
        description: 'Pass the AWS SAA-C03 exam with confidence.',
        thumbnail: 'https://placehold.co/600x400/14532d/ffffff?text=AWS',
        category: 'Cloud Computing',
        level: 'Intermediate',
        price: 5499,
        status: 'published',
        rating: 4.8,
        totalStudents: 3100
      },
      {
        title: 'Ethical Hacking Basics',
        description: 'Learn the fundamentals of cyber security.',
        thumbnail: 'https://placehold.co/600x400/7f1d1d/ffffff?text=Hacking',
        category: 'Cyber Security',
        level: 'Beginner',
        price: 1999,
        status: 'published',
        rating: 4.5,
        totalStudents: 980
      },
      {
        title: 'Machine Learning A-Z',
        description: 'Build robust ML models using Python.',
        thumbnail: 'https://placehold.co/600x400/064e3b/ffffff?text=Machine+Learning',
        category: 'Machine Learning',
        level: 'Advanced',
        price: 6499,
        status: 'published',
        rating: 4.9,
        totalStudents: 4100
      },
      {
        title: 'Node.js Backend Architecture',
        description: 'Build scalable APIs with Express and MongoDB.',
        thumbnail: 'https://placehold.co/600x400/065f46/ffffff?text=Node.js',
        category: 'Web Development',
        level: 'Intermediate',
        price: 3499,
        status: 'published',
        rating: 4.7,
        totalStudents: 1800
      },
      {
        title: 'Docker & Kubernetes',
        description: 'Containerize and orchestrate your apps.',
        thumbnail: 'https://placehold.co/600x400/1d4ed8/ffffff?text=DevOps',
        category: 'Cloud Computing',
        level: 'Intermediate',
        price: 4999,
        status: 'published',
        rating: 4.8,
        totalStudents: 2750
      },
      {
        title: 'Figma for UI Designers',
        description: 'Deep dive into Figma components and autolayout.',
        thumbnail: 'https://placehold.co/600x400/be185d/ffffff?text=Figma',
        category: 'UI/UX Design',
        level: 'Intermediate',
        price: 2499,
        status: 'published',
        rating: 4.6,
        totalStudents: 1120
      },
      {
        title: 'Full Stack Next.js App',
        description: 'Build a production-ready app with Next.js 14.',
        thumbnail: 'https://placehold.co/600x400/000000/ffffff?text=Next.js',
        category: 'Web Development',
        level: 'Advanced',
        price: 4499,
        status: 'published',
        rating: 4.9,
        totalStudents: 1900
      },
      {
        title: 'Cyber Security: Network Defense',
        description: 'Learn to defend corporate networks.',
        thumbnail: 'https://placehold.co/600x400/991b1b/ffffff?text=Network+Defense',
        category: 'Cyber Security',
        level: 'Intermediate',
        price: 3999,
        status: 'published',
        rating: 4.7,
        totalStudents: 850
      },
      {
        title: 'SQL & PostgreSQL Masterclass',
        description: 'Master relational databases from scratch.',
        thumbnail: 'https://placehold.co/600x400/0369a1/ffffff?text=PostgreSQL',
        category: 'Data Science',
        level: 'Beginner',
        price: 2999,
        status: 'published',
        rating: 4.8,
        totalStudents: 3200
      },
      {
        title: 'Deep Learning with PyTorch',
        description: 'Neural networks, CNNs, RNNs in PyTorch.',
        thumbnail: 'https://placehold.co/600x400/a21caf/ffffff?text=Deep+Learning',
        category: 'Machine Learning',
        level: 'Advanced',
        price: 5999,
        status: 'published',
        rating: 4.9,
        totalStudents: 2150
      }
    ]

    for (const c of courseData) {
      c.instructor = instructor._id
      const course = await Course.create(c)
      
      const lesson1 = await Lesson.create({
        course: course._id,
        title: 'Introduction to ' + course.title,
        description: 'Overview of what you will learn in this course.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 330,
        order: 1,
        isFreePreview: true
      })
      
      const lesson2 = await Lesson.create({
        course: course._id,
        title: 'Deep Dive Part 1',
        description: 'Getting into the core concepts.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 765,
        order: 2
      })

      course.curriculum = [lesson1._id, lesson2._id]
      await course.save()
    }

    console.log('14 courses seeded successfully!')
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

seedData()
