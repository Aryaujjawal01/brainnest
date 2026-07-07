import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="bg-dark-bg min-h-screen text-white font-sans flex">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <StudentTopbar />
        
        {/* Page Content */}
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
