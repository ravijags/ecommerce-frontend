function Header({ cartCount }) {
    return (
        <header className="bg-gray-800 px-6 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Ecommerce Store</h1>
          <nav className="flex gap-6">
            <a href="#" className="text-white hover:text-yellow-300">Home</a>
            <a href="#" className="text-white hover:text-yellow-300">Products</a>
            <a href="#" className="text-white hover:text-yellow-300">Cart ({cartCount})</a>
            <a href="#" className="text-white hover:text-yellow-300">Login</a>
          </nav>
        </header>
    )
}

export default Header 