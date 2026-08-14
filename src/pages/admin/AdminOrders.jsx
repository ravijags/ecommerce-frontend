import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  Search, Filter, ChevronDown, ChevronRight,
  Eye, LogOut, X, Menu, CheckCircle, Clock,
  Truck, XCircle, RefreshCw, FileText, ChevronLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products', icon: Package,          label: 'Products' },
  { to: '/admin/users',    icon: Users,            label: 'Users' },
]

function Sidebar({ onClose }) {
  const navigate = useNavigate()
  return (
    <div style={{ width: 220, background: '#0f172a', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#C9A84C', letterSpacing: '-0.5px' }}>PREMIA</div>
            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
          {onClose && <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>}
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = window.location.pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 3, textDecoration: 'none', transition: 'all 0.15s', background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent', color: isActive ? '#C9A84C' : '#475569', fontWeight: isActive ? 700 : 500, fontSize: 13 }}>
              <Icon size={16} />{label}
              {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C', marginLeft: 'auto' }} />}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#475569', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
          <Eye size={16} /> View Store
        </Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

const STATUS_CONFIG = {
  pending:    { bg: '#fef9c3', color: '#92400e', icon: Clock,       label: 'Pending' },
  processing: { bg: '#dbeafe', color: '#1e40af', icon: RefreshCw,   label: 'Processing' },
  shipped:    { bg: '#e0f2fe', color: '#0369a1', icon: Truck,       label: 'Shipped' },
  delivered:  { bg: '#dcfce7', color: '#166534', icon: CheckCircle, label: 'Delivered' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b', icon: XCircle,     label: 'Cancelled' },
}

export default function AdminOrders() {
  const [orders, setOrders]         = useState([])
  const [filtered, setFiltered]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`${API}/api/admin/orders`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setFiltered(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let res = orders
    if (statusFilter !== 'all') res = res.filter(o => o.status === statusFilter)
    if (search) res = res.filter(o =>
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(res)
  }, [search, statusFilter, orders])

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`${API}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      }
    } finally { setUpdatingId(null) }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return
    await updateStatus(orderId, 'cancelled')
  }

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length; return acc
  }, {})

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div className="admin-sidebar-desktop" style={{ height: '100vh' }}><Sidebar /></div>
      {sidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <motion.div initial={{ x: -220 }} animate={{ x: 0 }}
            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}
            style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Orders</h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{filtered.length} of {orders.length} orders</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>

          {/* Search + filter */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 12px' }}>
              <Search size={14} color="#94a3b8" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by order ID, name, email..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, padding: '10px 0', background: 'transparent', color: '#0f172a', fontFamily: 'Inter, system-ui' }} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label} ({counts[k] || 0})</option>
              ))}
            </select>
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[{ key: 'all', label: 'All', count: orders.length }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ key: k, label: v.label, count: counts[k] || 0 }))].map(({ key, label, count }) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: statusFilter === key ? '#0f172a' : '#fff',
                  color: statusFilter === key ? '#fff' : '#64748b',
                  boxShadow: statusFilter === key ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
                  border: statusFilter === key ? 'none' : '1px solid #e2e8f0' }}>
                {label} {count > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({count})</span>}
              </button>
            ))}
          </div>

          {/* Orders table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((order, i) => {
                      const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                      const isExpanded = expandedId === order._id
                      return (
                        <>
                          <motion.tr key={order._id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                            style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.1s', background: isExpanded ? '#fafafa' : 'transparent' }}
                            onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A84C', fontFamily: 'monospace' }}>
                                #{(order._id || '').slice(-6).toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{order.user?.name || 'Guest'}</div>
                              <div style={{ fontSize: 11, color: '#94a3b8', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.user?.email}</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: 12, color: '#64748b' }}>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                                {s.label}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                                <select value={order.status}
                                  onChange={e => updateStatus(order._id, e.target.value)}
                                  disabled={updatingId === order._id}
                                  style={{ fontSize: 11, padding: '4px 8px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#0f172a', outline: 'none' }}>
                                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                              </div>
                            </td>
                          </motion.tr>
                          {/* Expanded row */}
                          {isExpanded && (
                            <tr key={`${order._id}-expanded`}>
                              <td colSpan={7} style={{ padding: '0 16px 16px', background: '#fafafa' }}>
                                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
                                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Order Items</p>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {(order.items || []).map((item, j) => (
                                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f4f6f8', border: '1px solid #e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
                                          <img src={item.product?.image || item.product?.thumbnail} alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 3 }}
                                            onError={e => { e.target.style.display = 'none' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.product?.name || 'Product'}
                                          </p>
                                        </div>
                                        <span style={{ fontSize: 12, color: '#64748b' }}>×{item.quantity}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                      </div>
                                    ))}
                                  </div>
                                  {order.shippingAddress && (
                                    <div style={{ marginTop: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px' }}>Shipping Address</p>
                                      <p style={{ fontSize: 12, color: '#0f172a', margin: 0 }}>{order.shippingAddress}</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && !loading && (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
