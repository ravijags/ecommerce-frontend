import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2, Shield, User, Mail, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setFiltered(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search) { setFiltered(users); return }
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    ))
  }, [search, users])

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE', headers: { authorization: token }
      })
      if (res.ok) {
        toast.success('User deleted')
        setUsers(prev => prev.filter(u => u._id !== userId))
      } else toast.error('Failed to delete user')
    } catch { toast.error('Something went wrong') }
  }

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4']

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Users</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{users.length} registered accounts</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20, maxWidth: 400 }}>
        <Search size={15} color="#94a3b8" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', width: '100%', background: 'transparent' }}
        />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }} className="users-stats-grid">
        {[
          { label: 'Total Users', value: users.length, color: '#3b82f6', bg: '#dbeafe' },
          { label: 'This Month', value: users.filter(u => { const d = new Date(u.createdAt); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() }).length, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#7c3aed', bg: '#ede9fe' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="users-table-wrap"
        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['User', 'Email', 'Role', 'Joined', 'Action'].map(h => (
                  <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const color = COLORS[i % COLORS.length]
                const isAdmin = user.role === 'admin'
                return (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                          {getInitials(user.name)}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{user.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={13} color="#94a3b8" />
                        <span style={{ fontSize: 13, color: '#64748b' }}>{user.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: isAdmin ? '#ede9fe' : '#f1f5f9',
                        color: isAdmin ? '#7c3aed' : '#64748b',
                      }}>
                        {isAdmin ? <Shield size={10} /> : <User size={10} />}
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={12} color="#94a3b8" />
                        <span style={{ fontSize: 12, color: '#64748b' }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {!isAdmin && (
                        <button onClick={() => deleteUser(user._id)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile cards */}
      <div className="users-cards-wrap" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
        {filtered.map((user, i) => {
          const color = COLORS[i % COLORS.length]
          const isAdmin = user.role === 'admin'
          return (
            <div key={user._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{user.name || 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{user.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: isAdmin ? '#ede9fe' : '#f1f5f9', color: isAdmin ? '#7c3aed' : '#64748b' }}>
                  {user.role || 'user'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </span>
                {!isAdmin && (
                  <button onClick={() => deleteUser(user._id)}
                    style={{ fontSize: 12, color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 600 }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>No users found</div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .users-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .users-table-wrap { display: none !important; }
          .users-cards-wrap { display: flex !important; }
        }
      `}</style>
    </AdminLayout>
  )
}
