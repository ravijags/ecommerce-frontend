import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, LogOut, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out!')
    navigate('/login')
  }

  const isActive = (to, exact) =>
    exact ? location.pathname === to : location.pathname === to

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: '#0f172a',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: '#C9A84C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16, color: '#0f172a'
            }}>P</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 13, color: '#fff', lineHeight: 1 }}>PREMIA</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '8px 10px 10px' }}>
            Main Menu
          </div>
          {NAV.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact)
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8, marginBottom: 2,
                textDecoration: 'none', fontSize: 13, fontWeight: 500,
                background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: active ? '#C9A84C' : '#64748b',
                borderLeft: `3px solid ${active ? '#C9A84C' : 'transparent'}`,
                transition: 'all 0.15s'
              }}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #1e293b' }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 8, marginBottom: 2,
            textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#64748b'
          }}>
            <ExternalLink size={15} /> View Store
          </Link>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 8, width: '100%',
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: '#64748b'
          }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>
              {location.pathname === '/admin' && 'Dashboard'}
              {location.pathname === '/admin/orders' && 'Orders'}
              {location.pathname === '/admin/products' && 'Products'}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 10,
            background: '#f8fafc', border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#C9A84C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 12, color: '#0f172a'
            }}>A</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Admin</span>
          </div>
        </div>

        <main style={{ flex: 1, padding: 32 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
