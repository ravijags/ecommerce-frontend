import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, LogOut, ExternalLink, TrendingUp, Users } from 'lucide-react'
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

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="flex min-h-screen" style={{ background: '#f1f5f9' }}>

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col sticky top-0 h-screen" style={{ background: '#0f172a' }}>

        {/* Logo area */}
        <div className="px-6 py-5 border-b" style={{ borderColor: '#1e293b' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: '#C9A84C', color: '#0f172a' }}>P</div>
            <div>
              <p className="font-black text-sm leading-none" style={{ color: '#fff' }}>PREMIA</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest px-3 mb-3" style={{ color: '#334155' }}>Main Menu</p>
          {NAV.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact)
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? '#C9A84C18' : 'transparent',
                  color: active ? '#C9A84C' : '#64748b',
                  borderLeft: active ? '3px solid #C9A84C' : '3px solid transparent',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: '#1e293b' }}>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <ExternalLink size={16} />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full"
            style={{ color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
          <div>
            <h1 className="text-lg font-black" style={{ color: '#0f172a' }}>
              {location.pathname === '/admin' && 'Dashboard'}
              {location.pathname === '/admin/orders' && 'Orders'}
              {location.pathname === '/admin/products' && 'Products'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
              PREMIA Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#C9A84C', color: '#0f172a' }}>A</div>
            <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>Admin</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
