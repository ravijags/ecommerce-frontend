import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

const STATUS_CFG = {
  pending:    { bg: '#fef3c7', color: '#92400e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped:    { bg: '#ede9fe', color: '#5b21b6' },
  delivered:  { bg: '#dcfce7', color: '#15803d' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setFiltered(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let list = [...orders]
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter)
    if (search) list = list.filter(o =>
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(list)
  }, [search, statusFilter, orders])

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success('Status updated')
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
    } else toast.error('Failed to update')
  }

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Orders</h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{filtered.length} of {orders.length} orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', flex: 1, minWidth: 160 }}>
          <Search size={14} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', width: '100%', background: 'transparent' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}>
          <option value="all">All Status</option>
          {['pending','processing','shipped','delivered','cancelled'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="orders-table-wrap" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Order ID','Customer','Date','Amount','Payment','Status','Action'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const s = STATUS_CFG[order.status] || STATUS_CFG.pending
                const ps = order.paymentStatus === 'paid' ? { bg: '#dcfce7', color: '#15803d' } : { bg: '#fef3c7', color: '#92400e' }
                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>#{order._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{order.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: ps.bg, color: ps.color, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: s.bg, color: s.color, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        style={{ fontSize: 12, padding: '5px 8px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#0f172a', background: '#f8fafc', cursor: 'pointer', outline: 'none' }}>
                        {['pending','processing','shipped','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards — shown only on small screens */}
      <div className="orders-cards-wrap" style={{ display: 'none', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>No orders found</div>
        )}
        {filtered.map(order => {
          const s = STATUS_CFG[order.status] || STATUS_CFG.pending
          const ps = order.paymentStatus === 'paid' ? { bg: '#dcfce7', color: '#15803d' } : { bg: '#fef3c7', color: '#92400e' }
          return (
            <div key={order._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>#{order._id.slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{order.user?.email}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color }}>
                  {order.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ps.bg, color: ps.color }}>
                  {order.paymentStatus || 'pending'}
                </span>
              </div>
              <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                style={{ width: '100%', fontSize: 13, padding: '9px 12px', borderRadius: 10, border: '1px solid #e2e8f0', color: '#0f172a', background: '#f8fafc', cursor: 'pointer', outline: 'none' }}>
                {['pending','processing','shipped','delivered','cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 640px) {
          .orders-table-wrap { display: none !important; }
          .orders-cards-wrap { display: flex !important; }
        }
      `}</style>
    </AdminLayout>
  )
}
