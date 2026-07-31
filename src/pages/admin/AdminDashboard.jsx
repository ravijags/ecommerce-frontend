import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Users, TrendingUp, Package, ArrowUpRight, Clock, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-2xl p-6 bg-white" style={{ border: '1px solid #e2e8f0' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a' }}>↑ Live</span>
      </div>
      <p className="text-3xl font-black mb-1" style={{ color: '#0f172a' }}>{value}</p>
      <p className="text-sm font-medium" style={{ color: '#64748b' }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{sub}</p>}
    </motion.div>
  )
}

export default function AdminDashboard() {
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
  const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const STATUS = {
    pending:    { color: '#f59e0b', bg: '#fef3c7' },
    processing: { color: '#3b82f6', bg: '#dbeafe' },
    shipped:    { color: '#8b5cf6', bg: '#ede9fe' },
    delivered:  { color: '#22c55e', bg: '#dcfce7' },
    cancelled:  { color: '#ef4444', bg: '#fee2e2' },
  }

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} sub={`${pending} pending`} color="#3b82f6" delay={0} />
        <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${revenue.toLocaleString()}`} sub="From paid orders" color="#C9A84C" delay={0.05} />
        <StatCard icon={Users} label="Customers" value={users.length} sub="Registered accounts" color="#22c55e" delay={0.1} />
        <StatCard icon={Package} label="Delivered" value={delivered} sub={`${cancelled} cancelled`} color="#8b5cf6" delay={0.15} />
      </div>

      {/* Status breakdown + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Order breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <h2 className="font-black mb-4" style={{ color: '#0f172a' }}>Order Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', count: pending, icon: Clock, color: '#f59e0b' },
              { label: 'Delivered', count: delivered, icon: CheckCircle, color: '#22c55e' },
              { label: 'Cancelled', count: cancelled, icon: XCircle, color: '#ef4444' },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#f8fafc' }}>
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color }} />
                  <span className="text-sm font-medium" style={{ color: '#475569' }}>{label}</span>
                </div>
                <span className="text-sm font-black" style={{ color: '#0f172a' }}>{count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 rounded-2xl p-6 bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black" style={{ color: '#0f172a' }}>Recent Orders</h2>
            <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#C9A84C' }}>
              View all <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm text-center py-8" style={{ color: '#94a3b8' }}>No orders yet</p>}
            {recent.map(order => {
              const s = STATUS[order.status] || STATUS.pending
              return (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl transition-all" style={{ background: '#f8fafc' }}>
                  <div>
                    <p className="text-xs font-mono font-bold" style={{ color: '#0f172a' }}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{order.user?.email || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black" style={{ color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString()}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: s.bg, color: s.color }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
