import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Search, ShoppingCart, Heart, User, Package, Settings, LogOut, X, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import PremiaLogo from './components/PremiaLogo'

const CATEGORIES = [
  { label: 'Smartphones', value: 'smartphones' },
  { label: 'Laptops', value: 'laptops' },
  { label: 'Audio', value: 'audio' },
  { label: 'Fashion', value: 'mens-shirts' },
  { label: 'Footwear', value: 'mens-shoes' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Skin Care', value: 'skin-care' },
  { label: 'Fragrances', value: 'fragrances' },
  { label: 'Watches', value: 'mens-watches' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Sports', value: 'sports-accessories' },
  { label: 'Sunglasses', value: 'sunglasses' },
  { label: 'Gaming', value: 'laptops' },
]

function Header({ cartCount, onSearch }) {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const isAdmin = location.pathname.startsWith('/admin')

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out!')
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (onSearch) onSearch('')
  }

  const handleCategory = (value) => {
    navigate(`/?category=${value}`)
    setMobileMenuOpen(false)
    if (onSearch) onSearch('')
    setSearchQuery('')
  }

  // Don't show main header inside admin panel
  if (isAdmin) return null

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">

        {/* Announcement bar */}
        <div style={{ background: '#0f172a' }} className="py-2 px-4 text-center">
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#94a3b8' }}>
            Free shipping above ₹999 &nbsp;·&nbsp; Use code{' '}
            <span style={{ color: '#C9A84C' }} className="font-bold">PREMIA10</span>
            {' '}&nbsp;·&nbsp; New arrivals every week
          </p>
        </div>

        {/* Main header row */}
        <div className="border-b" style={{ borderColor: '#f1f5f9' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-50">
              <Menu size={22} style={{ color: '#0f172a' }} />
            </button>

            <Link to="/" className="flex-shrink-0">
              <PremiaLogo variant="light" size="md" />
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="flex items-center rounded-xl transition-all" style={{
                background: searchFocused ? '#fff' : '#f8fafc',
                border: `2px solid ${searchFocused ? '#0f172a' : '#f1f5f9'}`,
              }}>
                <Search size={16} className="ml-4 flex-shrink-0" style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search Apple, Nike, Samsung..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full px-3 py-3 text-sm focus:outline-none bg-transparent"
                  style={{ color: '#0f172a' }}
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="mr-3 p-1 rounded-full hover:bg-gray-100">
                    <X size={13} style={{ color: '#94a3b8' }} />
                  </button>
                )}
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden p-2.5 rounded-xl hover:bg-gray-50">
                <Search size={20} style={{ color: '#64748b' }} />
              </button>

              {token ? (
                <>
                  <Link to="/orders" className="hidden lg:flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 group min-w-[52px]">
                    <Package size={20} style={{ color: '#64748b' }} />
                    <span className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Orders</span>
                  </Link>
                  <Link to="/admin" className="hidden lg:flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 group min-w-[52px]">
                    <Settings size={20} style={{ color: '#64748b' }} />
                    <span className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Admin</span>
                  </Link>
                  <button onClick={handleLogout} className="hidden lg:flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 group min-w-[52px]">
                    <LogOut size={20} style={{ color: '#64748b' }} />
                    <span className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden lg:flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 min-w-[52px]">
                    <User size={20} style={{ color: '#64748b' }} />
                    <span className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>Login</span>
                  </Link>
                  <Link to="/register" className="hidden lg:block px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ background: '#0f172a' }}>
                    Sign Up
                  </Link>
                </>
              )}

              <button className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 group min-w-[52px]">
                <Heart size={20} style={{ color: '#64748b' }} />
                <span className="text-xs mt-0.5 hidden lg:block" style={{ color: '#94a3b8' }}>Wishlist</span>
              </button>

              <Link to="/cart" className="flex flex-col items-center p-2.5 rounded-xl hover:bg-gray-50 group min-w-[52px] relative">
                <div className="relative">
                  <ShoppingCart size={20} style={{ color: '#64748b' }} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold"
                        style={{ background: '#C9A84C', fontSize: 9, color: '#0f172a' }}
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-xs mt-0.5 hidden lg:block" style={{ color: '#94a3b8' }}>Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden px-4 pb-3 overflow-hidden">
                <div className="flex items-center rounded-xl" style={{ border: '2px solid #0f172a', background: '#fff' }}>
                  <Search size={16} className="ml-3" style={{ color: '#94a3b8' }} />
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearch} autoFocus className="w-full px-3 py-2.5 text-sm focus:outline-none" />
                  {searchQuery && <button onClick={clearSearch} className="mr-3"><X size={13} style={{ color: '#94a3b8' }} /></button>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category nav — NOW WITH REAL LINKS */}
        <div className="hidden lg:block bg-white border-b" style={{ borderColor: '#f1f5f9' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center overflow-x-auto gap-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategory(cat.value)}
                  className="px-4 py-3 text-xs font-medium whitespace-nowrap transition-all border-b-2 border-transparent flex-shrink-0 hover:border-yellow-500"
                  style={{ color: '#64748b' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderBottomColor = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderBottomColor = 'transparent' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#f1f5f9' }}>
                <PremiaLogo variant="light" size="sm" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-gray-50"><X size={20} style={{ color: '#64748b' }} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {token ? (
                  <div className="mb-6 space-y-1">
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-50 text-sm font-medium" style={{ color: '#0f172a' }}>
                      <Package size={18} style={{ color: '#C9A84C' }} /> My Orders
                    </Link>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-50 text-sm font-medium" style={{ color: '#0f172a' }}>
                      <Settings size={18} style={{ color: '#C9A84C' }} /> Admin Panel
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-red-50 w-full text-sm font-medium" style={{ color: '#ef4444' }}>
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 mb-6">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm border-2" style={{ borderColor: '#0f172a', color: '#0f172a' }}>Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm text-white" style={{ background: '#0f172a' }}>Sign Up</Link>
                  </div>
                )}
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>Categories</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.value} onClick={() => handleCategory(cat.value)} className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-gray-50 text-sm" style={{ color: '#334155' }}>
                      <span>{cat.label}</span>
                      <span style={{ color: '#cbd5e1' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-white" style={{ borderColor: '#f1f5f9' }}>
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center gap-1 px-4 py-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-xs font-medium" style={{ color: '#0f172a' }}>Home</span>
          </Link>
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="flex flex-col items-center gap-1 px-4 py-1">
            <Search size={22} style={{ color: '#94a3b8' }} />
            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1">
            <Heart size={22} style={{ color: '#94a3b8' }} />
            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>Wishlist</span>
          </button>
          <Link to="/cart" className="flex flex-col items-center gap-1 px-4 py-1 relative">
            <div className="relative">
              <ShoppingCart size={22} style={{ color: '#94a3b8' }} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ background: '#C9A84C', fontSize: 8, color: '#0f172a' }}>{cartCount}</span>}
            </div>
            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>Cart</span>
          </Link>
          <Link to={token ? '/orders' : '/login'} className="flex flex-col items-center gap-1 px-4 py-1">
            <User size={22} style={{ color: '#94a3b8' }} />
            <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>{token ? 'Account' : 'Login'}</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header
