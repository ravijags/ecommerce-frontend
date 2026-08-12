import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BottomNav({ cartCount, wishlistCount }) {
  const { pathname } = useLocation()

  const tabs = [
    { to: '/',         icon: Home,         label: 'Home'     },
    { to: '/search',   icon: Search,       label: 'Search'   },
    { to: '/wishlist', icon: Heart,        label: 'Wishlist', count: wishlistCount },
    { to: '/cart',     icon: ShoppingCart, label: 'Cart',     count: cartCount     },
    { to: '/account',  icon: User,         label: 'Account'  },
  ]

  const isActive = (to) => {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <>
      {/* Spacer so page content doesn't hide behind nav */}
      <div className="bottom-nav-spacer" style={{ height: 64 }} />

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff',
        borderTop: '1px solid #f1f5f9',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center',
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }} className="bottom-nav">

        {tabs.map(({ to, icon: Icon, label, count }) => {
          const active = isActive(to)
          return (
            <Link key={to} to={to} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', position: 'relative',
              padding: '8px 0', gap: 3,
            }}>
              {/* Active indicator pill */}
              {active && (
                <motion.div
                  layoutId="bottomNavPill"
                  style={{
                    position: 'absolute', top: 0,
                    width: 36, height: 3, borderRadius: '0 0 4px 4px',
                    background: '#C9A84C',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon with badge */}
              <div style={{ position: 'relative' }}>
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon
                    size={22}
                    color={active ? '#C9A84C' : '#94a3b8'}
                    fill={active && (to === '/wishlist') ? '#C9A84C' : 'none'}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </motion.div>

                {/* Badge */}
                <AnimatePresence>
                  {count > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        position: 'absolute', top: -6, right: -8,
                        background: '#ef4444', color: '#fff',
                        fontSize: 9, fontWeight: 800,
                        minWidth: 16, height: 16,
                        borderRadius: 8, padding: '0 4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1.5px solid #fff',
                      }}
                    >
                      {count > 99 ? '99+' : count}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? '#C9A84C' : '#94a3b8',
                letterSpacing: '0.02em',
              }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Only show on mobile */}
      <style>{`
        .bottom-nav { display: none !important; }
        .bottom-nav-spacer { display: none !important; }
        @media (max-width: 768px) {
          .bottom-nav { display: flex !important; }
          .bottom-nav-spacer { display: block !important; }
        }
      `}</style>
    </>
  )
}
