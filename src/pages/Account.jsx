import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Package, LogOut, ChevronRight, Shield, Bell, Heart, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Account() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('')
  const [showPwSection, setShowPwSection] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => {
        setUser(d.user || d)
        setName(d.user?.name || d.name || '')
        setLoading(false)
      })
      .catch(() => {
        // If no /me endpoint, decode from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          setUser({ name: payload.name || 'User', email: payload.email || '', role: payload.role || 'user' })
          setName(payload.name || 'User')
        } catch {
          setUser({ name: 'User', email: '' })
          setName('User')
        }
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out!')
    navigate('/login')
  }

  const saveName = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return }
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        toast.success('Name updated!')
        setUser(u => ({ ...u, name }))
        setEditMode(false)
      } else {
        toast.error('Update failed')
      }
    } catch {
      toast.error('Could not update')
    } finally { setSaving(false) }
  }

  const getInitials = (n) => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2) : 'U'

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0f172a', borderRadius: 20, padding: '28px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#0f172a', flexShrink: 0 }}>
          {getInitials(user?.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          {user?.role === 'admin' && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#C9A84C22', color: '#C9A84C', marginTop: 6, display: 'inline-block', letterSpacing: '0.08em' }}>
              ADMIN
            </span>
          )}
        </div>
      </motion.div>

      {/* Edit Name */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editMode ? 16 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={16} color="#C9A84C" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Full Name</span>
          </div>
          <button onClick={() => setEditMode(!editMode)} style={{ fontSize: 12, color: '#C9A84C', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {!editMode && <p style={{ fontSize: 14, color: '#64748b', margin: '8px 0 0' }}>{user?.name}</p>}
        {editMode && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button onClick={saveName} disabled={saving}
              style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
              {saving ? '...' : 'Save'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Email — read only */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Mail size={16} color="#C9A84C" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Email Address</span>
        </div>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>{user?.email}</p>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>Email cannot be changed</p>
      </motion.div>

      {/* Quick links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
        {[
          { to: '/orders', icon: Package, label: 'My Orders', desc: 'View order history' },
          { to: '/wishlist', icon: Heart, label: 'Wishlist', desc: 'Saved items' },
          ...(user?.role === 'admin' ? [{ to: '/admin', icon: Shield, label: 'Admin Panel', desc: 'Manage store' }] : []),
        ].map(({ to, icon: Icon, label, desc }, i, arr) => (
          <Link key={to} to={to} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', textDecoration: 'none',
            borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#0f172a" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{desc}</p>
              </div>
            </div>
            <ChevronRight size={16} color="#94a3b8" />
          </Link>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: '2px solid #fee2e2',
          background: '#fff', color: '#ef4444', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.15s', boxSizing: 'border-box',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </motion.div>
    </main>
  )
}
