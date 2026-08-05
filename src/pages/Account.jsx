import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Package, Heart, Shield, ChevronRight, LogOut, Edit2, Check, X, MapPin, Bell, CreditCard, HelpCircle, FileText, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Account() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => {
        const u = d.user || d
        setUser(u)
        setName(u?.name || '')
        localStorage.setItem('premia_uname', u?.name || '')
        setLoading(false)
      })
      .catch(() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const u = { name: payload.name || 'User', email: payload.email || '', role: payload.role || 'user' }
          setUser(u); setName(u.name); setLoading(false)
        } catch { setLoading(false) }
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('premia_uname')
    toast.success('Signed out')
    navigate('/login')
  }

  const saveName = async () => {
    if (!name.trim()) return
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        setUser(u => ({ ...u, name }))
        localStorage.setItem('premia_uname', name)
        setEditingName(false)
        toast.success('Name updated')
      } else toast.error('Could not update')
    } catch { toast.error('Network error') }
    setSaving(false)
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>

      {/* Profile hero card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 20, padding: '28px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#0f172a', flexShrink: 0, border: '3px solid rgba(201,168,76,0.3)' }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  id="account-name" name="name"
                  value={name} onChange={e => setName(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 15, outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  autoFocus
                />
                <button onClick={saveName} disabled={saving} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: '#C9A84C', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Check size={15} />
                </button>
                <button onClick={() => { setEditingName(false); setName(user.name) }} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: '#334155', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</h2>
                <button onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, display: 'flex' }}>
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <p style={{ fontSize: 13, color: '#475569', margin: '3px 0 6px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            {user?.role === 'admin' && (
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: 'rgba(201,168,76,0.2)', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ADMIN
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* My Activity */}
      <Section title="My Activity">
        <NavItem icon={Package} label="My Orders" desc="Track and manage your orders" to="/orders" />
        <NavItem icon={Heart} label="Wishlist" desc="Products you saved for later" to="/wishlist" />
      </Section>

      {/* Account Settings */}
      <Section title="Account Settings">
        <NavItem icon={User} label="Profile Information" desc={user?.email} action={() => setEditingName(true)} />
        <NavItem icon={MapPin} label="Saved Addresses" desc="Manage delivery addresses" action={() => toast('Coming soon', { icon: '🚧' })} />
        <NavItem icon={CreditCard} label="Payment Methods" desc="Saved cards and UPI" action={() => toast('Coming soon', { icon: '🚧' })} />
        <NavItem icon={Bell} label="Notifications" desc="Manage alerts and updates" action={() => toast('Coming soon', { icon: '🚧' })} />
      </Section>

      {/* Help & Support */}
      <Section title="Help & Support">
        <NavItem icon={HelpCircle} label="Help Center" desc="FAQs and support articles" action={() => toast('Coming soon', { icon: '🚧' })} />
        <NavItem icon={Phone} label="Contact Us" desc="support@premia.in · 1800-PREMIA" action={() => toast('Coming soon', { icon: '🚧' })} />
        <NavItem icon={FileText} label="Terms & Privacy" desc="Legal information" action={() => toast('Coming soon', { icon: '🚧' })} />
      </Section>

      {/* Admin */}
      {user?.role === 'admin' && (
        <Section title="Administration">
          <NavItem icon={Shield} label="Admin Panel" desc="Manage store, orders & users" to="/admin" gold />
        </Section>
      )}

      {/* Sign out */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '14px', borderRadius: 14,
          border: '1.5px solid #fee2e2', background: '#fff',
          color: '#ef4444', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxSizing: 'border-box', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          <LogOut size={16} /> Sign Out
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 16 }}>
          PREMIA v1.0 · Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </motion.div>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 4px' }}>{title}</p>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        {children}
      </div>
    </motion.div>
  )
}

function NavItem({ icon: Icon, label, desc, to, action, gold }) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer', transition: 'background 0.12s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: gold ? '#fef9ec' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={gold ? '#C9A84C' : '#0f172a'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</p>}
      </div>
      <ChevronRight size={16} color="#cbd5e1" />
    </div>
  )

  if (to) return <Link to={to} style={{ textDecoration: 'none', display: 'block', borderBottom: '1px solid #f1f5f9' }}>{content}</Link>
  return <div onClick={action} style={{ borderBottom: '1px solid #f1f5f9' }}>{content}</div>
}
