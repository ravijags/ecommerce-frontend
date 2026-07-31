import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

const STATUS = {
  pending:    { bg: '#fef3c7', color: '#92400e' },
  processing: { bg: '#dbeafe', color: '#1e40af' },
  shipped:    { bg: '#ede9fe', color: '#5b21b6' },
  delivered:  { bg: '#dcfce7', color: '#15803d' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
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
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', authorization: token },
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
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #C9A84C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Orders</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{orders.length} total orders</p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Order ID', 'Customer', 'Date', 'Amount', 'Payment', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const s = STATUS[order.status] || STATUS.pending
                const ps = order.paymentStatus === 'paid'
                  ? { bg: '#dcfce7', color: '#15803d' }
                  : { bg: '#fef3c7', color: '#92400e' }
                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{order.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{order.user?.email}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: ps.bg, color: ps.color, textTransform: 'capitalize' }}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: s.bg, color: s.color, textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#0f172a', background: '#f8fafc', cursor: 'pointer', outline: 'none' }}>
                        {['pending','processing','shipped','delivered','cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
              {orders.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
