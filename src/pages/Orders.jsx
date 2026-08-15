import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Package, ChevronDown, ChevronUp, FileText,
  Truck, CheckCircle, Clock, XCircle, RefreshCw,
  ArrowRight, ShoppingBag
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

const STATUS_CONFIG = {
  pending:    { color: '#f59e0b', bg: '#fef9c3', icon: Clock,       label: 'Pending',    step: 0 },
  processing: { color: '#3b82f6', bg: '#dbeafe', icon: RefreshCw,   label: 'Processing', step: 1 },
  shipped:    { color: '#06b6d4', bg: '#e0f2fe', icon: Truck,       label: 'Shipped',    step: 2 },
  delivered:  { color: '#10b981', bg: '#dcfce7', icon: CheckCircle, label: 'Delivered',  step: 3 },
  cancelled:  { color: '#ef4444', bg: '#fee2e2', icon: XCircle,     label: 'Cancelled',  step: -1 },
}

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false)
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const Icon = s.icon
  const isCancelled = order.status === 'cancelled'
  const canCancel = ['pending', 'processing'].includes(order.status)

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Order header */}
      <div style={{ padding: 'clamp(14px,3vw,20px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#C9A84C', fontFamily: 'monospace' }}>#{(order._id||'').slice(-8).toUpperCase()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>
                <Icon size={10} />{s.label}
              </span>
              {order.paymentStatus === 'paid' && (
                <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>✓ Paid</span>
              )}
              {order.paymentStatus !== 'paid' && (
                <span style={{ background: '#fef9c3', color: '#92400e', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>Pending Payment</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'clamp(18px,3vw,22px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>₹{(order.totalAmount||0).toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            {STEPS.map((step, i) => {
              const done = s.step >= i
              const active = s.step === i
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <motion.div animate={{ scale: active ? 1.15 : 1 }}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#C9A84C' : '#f1f5f9', border: `2px solid ${done ? '#C9A84C' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? '0 0 0 3px rgba(201,168,76,0.2)' : 'none', flexShrink: 0 }}>
                      {done ? <CheckCircle size={13} color="#0f172a" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#cbd5e1' }} />}
                    </motion.div>
                    <span style={{ fontSize: 9, fontWeight: done ? 700 : 500, color: done ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', textAlign: 'center' }}>{step}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: s.step > i ? '#C9A84C' : '#f1f5f9', margin: '0 4px', marginBottom: 14, borderRadius: 1 }} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {isCancelled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fef2f2', borderRadius: 10, marginBottom: 14 }}>
            <XCircle size={14} color="#ef4444" />
            <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>This order has been cancelled</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setExpanded(!expanded)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            {expanded ? <><ChevronUp size={13} /> Hide items</> : <><ChevronDown size={13} /> Show {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</>}
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            <FileText size={13} /> Invoice
          </button>
          {canCancel && (
            <button onClick={() => onCancel(order._id)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #fca5a5', background: '#fff', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}>
              <XCircle size={13} /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Expanded items */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: '1px solid #f1f5f9', padding: 'clamp(12px,3vw,20px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(order.items || []).map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Link to={item.product?._id ? `/products/${item.product._id}` : '#'} style={{ flexShrink: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: '#f4f6f8', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
                      {item.product?.image ? (
                        <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} onError={e => e.target.style.display='none'} />
                      ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color="#cbd5e1" /></div>}
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product?.name || 'Product'}
                    </p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Qty: {item.quantity || 1} · ₹{(item.price||0).toLocaleString('en-IN')} each</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                    ₹{((item.price||0) * (item.quantity||1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div style={{ paddingTop: 10, borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>Order Total</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>₹{(order.totalAmount||0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Orders() {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('token')
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetch(`${API}/api/orders`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/cancel`, {
        method: 'PUT', headers: { authorization: token }
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o))
        toast.success('Order cancelled')
      } else toast.error('Could not cancel order')
    } catch { toast.error('Network error') }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const counts = ['pending','processing','shipped','delivered','cancelled'].reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length; return acc
  }, {})

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%' }} />
    </div>
  )

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', padding: 'clamp(20px,4vw,36px) clamp(16px,5vw,24px) 80px', fontFamily: 'Inter, system-ui' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,3.5vw,26px)', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingBag size={22} color="#0f172a" /> My Orders
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{orders.length} total orders</p>
          </div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#C9A84C', fontWeight: 700, textDecoration: 'none' }}>
            Shop more <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {[{ key: 'all', label: `All (${orders.length})` },
            { key: 'pending',    label: `Pending (${counts.pending||0})` },
            { key: 'processing', label: `Processing (${counts.processing||0})` },
            { key: 'shipped',    label: `Shipped (${counts.shipped||0})` },
            { key: 'delivered',  label: `Delivered (${counts.delivered||0})` },
            { key: 'cancelled',  label: `Cancelled (${counts.cancelled||0})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ padding: '7px 14px', borderRadius: 20, border: filter === key ? 'none' : '1px solid #e2e8f0', background: filter === key ? '#0f172a' : '#fff', color: filter === key ? '#fff' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #ebebeb' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{filter === 'all' ? 'No orders yet' : `No ${filter} orders`}</h3>
            <p style={{ color: '#94a3b8', margin: '0 0 24px' }}>
              {filter === 'all' ? 'Place your first order to see it here' : `You have no ${filter} orders`}
            </p>
            <Link to="/" style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 800, boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <AnimatePresence>
              {filtered.map((order, i) => (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <OrderCard order={order} onCancel={handleCancel} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
