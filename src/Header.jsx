import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Search, ShoppingCart, Heart, User, Package, Settings, LogOut, X, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import PremiaLogo from './components/PremiaLogo'

function Header({ cartCount, wishlistCount, onSearch }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled]       = useState(false)
  const prevCartCount                  = useRef(cartCount)
  const [cartBounce, setCartBounce]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 600)
    }
    prevCartCount.current = cartCount
  }, [cartCount])

  const token = localStorage.getItem('token')

  const POPULAR = ['iPhone', 'Samsung', 'Nike', 'Rolex', 'Apple Watch', 'Laptop', 'Perfume', 'Sneakers']
  const suggestions = searchQuery.length > 1
    ? POPULAR.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : POPULAR.slice(0, 6)
  const showSuggestions = searchFocused && suggestions.length > 0

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

  const handleSearchSubmit = (q) => {
    const query = q || searchQuery
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchFocused(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (onSearch) onSearch('')
  }

  const categories = [
    { label: 'Smartphones',  slug: 'smartphones' },
    { label: 'Laptops',      slug: 'laptops' },
    { label: 'Audio',        slug: 'mobile-accessories' },
    { label: 'Fashion',      slug: 'mens-shirts' },
    { label: 'Footwear',     slug: 'mens-shoes' },
    { label: 'Beauty',       slug: 'beauty' },
    { label: 'Skin Care',    slug: 'skin-care' },
    { label: 'Fragrances',   slug: 'fragrances' },
    { label: 'Watches',      slug: 'mens-watches' },
    { label: 'Furniture',    slug: 'furniture' },
    { label: 'Groceries',    slug: 'groceries' },
    { label: 'Sports',       slug: 'sports-accessories' },
    { label: 'Sunglasses',   slug: 'sunglasses' },
    { label: 'Gaming',       slug: 'laptops' },
  ]

  return (
    <>
      {/* ── HEADER — hidden on mobile, full on desktop ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: '#fff',
        boxShadow: scrolled ? '0 1px 0 #e2e8f0, 0 2px 8px rgba(0,0,0,0.04)' : '0 1px 0 #f1f5f9',
        transition: 'box-shadow 0.3s ease',
      }} className="desktop-header">

        {/* Announcement marquee */}
        {!scrolled && (
          <div style={{ backgroundColor: '#0f172a', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-flex', gap: 48 }}
            >
              {[...Array(2)].map((_, j) => (
                <span key={j} style={{ display: 'inline-flex', gap: 56, color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em' }}>
                  <span>🚚 FREE SHIPPING ABOVE ₹999</span>
                  <span style={{ color: '#C9A84C' }}>· USE CODE <strong>PREMIA10</strong> ·</span>
                  <span>✨ NEW ARRIVALS EVERY WEEK</span>
                  <span style={{ color: '#C9A84C' }}>· 194+ PREMIUM PRODUCTS ·</span>
                  <span>🔒 100% SECURE PAYMENTS</span>
                  <span style={{ color: '#C9A84C' }}>· 7-DAY EASY RETURNS ·</span>
                </span>
              ))}
            </motion.div>
          </div>
        )}

        {/* Main header row */}
        <div style={{ borderBottom: '1px solid #f8fafc', backgroundColor: '#fff', transition: 'all 0.3s ease' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 20px',
            height: scrolled ? 54 : 64,
            display: 'flex', transition: 'height 0.3s ease',
            alignItems: 'center', gap: 16,
          }}>
            {/* Logo */}
            <Link to="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
              <PremiaLogo variant="light" size="md" />
            </Link>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: 560, position: 'relative' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                backgroundColor: searchFocused ? '#fff' : '#f8fafc',
                border: searchFocused ? '2px solid #0f172a' : '2px solid #f1f5f9',
                borderRadius: showSuggestions ? '12px 12px 0 0' : 12,
                transition: 'all 0.15s',
                boxShadow: searchFocused ? '0 0 0 4px rgba(15,23,42,0.06)' : 'none',
              }}>
                <Search size={15} color="#64748b" style={{ marginLeft: 14, flexShrink: 0 }} />
                <input
                  type="text" placeholder="Search Apple, Nike, Samsung..."
                  value={searchQuery} onChange={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                  style={{ flex: 1, padding: '10px 12px', fontSize: 13, border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#0f172a', fontFamily: 'Inter, system-ui' }}
                />
                {searchQuery && (
                  <button onClick={clearSearch} style={{ marginRight: 10, padding: 4, borderRadius: '50%', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <X size={11} color="#64748b" />
                  </button>
                )}
              </div>
              {showSuggestions && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '2px solid #0f172a', borderTop: 'none', borderRadius: '0 0 12px 12px', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                  {!searchQuery && <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Popular Searches</div>}
                  {suggestions.map(s => (
                    <button key={s} onMouseDown={() => { setSearchQuery(s); handleSearchSubmit(s) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#0f172a', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Search size={12} color="#94a3b8" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
              {token ? (
                <>
                  <Link to="/orders" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, textDecoration: 'none', gap: 2 }} className="nav-icon">
                    <Package size={20} color="#374151" />
                    <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>Orders</span>
                  </Link>
                  <Link to="/admin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, textDecoration: 'none', gap: 2 }} className="nav-icon">
                    <Settings size={20} color="#374151" />
                    <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>Admin</span>
                  </Link>
                  <button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', gap: 2 }} className="nav-icon">
                    <LogOut size={20} color="#374151" />
                    <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, textDecoration: 'none', gap: 2 }} className="nav-icon">
                    <User size={20} color="#374151" />
                    <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>Login</span>
                  </Link>
                  <Link to="/register" style={{ backgroundColor: '#C9A84C', color: '#0f172a', padding: '9px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.02em' }}>
                    Sign Up
                  </Link>
                </>
              )}

              <Link to="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, textDecoration: 'none', gap: 2, position: 'relative' }} className="nav-icon">
                <Heart size={20} color="#374151" />
                {wishlistCount > 0 && (
                  <span style={{ position: 'absolute', top: 2, right: 4, background: '#ef4444', color: '#fff', fontSize: 8, fontWeight: 800, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
                <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>Wishlist</span>
              </Link>

              <Link to="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, textDecoration: 'none', position: 'relative', gap: 2 }} className="nav-icon">
                <div style={{ position: 'relative' }}>
                  <motion.div animate={cartBounce ? { y: [0, -6, 0], scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.4 }}>
                    <ShoppingCart size={20} color="#374151" />
                  </motion.div>
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#C9A84C', color: '#0f172a', fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>Cart</span>
              </Link>

              <Link to={token ? '/account' : '/login'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: 10, textDecoration: 'none', gap: 2 }} className="nav-icon">
                {token ? (
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#0f172a' }}>
                    {(localStorage.getItem('premia_uname') || 'U')[0].toUpperCase()}
                  </div>
                ) : <User size={20} color="#374151" />}
                <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>{token ? 'Account' : 'Login'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category nav */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {categories.map((cat, i) => (
                <button key={i}
                  onClick={() => { navigate(`/?category=${cat.slug}`); if (onSearch) onSearch('') }}
                  style={{ flexShrink: 0, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#374151', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s, border-color 0.15s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderBottomColor = '#C9A84C' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderBottomColor = 'transparent' }}
                >{cat.label}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE TOP BAR — PREMIA branded ── */}
      <div className="mobile-header" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#04060f',
        display: 'none', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#0f172a', flexShrink: 0 }}>P</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.3px' }}>PREMIA</div>
            <div style={{ fontSize: 8, color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Premium Shopping</div>
          </div>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={16} color="#fff" />
          </button>
          <button onClick={() => setMobileMenuOpen(true)}
            style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Menu size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Mobile search dropdown */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', padding: '0 16px 12px', backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 53, zIndex: 49 }}
            className="mobile-header"
          >
            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #0f172a', borderRadius: 12, backgroundColor: '#fff' }}>
              <Search size={15} color="#64748b" style={{ marginLeft: 12 }} />
              <input type="text" placeholder="Search products..."
                value={searchQuery} onChange={handleSearch} autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { handleSearchSubmit(); setMobileSearchOpen(false) } }}
                style={{ flex: 1, padding: '10px 12px', fontSize: 13, border: 'none', outline: 'none', fontFamily: 'Inter, system-ui' }}
              />
              {searchQuery && (
                <button onClick={clearSearch} style={{ marginRight: 10, border: 'none', background: 'none', cursor: 'pointer' }}>
                  <X size={13} color="#94a3b8" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 }}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 280, backgroundColor: '#fff', zIndex: 51, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <PremiaLogo variant="light" size="sm" />
                <button onClick={() => setMobileMenuOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={20} color="#64748b" />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {token && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f8fafc', borderRadius: 14, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#C9A84C', flexShrink: 0 }}>
                      {(localStorage.getItem('premia_uname') || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{localStorage.getItem('premia_uname') || 'User'}</p>
                      <Link to="/account" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>View Account →</Link>
                    </div>
                  </div>
                )}
                {token ? (
                  <div style={{ marginBottom: 20 }}>
                    {[{ to: '/orders', icon: <Package size={16} />, label: 'My Orders' }, { to: '/admin', icon: <Settings size={16} />, label: 'Admin Panel' }].map((item, i) => (
                      <Link key={i} to={item.to} onClick={() => setMobileMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 10, color: '#0f172a', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                        <span style={{ color: '#C9A84C' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', borderRadius: 10, color: '#ef4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500, width: '100%' }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 10, border: '2px solid #0f172a', color: '#0f172a', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                      style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 10, backgroundColor: '#C9A84C', color: '#0f172a', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Sign Up</Link>
                  </div>
                )}
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Categories</p>
                {categories.map((cat, i) => (
                  <button key={i}
                    onClick={() => { navigate(`/?category=${cat.slug}`); setMobileMenuOpen(false); if (onSearch) onSearch('') }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13, color: '#334155', marginBottom: 2 }}>
                    {cat.label} <span style={{ color: '#cbd5e1' }}>›</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* Desktop: show full header, hide mobile header */
        .desktop-header { display: block !important; }
        .mobile-header  { display: none !important; }

        /* Mobile: hide full header, show mobile header */
        @media (max-width: 768px) {
          .desktop-header { display: none !important; }
          .mobile-header  { display: flex !important; }
        }

        .nav-icon:hover svg { color: #0f172a !important; }
        .nav-icon:hover span { color: #0f172a !important; }
      `}</style>
    </>
  )
}

export default Header
