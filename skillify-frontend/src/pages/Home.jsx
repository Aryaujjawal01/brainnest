import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCode, FiTrendingUp, FiAward, FiUsers, FiPlayCircle, FiClock, FiStar, FiCheckCircle } from 'react-icons/fi';

const stats = [
  { label: 'Active learners', value: '12,000+' },
  { label: 'Premium Courses', value: '340+' },
  { label: 'Expert instructors', value: '85+' },
  { label: 'Completion rate', value: '92%' },
];

const features = [
  {
    icon: FiPlayCircle,
    title: 'Learn by Doing',
    desc: 'Every course pairs video lectures with hands-on projects.',
  },
  {
    icon: FiTrendingUp,
    title: 'Track Real Progress',
    desc: 'A visual progress bar on every enrolled course shows your journey.',
  },
  {
    icon: FiUsers,
    title: 'Expert Instructors',
    desc: 'Learn from industry veterans who have built real-world applications.',
  },
  {
    icon: FiAward,
    title: 'Quality-First',
    desc: 'Top-tier curriculum vetted by top tech companies globally.',
  },
];

const categories = [
  'Web Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Cloud Computing', 'Cyber Security'
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Glassmorphism & Gradient */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 overflow-hidden bg-white dark:bg-dark-bg">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-1/4 w-[150%] h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-dark-bg dark:to-purple-900/20 -z-10" />
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block glass text-primary-600 dark:text-primary-400 font-medium px-4 py-2 rounded-full mb-6 text-sm tracking-wide shadow-sm">
              ✨ Welcome to the future of learning
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Master the skills that <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                shape tomorrow
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              BrainNest Pro is an AI-powered premium learning platform designed to take you from beginner to industry-ready expert.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/courses" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/30 transform transition hover:-translate-y-1">
                Explore Courses
              </Link>
              <Link to="/register" className="px-8 py-4 glass text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-50/50 dark:hover:bg-white/5 transform transition hover:-translate-y-1">
                Start Teaching
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 border-y border-gray-200/50 dark:border-dark-border/50 bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-dark-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Why choose BrainNest Pro?</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
              A meticulously crafted learning experience that removes friction and maximizes retention.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, idx) => (
              <motion.div 
                key={f.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="text-indigo-600 dark:text-indigo-400 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Popular Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors shadow-sm"
              >
                {cat}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your career?</h2>
          <p className="text-lg text-indigo-100 mb-10">Join our community today and get access to premium courses curated just for you.</p>
          <Link to="/register" className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-50 transform transition hover:scale-105">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
