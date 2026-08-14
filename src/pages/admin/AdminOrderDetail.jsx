import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import {
  Menu, ArrowLeft, CheckCircle, Clock, Truck,
  XCircle, RefreshCw, Package, MapPin, Mail,
  Phone, Printer, Download, User
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']
const STATUS_CONFIG = {
  pending:    { color: '#f59e0b', bg: '#fef9c3', icon: Clock,       label: 'Pending' },
  processing: { color: '#3b82f6', bg: '#dbeafe', icon: RefreshCw,   label: 'Processing' },
  shipped:    { color: '#06b6d4', bg: '#e0f2fe', icon: Truck,       label: 'Shipped' },
  delivered:  { color: '#10b981', bg: '#dcfce7', icon: CheckCircle, label: 'Delivered' },
  cancelled:  { color: '#ef4444', bg: '#fee2e2', icon: XCircle,     label: 'Cancelled' },
}

export default function AdminOrderDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`${API}/api/admin/orders`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => {
        const found = (d.orders || []).find(o => o._id === id)
        setOrder(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`${API}/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) setOrder(o => ({ ...o, status: newStatus }))
    } finally { setUpdating(false) }
  }

  const printInvoice = () => window.print()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 32, height: 32, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%' }} />
    </div>
  )

  if (!order) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Order not found</p>
        <Link to="/admin/orders" style={{ color: '#C9A84C', fontWeight: 700, textDecoration: 'none', fontSize: 13 }}>← Back to orders</Link>
      </div>
    </div>
  )

  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const isCancelled = order.status === 'cancelled'
  const currentStep = STATUS_STEPS.indexOf(order.status)
  const subtotal = (order.items || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div className="admin-sidebar-desktop" style={{ height: '100vh', flexShrink: 0 }}><AdminSidebar /></div>

      {sidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <motion.div initial={{ x: -220 }} animate={{ x: 0 }} transition={{ type: 'tween', duration: 0.22 }}
            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link to="/admin" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <Link to="/admin/orders" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>Orders</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 700 }}>#{id.slice(-6).toUpperCase()}</span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={printInvoice}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
              <Printer size={13} /> Print Invoice
            </button>
            <Link to="/admin/orders"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', textDecoration: 'none' }}>
              <ArrowLeft size={13} /> Back
            </Link>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>

            {/* Order header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                  Order #{id.slice(-8).toUpperCase()}
                </h1>
                <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                  {s.label}
                </span>
              </div>
              {/* Status update */}
              {!isCancelled && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STATUS_STEPS.filter(step => step !== order.status).map(step => {
                    const cfg = STATUS_CONFIG[step]
                    return (
                      <motion.button key={step} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => updateStatus(step)} disabled={updating}
                        style={{ padding: '7px 14px', borderRadius: 9, border: `1.5px solid ${cfg.color}40`, background: `${cfg.color}10`, color: cfg.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        Mark {cfg.label}
                      </motion.button>
                    )
                  })}
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => updateStatus('cancelled')} disabled={updating}
                    style={{ padding: '7px 14px', borderRadius: 9, border: '1.5px solid #fca5a5', background: '#fef2f2', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Cancel Order
                  </motion.button>
                </div>
              )}
            </div>

            {/* Order timeline */}
            {!isCancelled && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 16 }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Timeline</h2>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  {/* Progress line */}
                  <div style={{ position: 'absolute', top: 18, left: '6%', right: '6%', height: 3, background: '#f1f5f9', borderRadius: 2, zIndex: 0 }}>
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'linear-gradient(to right, #C9A84C, #e8b84b)', borderRadius: 2 }} />
                  </div>
                  {STATUS_STEPS.map((step, i) => {
                    const cfg = STATUS_CONFIG[step]
                    const Icon = cfg.icon
                    const done = currentStep >= i
                    const active = currentStep === i
                    return (
                      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                        <motion.div
                          animate={{ scale: active ? 1.2 : 1 }}
                          style={{ width: 36, height: 36, borderRadius: '50%', background: done ? '#C9A84C' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${done ? '#C9A84C' : '#e2e8f0'}`, boxShadow: active ? '0 0 0 4px rgba(201,168,76,0.2)' : 'none' }}>
                          <Icon size={16} color={done ? '#0f172a' : '#94a3b8'} />
                        </motion.div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 11, fontWeight: done ? 700 : 500, color: done ? '#0f172a' : '#94a3b8', margin: 0 }}>{cfg.label}</p>
                          {active && <p style={{ fontSize: 9, color: '#C9A84C', margin: 0, fontWeight: 600 }}>Current</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }} className="order-detail-grid">

              {/* Left: Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Order items */}
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Items ({order.items?.length || 0})
                    </h2>
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    {(order.items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', borderBottom: i < order.items.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <div style={{ width: 52, height: 52, borderRadius: 10, background: '#f4f6f8', border: '1px solid #e8ecf0', overflow: 'hidden', flexShrink: 0 }}>
                          {item.product?.image ? (
                            <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} onError={e => e.target.style.display='none'} />
                          ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={18} color="#cbd5e1" /></div>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.product?.name || 'Product (deleted)'}
                          </p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                            ₹{(item.price || 0).toLocaleString('en-IN')} × {item.quantity || 1}
                          </p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment info */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payment Details</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['Subtotal', `₹${subtotal.toLocaleString('en-IN')}`],
                      ['Delivery', order.totalAmount > 999 ? 'FREE' : '₹99'],
                      ['Payment Method', 'Razorpay'],
                      ['Payment Status', order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{k}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: k === 'Payment Status' && order.paymentStatus === 'paid' ? '#16a34a' : '#0f172a' }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Total</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {order.razorpayOrderId && (
                    <div style={{ marginTop: 12, padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px', fontWeight: 700, textTransform: 'uppercase' }}>Razorpay Order ID</p>
                      <p style={{ fontSize: 11, color: '#0f172a', margin: 0, fontFamily: 'monospace' }}>{order.razorpayOrderId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Customer + Shipping */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Customer */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer</h2>
                  {order.user ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#C9A84C', flexShrink: 0 }}>
                          {(order.user.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{order.user.name || 'Customer'}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{order.user.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        <a href={`mailto:${order.user.email}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                          <Mail size={12} /> {order.user.email}
                        </a>
                        <Link to={`/admin/users`}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#C9A84C', textDecoration: 'none', fontWeight: 600, marginTop: 4 }}>
                          <User size={12} /> View customer profile →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: '#94a3b8' }}>Guest order — no account</p>
                  )}
                </div>

                {/* Shipping address */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shipping Address</h2>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <MapPin size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.7 }}>{order.shippingAddress || 'No address provided'}</p>
                  </div>
                </div>

                {/* Order summary */}
                <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Summary</h2>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#C9A84C', letterSpacing: '-1px', marginBottom: 4 }}>
                    ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                  </div>
                  <p style={{ color: '#334155', fontSize: 12, margin: '0 0 12px' }}>{order.items?.length || 0} items ordered</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </div>
                      <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>Payment</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>{order.status}</div>
                      <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>Status</div>
                    </div>
                  </div>
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
          .order-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
        @media print {
          .admin-sidebar-desktop, .admin-menu-btn, button { display: none !important; }
        }
      `}</style>
    </div>
  )
}
