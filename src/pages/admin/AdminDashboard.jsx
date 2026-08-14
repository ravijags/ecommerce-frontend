import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users, TrendingUp,
  AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw,
  Star, IndianRupee, ShoppingCart, Eye, LogOut, Settings,
  ChevronRight, Bell, Search, Menu, X
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

// ── Sidebar nav items ─────────────────────────────────────────────────────
const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products', icon: Package,          label: 'Products' },
  { to: '/admin/users',    icon: Users,            label: 'Users' },
]

function Sidebar({ active, onClose }) {
  const navigate = useNavigate()
  return (
    <div style={{ width: 220, background: '#0f172a', height: '100%',
      display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#C9A84C', letterSpacing: '-0.5px' }}>PREMIA</div>
            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#475569', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = window.location.pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 3,
                textDecoration: 'none', transition: 'all 0.15s',
                background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: isActive ? '#C9A84C' : '#475569',
                fontWeight: isActive ? 700 : 500, fontSize: 13,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' } }}>
              <Icon size={16} />
              {label}
              {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C', marginLeft: 'auto' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
          color: '#475569', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
          <Eye size={16} /> View Store
        </Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', borderRadius: 10, border: 'none',
            background: 'transparent', color: '#ef4444', fontSize: 13,
            fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend, trendUp }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', borderRadius: 16, padding: 20,
        border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12,
          background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4,
            color: trendUp ? '#16a34a' : '#ef4444', fontSize: 11, fontWeight: 700 }}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, color: '#0f172a',
        letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{sub}</div>}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]           = useState(null)
  const [orders, setOrders]         = useState([])
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    Promise.all([
      fetch(`${API}/api/admin/orders`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/products?limit=500`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/admin/users`, { headers: { authorization: token } }).then(r => r.json()).catch(() => ({ users: [] })),
    ]).then(([ordersData, productsData, usersData]) => {
      const allOrders   = ordersData.orders || []
      const allProducts = productsData.products || []
      const allUsers    = usersData.users || []

      const totalRevenue = allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
      const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'processing').length
      const lowStock = allProducts.filter(p => p.stock > 0 && p.stock <= 10)

      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        totalUsers: allUsers.length,
        totalProducts: allProducts.length,
        pendingOrders,
        lowStockCount: lowStock.length,
        avgOrderValue: allOrders.length ? Math.round(totalRevenue / allOrders.length) : 0,
      })
      setOrders(allOrders.slice(0, 8))
      setProducts(lowStock.slice(0, 5))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [token])

  const STATUS_COLORS = {
    pending:    { bg: '#fef9c3', color: '#92400e', label: 'Pending' },
    processing: { bg: '#dbeafe', color: '#1e40af', label: 'Processing' },
    shipped:    { bg: '#e0f2fe', color: '#0369a1', label: 'Shipped' },
    delivered:  { bg: '#dcfce7', color: '#166534', label: 'Delivered' },
    cancelled:  { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 36, height: 36, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 12px' }} />
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>

      {/* Sidebar — desktop */}
      <div className="admin-sidebar-desktop" style={{ height: '100vh', overflow: 'hidden' }}>
        <Sidebar active="/admin" />
      </div>

      {/* Sidebar — mobile overlay */}
      {sidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <motion.div initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }}
            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
            <Sidebar active="/admin" onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)',
          height: 60, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}
            style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              Welcome back · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {stats?.pendingOrders > 0 && (
              <div style={{ position: 'relative' }}>
                <Bell size={18} color="#64748b" />
                <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14,
                  borderRadius: '50%', background: '#ef4444', color: '#fff',
                  fontSize: 8, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stats.pendingOrders}
                </div>
              </div>
            )}
            <Link to="/admin/orders"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a',
                padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShoppingBag size={13} /> New Orders
            </Link>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,28px)' }}>

          {/* ── Stat cards ── */}
          <div className="admin-stats-grid" style={{ display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(10px,2vw,16px)', marginBottom: 24 }}>
            <StatCard label="Total Revenue" icon={IndianRupee} color="#C9A84C"
              value={`₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K`}
              sub={`Avg ₹${(stats?.avgOrderValue || 0).toLocaleString('en-IN')}/order`}
              trend="+12.5%" trendUp />
            <StatCard label="Total Orders" icon={ShoppingCart} color="#3b82f6"
              value={stats?.totalOrders || 0}
              sub={`${stats?.pendingOrders || 0} pending`}
              trend="+8.2%" trendUp />
            <StatCard label="Customers" icon={Users} color="#8b5cf6"
              value={stats?.totalUsers || 0}
              sub="Registered users"
              trend="+23.1%" trendUp />
            <StatCard label="Products" icon={Package} color="#10b981"
              value={stats?.totalProducts || 0}
              sub={`${stats?.lowStockCount || 0} low stock`}
              trend={stats?.lowStockCount > 0 ? `${stats.lowStockCount} alerts` : null}
              trendUp={false} />
          </div>

          {/* ── Two column layout ── */}
          <div className="admin-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'clamp(10px,2vw,20px)' }}>

            {/* Recent orders */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Orders</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Latest {orders.length} orders</p>
                </div>
                <Link to="/admin/orders"
                  style={{ fontSize: 12, color: '#C9A84C', fontWeight: 700, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ChevronRight size={13} />
                </Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left',
                          fontSize: 10, fontWeight: 700, color: '#94a3b8',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => {
                      const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                      return (
                        <motion.tr key={order._id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer',
                            transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A84C',
                              fontFamily: 'monospace' }}>
                              #{(order._id || '').slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                              {order.user?.name || 'Guest'}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>
                              {order.user?.email?.slice(0, 18)}...
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                              ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: s.bg, color: s.color,
                              fontSize: 10, fontWeight: 700, padding: '3px 8px',
                              borderRadius: 20, whiteSpace: 'nowrap' }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    No orders yet
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Quick actions */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 18,
                border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px',
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Actions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { to: '/admin/products', label: 'Add New Product', icon: Package, color: '#10b981' },
                    { to: '/admin/orders',   label: 'Manage Orders',   icon: ShoppingBag, color: '#3b82f6' },
                    { to: '/admin/users',    label: 'View Customers',  icon: Users, color: '#8b5cf6' },
                    { to: '/',              label: 'Visit Storefront', icon: Eye, color: '#C9A84C' },
                  ].map(({ to, label, icon: Icon, color }) => (
                    <Link key={to} to={to}
                      style={{ display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                        border: '1px solid #f1f5f9', transition: 'all 0.15s',
                        color: '#0f172a', fontSize: 12, fontWeight: 600 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08` }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = 'transparent' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8,
                        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={14} color={color} />
                      </div>
                      {label}
                      <ChevronRight size={13} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Low stock alerts */}
              {products.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 18,
                  border: '1px solid #fee2e2', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <AlertTriangle size={14} color="#ef4444" />
                    <h2 style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', margin: 0,
                      textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Low Stock ({products.length})
                    </h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.map(p => (
                      <div key={p._id} style={{ display: 'flex', alignItems: 'center',
                        gap: 10, padding: '8px 10px', background: '#fef2f2',
                        borderRadius: 10, border: '1px solid #fecaca' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8,
                          background: '#fff', border: '1px solid #fee2e2',
                          overflow: 'hidden', flexShrink: 0 }}>
                          <img src={p.image || p.thumbnail} alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }}
                            onError={e => { e.target.style.display = 'none' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', margin: 0,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </p>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444',
                          background: '#fff', border: '1px solid #fecaca',
                          padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
                          {p.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/products"
                    style={{ display: 'block', textAlign: 'center', marginTop: 12,
                      fontSize: 12, color: '#ef4444', fontWeight: 700, textDecoration: 'none' }}>
                    Manage inventory →
                  </Link>
                </div>
              )}

              {/* Revenue summary */}
              <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 16,
                padding: 18, border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: '#475569', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  Revenue Overview
                </p>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#C9A84C', letterSpacing: '-1px', marginBottom: 4 }}>
                  ₹{((stats?.totalRevenue || 0) / 1000).toFixed(1)}K
                </div>
                <p style={{ color: '#334155', fontSize: 12, margin: '0 0 16px' }}>Total revenue generated</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { label: 'Orders', value: stats?.totalOrders || 0, color: '#3b82f6' },
                    { label: 'Avg Value', value: `₹${(stats?.avgOrderValue || 0).toLocaleString('en-IN')}`, color: '#10b981' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                      borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
                      <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
          .admin-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .admin-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
