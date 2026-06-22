import { Link, useNavigate } from 'react-router-dom'

function Header({ cartCount }) {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-gray-800 px-6 py-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">Ecommerce Store</h1>
      <nav className="flex gap-6 items-center">
        <Link to="/" className="text-white hover:text-yellow-300">Home</Link>

        {token ? (
          <button
            onClick={handleLogout}
            className="text-white hover:text-yellow-300 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/register" className="text-white hover:text-yellow-300">Register</Link>
            <Link to="/login" className="text-white hover:text-yellow-300">Login</Link>
          </>
        )}

        <Link to="/" className="text-white hover:text-yellow-300">
          Cart ({cartCount})
        </Link>
      </nav>
    </header>
  )
}

export default Header