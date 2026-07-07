import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link to="/" className="mt-6 text-primary-600 font-medium">Go back home</Link>
    </div>
  )
}
