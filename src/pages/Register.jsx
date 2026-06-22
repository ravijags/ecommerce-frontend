import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://ecommerce-v2-y8jy.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed!')
        setLoading(false)
        return
      }

      navigate('/login')

    } catch (err) {
      setError('Something went wrong!')
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>

      {error && (
        <p className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4">
          {error}
        </p>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <label className="block text-sm text-gray-700 mb-1">Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm text-gray-700 mb-1">Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm text-gray-700 mb-1">Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </main>
  )
}

export default Register