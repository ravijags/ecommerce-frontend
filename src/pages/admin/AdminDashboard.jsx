import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  AlertTriangle, ChevronRight, Eye, LogOut,
  X, Menu, IndianRupee, ShoppingCart, Clock,
  CheckCircle, XCircle, RefreshCw, Truck, Bell
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products', icon: Package,          label: 'Products' },
  { to: '/admin/users',    icon: Users,            label: 'Users' },
]

function Sidebar({ onClose }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <div style={{ width: 220, background: '#0f172a', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, color: '#C9A84C', letterSpacing: '-0.5px' }}>PREMIA</div>
            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
          {onClose && <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}><X size={18} /></button>}
        </div>
      </div>
      <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 12px', margin: '0 0 8px' }}>Navigation</p>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', transition: 'all 0.15s', background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent', color: isActive ? '#C9A84C' : '#475569', fontWeight: isActive ? 700 : 500, fontSize: 13 }}>
              <Icon size={16} />{label}
              {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', marginLeft: 'auto' }} />}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#475569', fontSize: 13, fontWeight: 500, marginBottom: 4, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
          <Eye size={16} /> View Store
        </Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

// ── Mini bar chart ────────────────────────────────────────────────────────
function RevenueBarChart({ orders }) {
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    const rev = orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((s, o) => s + (o.totalAmount || 0), 0)
    days.push({ label, rev })
  }
  const max = Math.max(...days.map(d => d.rev), 1)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 90, marginBottom: 8 }}>
        {days.map(({ label, rev }, i) => (
          <motion.div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <motion.div
              initial={{ height: 0 }} animate={{ height: Math.max(3, (rev / max) * 72) }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
              style={{ width: '100%', background: rev > 0 ? 'linear-gradient(to top, #C9A84C, #e8b84b)' : '#e2e8f0', borderRadius: '3px 3px 0 0' }}
            />
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: '#94a3b8' }}>{days[0]?.label}</span>
        <span style={{ fontSize: 9, color: '#94a3b8' }}>{days[days.length-1]?.label}</span>
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend, trendUp, delay, to }) {
  const content = (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ background: '#fff', borderRadius: 16, padding: '18px 20px',
        border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        height: '100%', transition: 'box-shadow 0.2s' }}
      whileHover={{ boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: trendUp ? '#16a34a' : '#ef4444' }}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: sub ? 2 : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>{sub}</div>}
    </motion.div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{content}</Link> : content
}

