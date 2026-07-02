import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200"
      >
        Back to Home
      </Link>
    </main>
  )
}

export default NotFound