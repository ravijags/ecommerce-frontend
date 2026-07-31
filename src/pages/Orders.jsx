import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  pending:    { icon: Clock,       color: '#d97706', bg: '#fef3c7', label: 'Pending' },
  processing: { icon: Package,     color: '#2563eb', bg: '#dbeafe', label: 'Processing' },
  shipped:    { icon: Truck,       color: '#7c3aed', bg: '#ede9fe', label: 'Shipped' },
  delivered:  { icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', label: 'Delivered' },
  cancelled:  { icon: XCircle,     color: '#dc2626', bg: '#fee2e2', label: 'Cancelled' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20, fontSize: 11,
      fontWeight: 700, background: cfg.bg, color: cfg.color
    }}>
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
      .then(r => r.json())
      .then(d => { setOrders(d.order || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #C9A84C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Orders</h1>
        <Link to="/" style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Shop more <ChevronRight size={14} />
        </Link>
      </div>

      {/* Empty */}
      {orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShoppingBag size={34} color="#cbd5e1" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>No orders yet</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>Your order history will appear here.</p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.map((order, i) => (
            <motion.div key={order._id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>

              {/* Order header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Order ID</p>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', margin: 0 }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 5px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', minWidth: 0 }}>
                      <Package size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product?.name || `Item #${String(idx + 1).padStart(3, '0')}`}
                      </span>
                      <span style={{ color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>×{item.quantity}</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', flexShrink: 0, marginLeft: 8 }}>
                      ₹{item.price?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                  background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                  color: order.paymentStatus === 'paid' ? '#15803d' : '#92400e'
                }}>
                  {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending Payment'}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px' }}>Total</p>
                  <p style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: 0 }}>₹{order.totalAmount?.toLocaleString()}</p>
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
