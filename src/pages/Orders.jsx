import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag, ArrowLeft, Printer, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending:    { icon: Clock,       color: '#d97706', bg: '#fef3c7', label: 'Pending',    step: 0 },
  processing: { icon: Package,     color: '#2563eb', bg: '#dbeafe', label: 'Processing', step: 1 },
  shipped:    { icon: Truck,       color: '#7c3aed', bg: '#ede9fe', label: 'Shipped',    step: 2 },
  delivered:  { icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', label: 'Delivered',  step: 3 },
  cancelled:  { icon: XCircle,     color: '#dc2626', bg: '#fee2e2', label: 'Cancelled',  step: -1 },
}

const TIMELINE_STEPS = [
  { label: 'Order Placed',  icon: ShoppingBag, step: 0 },
  { label: 'Processing',    icon: Package,     step: 1 },
  { label: 'Shipped',       icon: Truck,       step: 2 },
  { label: 'Delivered',     icon: CheckCircle, step: 3 },
]

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
      <Icon size={12} /> {cfg.label}
    </span>
  )
}

function OrderTimeline({ status }) {
  if (status === 'cancelled') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0' }}>
      <XCircle size={18} color="#dc2626" />
      <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>Order Cancelled</span>
    </div>
  )
  const currentStep = STATUS_CONFIG[status]?.step ?? 0
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, padding: '16px 0 8px', overflowX: 'auto' }}>
      {TIMELINE_STEPS.map(({ label, icon: Icon, step }, i) => {
        const done = currentStep >= step
        const active = currentStep === step
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 72 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#0f172a' : '#f1f5f9',
                border: active ? '3px solid #C9A84C' : done ? '3px solid #0f172a' : '3px solid #e2e8f0',
                transition: 'all 0.3s',
              }}>
                <Icon size={15} color={done ? '#fff' : '#94a3b8'} />
              </div>
              <span style={{ fontSize: 10, fontWeight: done ? 700 : 500, color: done ? '#0f172a' : '#94a3b8', marginTop: 6, textAlign: 'center', lineHeight: 1.3 }}>
                {label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 3, background: currentStep > step ? '#0f172a' : '#e2e8f0', margin: '0 4px', marginBottom: 20, minWidth: 20, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setOrders(d.order || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { authorization: token },
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o))
        toast.success('Order cancelled')
      } else {
        toast.error('Cannot cancel this order')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  const printInvoice = (order) => {
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Invoice #${order._id.slice(-8).toUpperCase()}</title>
      <style>
        body { font-family: Inter, sans-serif; padding: 40px; color: #0f172a; max-width: 600px; margin: 0 auto; }
        h1 { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0 0 4px; }
        .gold { color: #C9A84C; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th { background: #f8fafc; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .total { font-size: 18px; font-weight: 900; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
      </style></head><body>
      <h1>PREMIA<span class="gold">.</span></h1>
      <p style="color:#64748b;margin:0 0 24px">Tax Invoice / Bill of Supply</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:24px">
        <div><strong>Order ID:</strong> #${order._id.slice(-8).toUpperCase()}<br>
        <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        <strong>Status:</strong> ${order.status}</div>
        <div style="text-align:right"><strong>Sold by:</strong><br>PREMIA Official Store<br>New Delhi, India<br>support@premia.in</div>
      </div>
      <table>
        <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
        ${(order.items || []).map(i => `<tr><td>${i.product?.name || 'Product'}</td><td>${i.quantity || 1}</td><td>₹${i.price?.toLocaleString('en-IN')}</td></tr>`).join('')}
        <tr><td colspan="2" style="text-align:right"><strong>Total</strong></td><td class="total">₹${order.totalAmount?.toLocaleString('en-IN')}</td></tr>
      </table>
      <div class="footer">Thank you for shopping with PREMIA. For support: support@premia.in | 1800-PREMIA</div>
      </body></html>
    `)
    win.document.close()
    win.print()
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Orders</h1>
        <Link to="/" style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Shop more <ChevronRight size={14} />
        </Link>
      </div>

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
            <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden' }}>

              {/* Order header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Order ID</p>
                  <p style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', color: '#0f172a', margin: 0 }}>#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 6px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Timeline */}
              <div style={{ padding: '0 18px' }}>
                <OrderTimeline status={order.status} />
              </div>

              {/* Items - collapsible */}
              <div style={{ padding: '0 18px' }}>
                <button onClick={() => toggleExpand(order._id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#64748b', width: '100%' }}>
                  {expanded[order._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {expanded[order._id] ? 'Hide' : 'Show'} {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                </button>
                <AnimatePresence>
                  {expanded[order._id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12 }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                              <Package size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: 13, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.product?.name || 'Product (unavailable)'}
                              </span>
                              <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>×{item.quantity || 1}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', flexShrink: 0, marginLeft: 8 }}>
                              ₹{item.price?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7', color: order.paymentStatus === 'paid' ? '#15803d' : '#92400e' }}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending Payment'}
                  </span>
                  <button onClick={() => printInvoice(order)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    <Printer size={11} /> Invoice
                  </button>
                  {['pending', 'processing'].includes(order.status) && (
                    <button onClick={() => cancelOrder(order._id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      <XCircle size={11} /> Cancel
                    </button>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px' }}>Total</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
