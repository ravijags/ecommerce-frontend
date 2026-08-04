import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Users, TrendingUp, Package, ArrowUpRight, Clock, CheckCircle, XCircle, IndianRupee, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

function StatCard({ icon: Icon, label, value, sub, color, delay, to }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {to && (
          <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
            View <ArrowUpRight size={12} />
          </Link>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </motion.div>
  )
}

// Mini bar chart using divs
function RevenueChart({ orders }) {
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dayStr = d.toLocaleDateString('en-IN', { weekday: 'short' })
    const rev = orders.filter(o => {
      const od = new Date(o.createdAt)
      return od.toDateString() === d.toDateString() && o.paymentStatus === 'paid'
    }).reduce((s, o) => s + o.totalAmount, 0)
    last7.push({ day: dayStr, rev })
  }
  const max = Math.max(...last7.map(d => d.rev), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, padding: '0 4px' }}>
      {last7.map(({ day, rev }, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', height: Math.max(4, (rev / max) * 70), background: rev > 0 ? '#C9A84C' : '#e2e8f0', borderRadius: '4px 4px 0 0', transition: 'height 0.5s' }} />
          <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{day}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`, { headers: { authorization: token } }).then(r => r.json()),
    ]).then(([od, ud, pd]) => {
      setOrders(od.orders || [])
      setUsers(ud.users || [])
      setProducts(pd.products || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0)
  const pending = orders.filter(o => o.status === 'pending').length
  const delivered = orders.filter(o => o.status === 'delivered').length
  const cancelled = orders.filter(o => o.status === 'cancelled').length
  const lowStock = products.filter(p => p.stock < 10).length
  const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const STATUS = {
    pending:    { color: '#d97706', bg: '#fef3c7' },
    processing: { color: '#2563eb', bg: '#dbeafe' },
    shipped:    { color: '#7c3aed', bg: '#ede9fe' },
    delivered:  { color: '#16a34a', bg: '#dcfce7' },
    cancelled:  { color: '#dc2626', bg: '#fee2e2' },
  }

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="admin-stats-grid">
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} sub={`${pending} pending`} color="#3b82f6" delay={0} to="/admin/orders" />
        <StatCard icon={TrendingUp} label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} sub="From paid orders" color="#C9A84C" delay={0.06} />
        <StatCard icon={Users} label="Customers" value={users.length} sub="Registered accounts" color="#22c55e" delay={0.12} to="/admin/users" />
        <StatCard icon={Package} label="Products" value={products.length} sub={lowStock > 0 ? `${lowStock} low stock` : 'All stocked'} color={lowStock > 0 ? '#ef4444' : '#8b5cf6'} delay={0.18} to="/admin/products" />
      </div>

      {/* Revenue chart + order breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }} className="admin-mid-grid">

        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Revenue (Last 7 days)</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Paid orders only</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#C9A84C' }}>₹{revenue.toLocaleString('en-IN')}</div>
          </div>
          <RevenueChart orders={orders} />
        </motion.div>

        {/* Order breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 16 }}>Order Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Pending', count: pending, Icon: Clock, color: '#d97706' },
              { label: 'Delivered', count: delivered, Icon: CheckCircle, color: '#16a34a' },
              { label: 'Cancelled', count: cancelled, Icon: XCircle, color: '#dc2626' },
            ].map(({ label, count, Icon, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} style={{ color }} />
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{label}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{count}</span>
              </div>
            ))}
          </div>
          {lowStock > 0 && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef3c7', borderRadius: 10, border: '1px solid #fde68a' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', margin: 0 }}>⚠️ {lowStock} product{lowStock > 1 ? 's' : ''} low on stock</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent orders + Recent users */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }} className="admin-bot-grid">

        {/* Recent orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Recent Orders</div>
            <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#C9A84C', textDecoration: 'none', fontWeight: 600 }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.length === 0 && <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No orders yet</p>}
            {recent.map(order => {
              const s = STATUS[order.status] || STATUS.pending
              return (
                <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{order.user?.email || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color }}>{order.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent users */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>New Users</div>
            <Link to="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#C9A84C', textDecoration: 'none', fontWeight: 600 }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentUsers.length === 0 && <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No users yet</p>}
            {recentUsers.map((user, i) => {
              const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
              const color = COLORS[i % COLORS.length]
              const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
              return (
                <div key={user._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'User'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 900px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-mid-grid { grid-template-columns: 1fr !important; }
          .admin-bot-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  )
}
