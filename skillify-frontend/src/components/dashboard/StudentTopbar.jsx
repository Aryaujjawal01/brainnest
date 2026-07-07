import { FiSearch, FiMoon, FiSun, FiBell, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { ThemeContext } from '../../context/ThemeProvider'
import { useContext } from 'react'

export default function StudentTopbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const isDarkMode = theme === 'dark'

  return (
    <div className="h-20 bg-dark-bg border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-30">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search for courses, lessons, instructors..."
          className="w-full bg-gray-900 border border-gray-800 text-gray-200 rounded-full pl-12 pr-24 py-3 focus:outline-none focus:border-gray-700 transition-colors text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-gray-800 px-2 py-1 rounded text-xs font-medium text-gray-400">
          <span>Ctrl + K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-8">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-white transition-colors p-2">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-dark-bg">3</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-800">
          <img 
            src={user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-white leading-tight">Hi, {user?.name?.split(' ')[0]} 👋</p>
            <p className="text-xs text-gray-500 font-medium">{user?.role}</p>
          </div>
          <FiChevronDown className="text-gray-500 hidden lg:block w-4 h-4" />
        </div>

      </div>
    </div>
  )
}