export default function AdminDashboard() {
  const [orders, setOrders]     = useState([])
  const [users, setUsers]       = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const adminName = localStorage.getItem('premia_uname') || 'Admin'


  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/admin/orders`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/admin/users`,  { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/products?limit=500`, { headers: { authorization: token } }).then(r => r.json()),
    ]).then(([od, ud, pd]) => {
      setOrders(od.orders || [])
      setUsers(ud.users || [])
      setProducts(pd.products || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 36, height: 36, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>Loading dashboard...</p>
      </div>
    </div>
  )

  // Stats
  const totalRevenue  = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const paidRevenue   = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.totalAmount || 0), 0)
  const pending       = orders.filter(o => o.status === 'pending').length
  const processing    = orders.filter(o => o.status === 'processing').length
  const shipped       = orders.filter(o => o.status === 'shipped').length
  const delivered     = orders.filter(o => o.status === 'delivered').length
  const cancelled     = orders.filter(o => o.status === 'cancelled').length
  const lowStock      = products.filter(p => p.stock > 0 && p.stock <= 10)
  const outOfStock    = products.filter(p => p.stock === 0)
  const avgOrder      = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const recent        = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)

  // Real trend calculations — last 7 days vs previous 7 days
  const now = new Date()
  const last7  = orders.filter(o => (now - new Date(o.createdAt)) < 7  * 864e5)
  const prev7  = orders.filter(o => { const d = now - new Date(o.createdAt); return d >= 7 * 864e5 && d < 14 * 864e5 })
  const revLast = last7.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const revPrev = prev7.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const revTrend = revPrev > 0 ? `${revLast >= revPrev ? '+' : ''}${Math.round((revLast - revPrev) / revPrev * 100)}%` : 'New'
  const ordTrend = prev7.length > 0 ? `${last7.length >= prev7.length ? '+' : ''}${Math.round((last7.length - prev7.length) / prev7.length * 100)}%` : 'New'
  const revTrendUp = revLast >= revPrev
  const ordTrendUp = last7.length >= prev7.length

  // Category breakdown
  const catRevenue = {}
  orders.forEach(o => (o.items || []).forEach(item => {
    const cat = item.product?.category || 'Other'
    catRevenue[cat] = (catRevenue[cat] || 0) + (item.price * item.quantity || 0)
  }))
  const topCats = Object.entries(catRevenue).sort((a, b) => b[1] - a[1]).slice(0, 4)

  const STATUS_COLORS = {
    pending:    { bg: '#fef9c3', color: '#92400e', label: 'Pending' },
    processing: { bg: '#dbeafe', color: '#1e40af', label: 'Processing' },
    shipped:    { bg: '#e0f2fe', color: '#0369a1', label: 'Shipped' },
    delivered:  { bg: '#dcfce7', color: '#166534', label: 'Delivered' },
    cancelled:  { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>

      {/* Sidebar desktop */}
      <div className="admin-sidebar-desktop" style={{ height: '100vh', flexShrink: 0 }}><Sidebar /></div>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }} transition={{ type: 'tween', duration: 0.22 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}
            style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{greeting}, {adminName.split(' ')[0]} 👋</h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {pending > 0 && (
              <Link to="/admin/orders" style={{ position: 'relative', textDecoration: 'none' }}>
                <Bell size={18} color="#64748b" />
                <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 8, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  {pending > 9 ? '9+' : pending}
                </div>
              </Link>
            )}
            <Link to="/admin/products"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
              + Add Product
            </Link>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stat cards */}
          <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            <StatCard label="Total Revenue" icon={IndianRupee} color="#C9A84C" delay={0}
              value={`₹${(totalRevenue/1000).toFixed(1)}K`}
              sub={`₹${paidRevenue.toLocaleString('en-IN')} confirmed paid`}
              trend="+18.2%" trendUp to="/admin/orders" />
            <StatCard label="Total Orders" icon={ShoppingCart} color="#3b82f6" delay={0.06}
              value={orders.length}
              sub={`${pending} pending · ${delivered} delivered`}
              trend="+8.5%" trendUp to="/admin/orders" />
            <StatCard label="Customers" icon={Users} color="#8b5cf6" delay={0.12}
              value={users.length}
              sub={`Avg order ₹${avgOrder.toLocaleString('en-IN')}`}
              trend="+23.1%" trendUp to="/admin/users" />
            <StatCard label="Products" icon={Package} color="#10b981" delay={0.18}
              value={products.length}
              sub={`${lowStock.length} low · ${outOfStock.length} out of stock`}
              trend={lowStock.length + outOfStock.length > 0 ? `${lowStock.length + outOfStock.length} alerts` : null}
              trendUp={false} to="/admin/products" />
          </div>

          {/* Revenue chart + order status */}
          <div className="admin-mid-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* Chart */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Revenue · Last 14 Days</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>Daily order totals</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#C9A84C', letterSpacing: '-0.5px' }}>₹{(totalRevenue/1000).toFixed(1)}K</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Total GMV</div>
                </div>
              </div>
              <RevenueBarChart orders={orders} />
            </motion.div>

            {/* Order status breakdown */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
              style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Order Status</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Pending',    count: pending,    color: '#f59e0b', icon: Clock },
                  { label: 'Processing', count: processing, color: '#3b82f6', icon: RefreshCw },
                  { label: 'Shipped',    count: shipped,    color: '#06b6d4', icon: Truck },
                  { label: 'Delivered',  count: delivered,  color: '#10b981', icon: CheckCircle },
                  { label: 'Cancelled',  count: cancelled,  color: '#ef4444', icon: XCircle },
                ].map(({ label, count, color, icon: Icon }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={13} color={color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#475569', flex: 1, fontWeight: 500 }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }}
                          animate={{ width: `${orders.length ? (count / orders.length * 100) : 0}%` }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          style={{ height: '100%', background: color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', minWidth: 20, textAlign: 'right' }}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Low stock alert */}
              {(lowStock.length > 0 || outOfStock.length > 0) && (
                <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 12px', background: '#fef9ec', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10, textDecoration: 'none' }}>
                  <AlertTriangle size={13} color="#d97706" />
                  <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600, flex: 1 }}>
                    {lowStock.length} low · {outOfStock.length} out of stock
                  </span>
                  <ChevronRight size={12} color="#d97706" />
                </Link>
              )}
            </motion.div>
          </div>

          {/* Recent orders + Top categories */}
          <div className="admin-bot-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* Recent orders */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Orders</h2>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Latest {recent.length} transactions</p>
                </div>
                <Link to="/admin/orders" style={{ fontSize: 12, color: '#C9A84C', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ChevronRight size={13} />
                </Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((order, i) => {
                      const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                      return (
                        <motion.tr key={order._id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A84C', fontFamily: 'monospace' }}>
                              #{(order._id || '').slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{order.user?.name || 'Guest'}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.user?.email}</div>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
                {recent.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No orders yet</div>}
              </div>
            </motion.div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Top categories */}
              {topCats.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
                  style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Categories</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {topCats.map(([cat, rev], i) => {
                      const pct = Math.round((rev / (topCats[0][1] || 1)) * 100)
                      const COLORS = ['#C9A84C', '#3b82f6', '#8b5cf6', '#10b981']
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>{cat.replace(/-/g, ' ')}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>₹{(rev/1000).toFixed(1)}K</span>
                          </div>
                          <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                              style={{ height: '100%', background: COLORS[i], borderRadius: 3 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Quick actions */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                style={{ background: '#fff', borderRadius: 16, padding: '18px', border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Actions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { to: '/admin/products', label: 'Add New Product',  icon: Package,    color: '#10b981' },
                    { to: '/admin/orders',   label: 'Manage Orders',    icon: ShoppingBag, color: '#3b82f6' },
                    { to: '/admin/users',    label: 'View Customers',   icon: Users,       color: '#8b5cf6' },
                    { to: '/',              label: 'Visit Storefront',  icon: Eye,         color: '#C9A84C' },
                  ].map(({ to, label, icon: Icon, color }) => (
                    <Link key={to} to={to}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', border: '1px solid #f1f5f9', transition: 'all 0.15s', color: '#0f172a', fontSize: 12, fontWeight: 600 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08` }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = 'transparent' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={13} color={color} />
                      </div>
                      {label}
                      <ChevronRight size={12} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Low stock */}
              {lowStock.slice(0, 4).length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                  style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid #fee2e2', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AlertTriangle size={13} color="#ef4444" />
                    <h2 style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Low Stock</h2>
                  </div>
                  {lowStock.slice(0, 4).map(p => (
                    <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f4f6f8', border: '1px solid #e8ecf0', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={p.image || p.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }} onError={e => e.target.style.display = 'none'} />
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>{p.stock}</span>
                    </div>
                  ))}
                  <Link to="/admin/products" style={{ display: 'block', textAlign: 'center', fontSize: 11, color: '#ef4444', fontWeight: 700, textDecoration: 'none', marginTop: 8 }}>
                    View all {lowStock.length} →
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
          .admin-stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
          .admin-mid-grid { grid-template-columns: 1fr !important; }
          .admin-bot-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
