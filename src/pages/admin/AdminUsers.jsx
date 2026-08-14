import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingBag, Package, Users, Search, Eye, LogOut, X, Menu, Shield, User, Mail, Phone, Calendar, Trash2 } from 'lucide-react'

const API = import.meta.env.VITE_API_URL
const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/users', icon: Users, label: 'Users' },
]

function Sidebar({ onClose }) {
  const navigate = useNavigate()
  return (
    <div style={{ width: 220, background: '#0f172a', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#C9A84C' }}>PREMIA</div>
            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
          {onClose && <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>}
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = window.location.pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 3, textDecoration: 'none', background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent', color: isActive ? '#C9A84C' : '#475569', fontWeight: isActive ? 700 : 500, fontSize: 13 }}>
              <Icon size={16} />{label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#475569', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
          <Eye size={16} /> View Store
        </Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}`, {
        method: 'DELETE', headers: { authorization: token }
      })
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId))
        setFiltered(prev => prev.filter(u => u._id !== userId))
      }
    } catch {}
  }

  useEffect(() => {
    fetch(`${API}/api/admin/users`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setFiltered(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search) return setFiltered(users)
    setFiltered(users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, users])

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div className="admin-sidebar-desktop" style={{ height: '100vh' }}><Sidebar /></div>
      {sidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <motion.div initial={{ x: -220 }} animate={{ x: 0 }} style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Customers</h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{filtered.length} registered users</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff',
            border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 14px', marginBottom: 16, maxWidth: 400 }}>
            <Search size={14} color="#94a3b8" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, padding: '11px 0', background: 'transparent', color: '#0f172a', fontFamily: 'Inter, system-ui' }} />
          </div>

          {/* Users grid */}
          <div className="users-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filtered.map((user, i) => (
              <motion.div key={user._id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{ background: '#fff', borderRadius: 14, padding: 16,
                  border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#0f172a,#1e293b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 900, color: '#C9A84C', flexShrink: 0 }}>
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name}
                      </p>
                      {user.role === 'admin'
                        ? <span style={{ background: '#fef9ec', border: '1px solid #C9A84C', color: '#C9A84C', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>ADMIN</span>
                        : <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>USER</span>
                      }
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                  </div>
                  {user.role !== 'admin' && (
                    <button onClick={() => deleteUser(user._id)}
                      style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #fee2e2',
                        background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                      <Trash2 size={12} color="#ef4444" />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: '1px solid #f8fafc' }}>
                  {user.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Phone size={11} color="#94a3b8" />
                      <span style={{ fontSize: 11, color: '#64748b' }}>{user.phone}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Calendar size={11} color="#94a3b8" />
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <a href={`mailto:${user.email}`}
                      style={{ fontSize: 11, color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>
                      Contact →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>No users found</p>
            </div>
          )}
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
