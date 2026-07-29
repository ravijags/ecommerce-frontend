import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:    { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped:    { bg: '#ede9fe', text: '#5b21b6' },
  delivered:  { bg: '#dcfce7', text: '#15803d' },
  cancelled:  { bg: '#fee2e2', text: '#991b1b' },
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success('Status updated')
        setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
      } else {
        toast.error('Failed to update status')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">

      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="p-2 rounded-xl transition-all" style={{ color: '#64748b' }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black" style={{ color: '#0f172a' }}>Manage Orders</h1>
        <span className="text-sm px-2.5 py-0.5 rounded-full font-semibold ml-1" style={{ background: '#f1f5f9', color: '#64748b' }}>
          {orders.length} total
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid #e2e8f0' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Order ID', 'Customer', 'Amount', 'Payment', 'Status', 'Update'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono font-bold" style={{ color: '#0f172a' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                        {order.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs" style={{ color: '#94a3b8' }}>{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold" style={{ color: '#0f172a' }}>
                        ₹{order.totalAmount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{
                        background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: order.paymentStatus === 'paid' ? '#15803d' : '#92400e',
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: sc.bg, color: sc.text }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="text-xs rounded-lg px-2 py-1.5 border outline-none"
                          style={{ borderColor: '#e2e8f0', color: '#0f172a', background: '#f8fafc', cursor: 'pointer' }}
                        >
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: '#94a3b8' }}>No orders yet</p>
          </div>
        )}
      </motion.div>
    </main>
  )
}

export default AdminOrders
