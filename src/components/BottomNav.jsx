import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Home, Search, Heart, ShoppingCart, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BottomNav({ cartCount, wishlistCount, onSearch }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const isActive = (to) => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  const handleSearchSubmit = () => {
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  const tabs = [
    { to: '/',         label: 'Home',     
      Icon: ({ active }) => <Home size={22} fill={active ? '#C9A84C' : 'none'} color={active ? '#C9A84C' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.8} /> },
    { to: null,        label: 'Search',   
      Icon: ({ active }) => <Search size={22} color={active ? '#C9A84C' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.8} /> },
    { to: '/wishlist', label: 'Wishlist', count: wishlistCount,
      Icon: ({ active }) => <Heart size={22} fill={active ? '#C9A84C' : 'none'} color={active ? '#C9A84C' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.8} /> },
    { to: '/cart',     label: 'Cart',     count: cartCount,
      Icon: ({ active }) => <ShoppingCart size={22} fill={active ? '#C9A84C' : 'none'} color={active ? '#C9A84C' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.8} /> },
    { to: '/account',  label: 'Account',  
      Icon: ({ active }) => <User size={22} fill={active ? '#C9A84C' : 'none'} color={active ? '#C9A84C' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.8} /> },
  ]

  return (
    <>
      {/* Spacer */}
      <div style={{ height: 64 }} className="bottom-nav-spacer" />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setSearchOpen(false); setQuery('') }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 98 }}
            />
            {/* Search bar slides up from bottom */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              style={{
                position: 'fixed', bottom: 72, left: 16, right: 16,
                zIndex: 99, background: '#fff',
                borderRadius: 16, padding: 16,
                boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 12, padding: '10px 14px', border: '2px solid #0f172a' }}>
                <Search size={16} color="#94a3b8" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search Apple, Nike, Samsung..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', fontFamily: 'Inter, system-ui' }}
                />
                {query ? (
                  <button onClick={() => setQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}>
                    <X size={14} color="#94a3b8" />
                  </button>
                ) : null}
              </div>
              {/* Quick searches */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['iPhone', 'Samsung', 'Nike', 'Rolex', 'Laptop', 'Perfume'].map(s => (
                  <button key={s} onClick={() => { setQuery(s); navigate(`/search?q=${s}`); setSearchOpen(false); setQuery('') }}
                    style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 12, fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={handleSearchSubmit}
                style={{ width: '100%', marginTop: 12, padding: '12px', borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Search →
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 97,
        background: '#fff',
        borderTop: '1px solid #f1f5f9',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'stretch',
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }} className="bottom-nav">

        {tabs.map(({ to, label, Icon, count }, i) => {
          const active = to ? isActive(to) : searchOpen
          const content = (
            <>
              {/* Active top bar */}
              {active && (
                <motion.div layoutId="activeTab"
                  style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 3, borderRadius: '0 0 3px 3px', background: '#C9A84C' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon with badge */}
              <div style={{ position: 'relative' }}>
                <motion.div animate={{ scale: active ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }}>
                  <Icon active={active} />
                </motion.div>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: -6, right: -8,
                        background: '#ef4444', color: '#fff',
                        fontSize: 9, fontWeight: 800,
                        minWidth: 16, height: 16, borderRadius: 8,
                        padding: '0 4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1.5px solid #fff',
                      }}>
                      {count > 99 ? '99+' : count}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? '#C9A84C' : '#94a3b8', marginTop: 2 }}>
                {label}
              </span>
            </>
          )

          const commonStyle = {
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', padding: '8px 4px', gap: 2,
            cursor: 'pointer', textDecoration: 'none',
            background: 'none', border: 'none',
          }

          if (to === null) {
            return (
              <button key={i} onClick={() => setSearchOpen(s => !s)} style={commonStyle}>
                {content}
              </button>
            )
          }

          return (
            <Link key={i} to={to} style={commonStyle}>
              {content}
            </Link>
          )
        })}
      </nav>

      <style>{`
        .bottom-nav { display: none !important; }
        .bottom-nav-spacer { display: none !important; }
        @media (max-width: 768px) {
          .bottom-nav { display: flex !important; }
          .bottom-nav-spacer { display: block !important; }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
