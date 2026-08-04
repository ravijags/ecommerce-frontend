import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, ExternalLink, TrendingUp, Bell, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/users', icon: Users, label: 'Users' },
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out!')
    navigate('/login')
  }

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname === to

  const PAGE_TITLE = {
    '/admin': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/products': 'Products',
    '/admin/users': 'Users',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          className="admin-overlay" />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'transform 0.25s',
      }} className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        {/* Logo */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#0f172a', flexShrink: 0 }}>P</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, color: '#fff', lineHeight: 1 }}>PREMIA</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '6px 10px 10px' }}>
            Main Menu
          </div>
          {NAV.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact)
            return (
              <Link key={to} to={to} onClick={() => setSidebarOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8, marginBottom: 2,
                textDecoration: 'none', fontSize: 13, fontWeight: active ? 700 : 500,
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: active ? '#C9A84C' : '#64748b',
                borderLeft: `3px solid ${active ? '#C9A84C' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #1e293b' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, marginBottom: 2, textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#64748b', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <ExternalLink size={15} /> View Store
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#64748b', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: 220 }} className="admin-content">

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Mobile menu button */}
            <button onClick={() => setSidebarOpen(s => !s)} className="admin-menu-btn"
              style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: 'none', background: '#f1f5f9', borderRadius: 8, cursor: 'pointer' }}>
              <div style={{ width: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[0,1,2].map(i => <div key={i} style={{ height: 2, background: '#64748b', borderRadius: 1 }} />)}
              </div>
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{PAGE_TITLE[location.pathname] || 'Admin'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#0f172a' }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>Admin</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        <main style={{ flex: 1, padding: '28px 28px 40px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.sidebar-open { transform: translateX(0); }
          .admin-content { margin-left: 0 !important; }
          .admin-menu-btn { display: flex !important; }
          .admin-overlay { display: block; }
        }
        @media (min-width: 769px) {
          .admin-overlay { display: none; }
        }
      `}</style>
    </div>
  )
}
