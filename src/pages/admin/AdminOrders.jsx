import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
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
      .then(r => r.json()).then(d => { setOrders(d.orders || []); setFiltered(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let list = [...orders]
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter)
    if (search) list = list.filter(o => o._id.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase()))
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

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} /></div></AdminLayout>

  return (
    <AdminLayout>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <Search size={16} style={{ color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or email..." className="flex-1 text-sm outline-none bg-transparent" style={{ color: '#0f172a' }} />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <Filter size={15} style={{ color: '#94a3b8' }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm outline-none bg-transparent" style={{ color: '#0f172a' }}>
            <option value="all">All Status</option>
            {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-white text-sm font-semibold flex items-center" style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
          {filtered.length} orders
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #e2e8f0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Order ID', 'Customer', 'Date', 'Amount', 'Payment', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
              {filtered.map((order, i) => {
                const s = STATUS_CFG[order.status] || STATUS_CFG.pending
                return (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-bold" style={{ color: '#0f172a' }}>#{order._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{order.user?.name || 'Customer'}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: '#64748b' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold" style={{ color: '#0f172a' }}>₹{order.totalAmount?.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize" style={{
                        background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: order.paymentStatus === 'paid' ? '#15803d' : '#92400e'
                      }}>{order.paymentStatus || 'pending'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize" style={{ background: s.bg, color: s.color }}>{order.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        className="text-xs rounded-lg px-3 py-1.5 font-medium outline-none cursor-pointer"
                        style={{ border: '1px solid #e2e8f0', color: '#0f172a', background: '#f8fafc' }}>
                        {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-sm" style={{ color: '#94a3b8' }}>No orders found</div>}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
