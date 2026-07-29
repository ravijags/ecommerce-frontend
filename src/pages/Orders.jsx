import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  pending:    { icon: Clock,         color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
  processing: { icon: Package,       color: '#3b82f6', bg: '#dbeafe', label: 'Processing' },
  shipped:    { icon: Truck,         color: '#8b5cf6', bg: '#ede9fe', label: 'Shipped' },
  delivered:  { icon: CheckCircle,   color: '#22c55e', bg: '#dcfce7', label: 'Delivered' },
  cancelled:  { icon: XCircle,       color: '#ef4444', bg: '#fee2e2', label: 'Cancelled' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { authorization: token } })
      .then(res => res.json())
      .then(data => { setOrders(data.order || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#0f172a' }}>My Orders</h1>
        <Link to="/" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#C9A84C' }}>
          Shop more <ChevronRight size={14} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-16 text-center"
          style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#f1f5f9' }}>
            <ShoppingBag size={36} style={{ color: '#cbd5e1' }} />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: '#0f172a' }}>No orders yet</h2>
          <p className="mb-8" style={{ color: '#64748b' }}>Your order history will appear here once you shop.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: '#0f172a', color: '#fff' }}>
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #e2e8f0' }}
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#94a3b8' }}>
                    Order ID
                  </p>
                  <p className="text-sm font-mono font-bold" style={{ color: '#0f172a' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: '#475569' }}>
                      <Package size={13} style={{ color: '#94a3b8' }} />
                      {item.product ? item.product.name : 'Product'}
                      <span className="font-medium" style={{ color: '#94a3b8' }}>×{item.quantity}</span>
                    </span>
                    <span className="font-semibold" style={{ color: '#0f172a' }}>₹{item.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                      color: order.paymentStatus === 'paid' ? '#15803d' : '#92400e',
                    }}
                  >
                    {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending Payment'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-0.5" style={{ color: '#94a3b8' }}>Total</p>
                  <p className="text-lg font-black" style={{ color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Orders
