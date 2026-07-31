import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Users, TrendingUp, Package, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import AdminLayout from './AdminLayout'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers: { authorization: token } }).then(r => r.json()),
    ]).then(([od, ud]) => {
      setOrders(od.orders || [])
      setUsers(ud.users || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0)
  const pending = orders.filter(o => o.status === 'pending').length
  const delivered = orders.filter(o => o.status === 'delivered').length
  const cancelled = orders.filter(o => o.status === 'cancelled').length
  const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

  const STATUS_COLOR = {
    pending: { color: '#d97706', bg: '#fef3c7' },
    processing: { color: '#2563eb', bg: '#dbeafe' },
    shipped: { color: '#7c3aed', bg: '#ede9fe' },
    delivered: { color: '#16a34a', bg: '#dcfce7' },
    cancelled: { color: '#dc2626', bg: '#fee2e2' },
  }

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #C9A84C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: ShoppingBag, label: 'Total Orders', value: orders.length, sub: `${pending} pending`, color: '#3b82f6' },
          { icon: TrendingUp, label: 'Revenue', value: `₹${revenue.toLocaleString()}`, sub: 'From paid orders', color: '#C9A84C' },
          { icon: Users, label: 'Customers', value: users.length, sub: 'Registered', color: '#22c55e' },
          { icon: Package, label: 'Delivered', value: delivered, sub: `${cancelled} cancelled`, color: '#8b5cf6' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        {/* Breakdown */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Order Breakdown</h3>
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
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.length === 0 && <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>No orders yet</p>}
            {recent.map(order => {
              const s = STATUS_COLOR[order.status] || STATUS_COLOR.pending
              return (
                <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{order.user?.email || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString()}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color }}>{order.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
