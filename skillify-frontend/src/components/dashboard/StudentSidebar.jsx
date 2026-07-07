import { Link, useLocation } from 'react-router-dom'
import { 
  FiHome, FiBookOpen, FiCompass, FiHeart, FiAward, 
  FiEdit3, FiFileText, FiBook, FiBookmark, FiBell, 
  FiMessageSquare, FiUser, FiSettings, FiLogOut 
} from 'react-icons/fi'
import { FaCrown } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { icon: FiHome, label: 'Dashboard', path: '/dashboard/student' },
  { icon: FiBookOpen, label: 'My Courses', path: '/dashboard/student/courses' },
  { icon: FiCompass, label: 'Explore Courses', path: '/courses' },
  { icon: FiHeart, label: 'Wishlist', path: '/wishlist' },
  { icon: FiAward, label: 'My Certificates', path: '/dashboard/student/certificates' },
  { icon: FiEdit3, label: 'Quiz Attempts', path: '/dashboard/student/quizzes' },
  { icon: FiFileText, label: 'Assignments', path: '/dashboard/student/assignments' },
  { icon: FiBook, label: 'Notes', path: '/dashboard/student/notes' },
  { icon: FiBookmark, label: 'Saved Resources', path: '/dashboard/student/resources' },
  { icon: FiBell, label: 'Notifications', path: '/dashboard/student/notifications', badge: 3 },
  { icon: FiMessageSquare, label: 'Messages', path: '/dashboard/student/messages' },
  { icon: FiUser, label: 'Profile', path: '/profile' },
  { icon: FiSettings, label: 'Settings', path: '/settings' },
]

export default function StudentSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <div className="w-64 bg-dark-bg border-r border-gray-800 h-screen fixed top-0 left-0 flex flex-col overflow-y-auto no-scrollbar hidden md:flex z-40">
      
      {/* Logo */}
      <div className="p-6 sticky top-0 bg-dark-bg z-10 border-b border-gray-800/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-premium rounded-lg flex items-center justify-center shadow-premium">
            <span className="text-white font-bold text-xl leading-none">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">BrainNest</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Learn. Grow. Succeed.</p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-primary-600' : 'bg-primary-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="px-4 py-4">
        <div className="bg-[#0b0f19] border border-gray-800/80 rounded-2xl p-4 text-center shadow-lg shadow-black/20">
          <FaCrown className="w-6 h-6 text-yellow-500 mx-auto mb-2 drop-shadow-md" />
          <h4 className="text-white font-bold text-sm mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed px-1">Unlock premium courses, certificates and more benefits.</p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
            Upgrade Now →
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800/50 mt-auto sticky bottom-0 bg-dark-bg">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}
