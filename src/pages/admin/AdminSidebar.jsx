import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, Users, Eye, LogOut, X, TrendingUp } from 'lucide-react'

const NAV = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/analytics',  icon: TrendingUp,      label: 'Analytics' },
  { to: '/admin/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products',   icon: Package,          label: 'Products' },
  { to: '/admin/users',      icon: Users,            label: 'Users' },
]

export default function AdminSidebar({ onClose }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div style={{ width: 220, background: '#0f172a', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#C9A84C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16, color: '#0f172a', flexShrink: 0 }}>P</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1 }}>PREMIA</div>
              <div style={{ fontSize: 8, color: '#334155', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>Admin Panel</div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose}
              style={{ border: 'none', background: 'none', color: '#475569', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 12px', margin: '0 0 8px' }}>
          Menu
        </p>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 3, textDecoration: 'none', transition: 'all 0.15s',
                background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: isActive ? '#C9A84C' : '#475569',
                fontWeight: isActive ? 700 : 500, fontSize: 13 }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' } }}>
              <Icon size={16} />
              {label}
              {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', marginLeft: 'auto', flexShrink: 0 }} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#475569', fontSize: 13, fontWeight: 500, marginBottom: 4, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
          <Eye size={16} /> View Store ↗
        </Link>
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}
