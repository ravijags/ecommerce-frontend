import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Search, ShoppingCart, Heart, User,
  Package, Settings, LogOut, X, Menu
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import PremiaLogo from './components/PremiaLogo'

function Header({ cartCount, wishlistCount, onSearch }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

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
    { label: 'Smartphones', slug: 'smartphones' },
    { label: 'Laptops', slug: 'laptops' },
    { label: 'Audio', slug: 'mobile-accessories' },
    { label: 'Fashion', slug: 'mens-shirts' },
    { label: 'Footwear', slug: 'mens-shoes' },
    { label: 'Beauty', slug: 'beauty' },
    { label: 'Skin Care', slug: 'skin-care' },
    { label: 'Fragrances', slug: 'fragrances' },
    { label: 'Watches', slug: 'mens-watches' },
    { label: 'Furniture', slug: 'furniture' },
    { label: 'Groceries', slug: 'groceries' },
    { label: 'Sports', slug: 'sports-accessories' },
    { label: 'Sunglasses', slug: 'sunglasses' },
    { label: 'Gaming', slug: 'laptops' },
  ]

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#fff',
        boxShadow: '0 1px 0 #f1f5f9'
      }}>

        {/* Announcement bar */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '8px 16px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#94a3b8',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500
          }}>
            Free shipping above ₹999 &nbsp;·&nbsp; Use code{' '}
            <span style={{ color: '#C9A84C', fontWeight: 700 }}>PREMIA10</span>
            {' '}&nbsp;·&nbsp; New arrivals every week
          </p>
        </div>

        {/* Main header */}
        <div style={{
          borderBottom: '1px solid #f8fafc',
          backgroundColor: '#fff'
        }}>
          <div style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 20px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>

            {/* Hamburger - mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                padding: 8,
                borderRadius: 10,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              className="mobile-only"
            >
              <Menu size={22} color="#0f172a" />
            </button>

            {/* Logo */}
            <Link to="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
              <PremiaLogo variant="light" size="md" />
            </Link>

            {/* Search - desktop */}
            <div style={{ flex: 1, maxWidth: 560, position: 'relative' }} className="desktop-search">
              <div style={{
                display: 'flex', alignItems: 'center',
                backgroundColor: searchFocused ? '#fff' : '#f8fafc',
                border: searchFocused ? '2px solid #0f172a' : '2px solid #f1f5f9',
                borderRadius: showSuggestions ? '12px 12px 0 0' : 12,
                transition: 'all 0.15s',
                boxShadow: searchFocused ? '0 0 0 4px rgba(15,23,42,0.06)' : 'none'
              }}>
                <Search size={15} color="#94a3b8" style={{ marginLeft: 14, flexShrink: 0 }} />
                <input
                  id="site-search" name="search" type="text"
                  placeholder="Search Apple, Nike, Samsung..."
                  value={searchQuery}
                  onChange={handleSearch}
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
              {/* Suggestions dropdown */}
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginLeft: 'auto'
            }}>

              {/* Mobile search */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'none'
                }}
                className="mobile-only"
              >
                <Search size={20} color="#64748b" />
              </button>

              {token ? (
                <>
                  <Link
                    to="/orders"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      gap: 2
                    }}
                    className="desktop-only nav-icon"
                  >
                    <Package size={20} color="#64748b" />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Orders</span>
                  </Link>

                  <Link
                    to="/admin"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      gap: 2
                    }}
                    className="desktop-only nav-icon"
                  >
                    <Settings size={20} color="#64748b" />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Admin</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      gap: 2
                    }}
                    className="desktop-only nav-icon"
                  >
                    <LogOut size={20} color="#64748b" />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      gap: 2
                    }}
                    className="desktop-only nav-icon"
                  >
                    <User size={20} color="#64748b" />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    style={{
                      backgroundColor: '#C9A84C',
                      color: '#0f172a',
                      padding: '9px 18px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: '0.02em'
                    }}
                    className="desktop-only"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  gap: 2,
                  position: 'relative',
                }}
                className="nav-icon"
              >
                <Heart size={20} color="#64748b" />
                {wishlistCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 4,
                    background: '#ef4444', color: '#fff',
                    fontSize: 8, fontWeight: 800, borderRadius: '50%',
                    width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{wishlistCount > 9 ? '9+' : wishlistCount}</span>
                )}
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}
                  className="desktop-only">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  position: 'relative',
                  gap: 2
                }}
                className="nav-icon"
              >
                <div style={{ position: 'relative' }}>
                  <ShoppingCart size={20} color="#64748b" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: '#C9A84C',
                          color: '#0f172a',
                          fontSize: 9,
                          fontWeight: 800,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}
                  className="desktop-only">Cart</span>
              </Link>

              {/* Account — desktop only */}
              <Link
                to={token ? '/account' : '/login'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  gap: 2,
                }}
                className="nav-icon desktop-only"
              >
                {token ? (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#C9A84C', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900, color: '#0f172a',
                  }}>
                    {(localStorage.getItem('premia_uname') || 'U')[0].toUpperCase()}
                  </div>
                ) : (
                  <User size={20} color="#64748b" />
                )}
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                  {token ? 'Account' : 'Login'}
                </span>
              </Link>

            </div>
          </div>

          {/* Mobile search dropdown */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                  overflow: 'hidden',
                  padding: '0 16px 12px',
                  backgroundColor: '#fff'
                }}
                className="mobile-only"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '2px solid #0f172a',
                  borderRadius: 12,
                  backgroundColor: '#fff'
                }}>
                  <Search size={15} color="#94a3b8" style={{ marginLeft: 12 }} />
                  <input
                    id="mobile-search"
                    name="search"
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit()
                        setMobileSearchOpen(false)
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      fontSize: 13,
                      border: 'none',
                      outline: 'none',
                      fontFamily: 'Inter, system-ui'
                    }}
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
        </div>

        {/* Category nav - desktop only */}
        <div style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #f1f5f9'
        }} className="desktop-only">
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}>
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => { navigate(`/?category=${cat.slug}`); if (onSearch) onSearch('') }}
                  style={{
                    flexShrink: 0,
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#64748b',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s, border-color 0.15s',
                    outline: 'none'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#0f172a'
                    e.currentTarget.style.borderBottomColor = '#C9A84C'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#64748b'
                    e.currentTarget.style.borderBottomColor = 'transparent'
                  }}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 50
              }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0,
                width: 280, backgroundColor: '#fff',
                zIndex: 51, display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.12)'
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <PremiaLogo variant="light" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} color="#64748b" />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {token ? (
                  <div style={{ marginBottom: 20 }}>
                    {[
                      { to: '/orders', icon: <Package size={16} />, label: 'My Orders' },
                      { to: '/admin', icon: <Settings size={16} />, label: 'Admin Panel' },
                    ].map((item, i) => (
                      <Link
                        key={i}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 12px', borderRadius: 10,
                          color: '#0f172a', textDecoration: 'none',
                          fontSize: 13, fontWeight: 500, marginBottom: 4
                        }}
                      >
                        <span style={{ color: '#C9A84C' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 12px', borderRadius: 10,
                        color: '#ef4444', border: 'none',
                        backgroundColor: 'transparent', cursor: 'pointer',
                        fontSize: 13, fontWeight: 500, width: '100%'
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        flex: 1, textAlign: 'center', padding: '10px',
                        borderRadius: 10, border: '2px solid #0f172a',
                        color: '#0f172a', textDecoration: 'none',
                        fontSize: 13, fontWeight: 600
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        flex: 1, textAlign: 'center', padding: '10px',
                        borderRadius: 10, backgroundColor: '#C9A84C',
                        color: '#0f172a', textDecoration: 'none',
                        fontSize: 13, fontWeight: 700
                      }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <p style={{
                  fontSize: 10, fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  marginBottom: 12
                }}>
                  Categories
                </p>
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => { navigate(`/?category=${cat.slug}`); setMobileMenuOpen(false); if (onSearch) onSearch('') }}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%', padding: '10px 12px',
                      borderRadius: 10, border: 'none',
                      backgroundColor: 'transparent', cursor: 'pointer',
                      fontSize: 13, color: '#334155', marginBottom: 2
                    }}
                  >
                    {cat.label}
                    <span style={{ color: '#cbd5e1' }}>›</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom mobile nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', borderTop: '1px solid #f1f5f9',
        display: 'flex', zIndex: 40, paddingBottom: 'env(safe-area-inset-bottom)'
      }} className="mobile-only">
        {[
          { to: '/', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: 'Home' },
          { to: null, icon: <Search size={22} />, label: 'Search', onClick: () => setMobileSearchOpen(!mobileSearchOpen) },
          { to: '/wishlist', icon: <Heart size={22} />, label: 'Wishlist', badge: wishlistCount },
          { to: '/cart', icon: <ShoppingCart size={22} />, label: 'Cart', badge: cartCount },
          { to: token ? '/account' : '/login', icon: <User size={22} />, label: token ? 'Account' : 'Login' },
        ].map((item, i) => (
          item.to ? (
            <Link
              key={i}
              to={item.to}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3, padding: '8px 0',
                color: '#94a3b8', textDecoration: 'none',
                fontSize: 10, fontWeight: 500, position: 'relative'
              }}
            >
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: '22%',
                  backgroundColor: '#C9A84C', color: '#0f172a',
                  fontSize: 8, fontWeight: 800,
                  width: 14, height: 14, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.badge}
                </span>
              )}
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <button
              key={i}
              onClick={item.onClick}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 3, padding: '8px 0',
                color: '#94a3b8', border: 'none', backgroundColor: 'transparent',
                fontSize: 10, fontWeight: 500, cursor: 'pointer'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          )
        ))}
      </div>

      {/* CSS for responsive helpers */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .desktop-search { display: none !important; }
        }
        @media (min-width: 1024px) {
          .mobile-only { display: none !important; }
          .desktop-only { display: flex !important; }
          .desktop-search { display: block !important; }
        }
        .nav-icon:hover svg {
          color: #0f172a !important;
        }
        .nav-icon:hover span {
          color: #0f172a !important;
        }
      `}</style>

    </>
  )
}

export default Header