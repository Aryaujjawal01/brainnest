export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} BrainNest. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <span>About</span>
            <span>Contact</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
