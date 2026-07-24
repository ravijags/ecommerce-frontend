import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Search, ShoppingCart, Heart, User,
  Package, Settings, LogOut, X, Menu, ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'

function Header({ cartCount, onSearch }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (onSearch) onSearch('')
  }

  const categories = [
  'Beauty', 'Smartphones', 'Laptops',
  'Fragrances', 'Furniture', 'Tops',
  'Mens Shoes', 'Watches', 'Sunglasses',
  'Automotive'
]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* Announcement bar */}
      <div className="bg-black text-white text-center py-2.5">
        <p className="text-xs tracking-widest font-medium">
          🎉 FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;·&nbsp; USE CODE <span className="text-yellow-400 font-bold">SHOPX10</span> FOR 10% OFF
        </p>
      </div>

      {/* Main header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 no-underline outline-none">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-gray-900">
                  SHOP<span className="text-red-500">X</span>
                </span>
                <span className="text-xs text-gray-400 tracking-widest -mt-1">
                  EVERYTHING DELIVERED
                </span>
              </div>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl">
              <div className={`flex items-center border-2 rounded-xl transition-all duration-200 bg-gray-50 ${
                searchFocused
                  ? 'border-gray-900 bg-white shadow-sm'
                  : 'border-transparent hover:border-gray-200'
              }`}>
                <Search size={18} className="ml-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full px-3 py-3 text-sm focus:outline-none bg-transparent text-gray-900 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mr-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 flex-shrink-0">

              {token ? (
                <>
                  <Link to="/orders" className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors group min-w-[56px]">
                    <Package size={22} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-900 mt-0.5 transition-colors">Orders</span>
                  </Link>

                  <Link to="/admin" className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors group min-w-[56px]">
                    <Settings size={22} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-900 mt-0.5 transition-colors">Admin</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors group min-w-[56px] cursor-pointer"
                  >
                    <LogOut size={22} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-900 mt-0.5 transition-colors">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors group min-w-[56px]">
                    <User size={22} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-900 mt-0.5 transition-colors">Login</span>
                  </Link>

                  <Link
                    to="/register"
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors ml-1"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Wishlist */}
              <button className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors group min-w-[56px] cursor-pointer">
                <Heart size={22} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                <span className="text-xs text-gray-500 group-hover:text-gray-900 mt-0.5 transition-colors">Wishlist</span>
              </button>

              {/* Cart */}
              <Link to="/cart" className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors group min-w-[56px] relative">
                <div className="relative">
                  <ShoppingCart size={22} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-900 mt-0.5 transition-colors">Cart</span>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto gap-2">
            {categories.map((cat, index) => (
              <button
                key={index}
                className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors duration-200 cursor-pointer border-b-2 border-transparent hover:border-gray-900 flex-shrink-0"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

    </header>
  )
}

export default Header