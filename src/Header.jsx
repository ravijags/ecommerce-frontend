import { Link } from "react-router-dom"
function Header({ cartCount }) {
    return (
        <header className="bg-gray-800 px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Ecommerce Store</h1>
          <nav className="flex gap-6">
            <Link to="/" className="text-white hover:text-yellow-300">Home</Link>
            <Link to="/register" className="text-white hover:text-yellow-300">Register</Link>
            <Link to="/login" className="text-white hover:text-yellow-300">Login</Link>
            <Link to="/" className="text-white hover:text-yellow-300">Cart ({cartCount})</Link>
          </nav>
        </header>
    )
}

export default Header 