import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  User, Mail, Phone, MapPin, Package, Heart,
  ShoppingCart, Edit2, Check, X, LogOut,
  ChevronRight, Shield, Camera, Plus, Trash2
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

export default function Account() {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('token')
  const [user, setUser]           = useState(null)
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm]           = useState({ name: '', email: '', phone: '' })
  const [saving, setSaving]       = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addingAddress, setAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '' })

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    Promise.all([
      fetch(`${API}/api/auth/me`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/orders`, { headers: { authorization: token } }).then(r => r.json()),
    ]).then(([userData, ordersData]) => {
      const u = userData.user || userData
      setUser(u)
      setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '' })
      setOrders(ordersData.order || ordersData.orders || [])
      try {
        const saved = JSON.parse(localStorage.getItem(`premia_addresses_${u._id}`) || '[]')
        setAddresses(saved)
      } catch {}
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(prev => ({ ...prev, ...form }))
        localStorage.setItem('premia_uname', form.name)
        setEditing(false)
        toast.success('Profile updated!')
      } else toast.error(data.message || 'Update failed')
    } catch { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('premia_uname')
    toast.success('Logged out!')
    navigate('/login')
  }

  const saveAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill all address fields'); return
    }
    const updated = [...addresses, { ...newAddress, id: Date.now().toString() }]
    setAddresses(updated)
    localStorage.setItem(`premia_addresses_${user._id}`, JSON.stringify(updated))
    setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '' })
    setAddingAddress(false)
    toast.success('Address saved!')
  }

  const deleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    localStorage.setItem(`premia_addresses_${user._id}`, JSON.stringify(updated))
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%' }} />
    </div>
  )

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const delivered  = orders.filter(o => o.status === 'delivered').length
  const initials   = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const TABS = [
    { key: 'profile',   label: 'Profile' },
    { key: 'orders',    label: `Orders (${orders.length})` },
    { key: 'addresses', label: 'Addresses' },
    { key: 'security',  label: 'Security' },
  ]
  const I = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'Inter, system-ui', background: '#fafafa', boxSizing: 'border-box' }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', padding: 'clamp(20px,4vw,40px) clamp(16px,5vw,24px) 80px', fontFamily: 'Inter, system-ui' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 20, padding: 'clamp(24px,4vw,36px)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,168,76,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#0f172a', border: '3px solid rgba(255,255,255,0.1)' }}>
                {initials}
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f172a' }}>
                <Camera size={10} color="#0f172a" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{user?.name || 'User'}</h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', background: 'rgba(201,168,76,0.12)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(201,168,76,0.2)' }}>
                  {user?.role === 'admin' ? '👑 Admin' : '✦ PREMIA Member'}
                </span>
              </div>
            </div>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#64748b' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 24, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Total Orders', value: orders.length, icon: Package, color: '#3b82f6' },
              { label: 'Delivered', value: delivered, icon: Check, color: '#10b981' },
              { label: 'Total Spent', value: `₹${(totalSpent/1000).toFixed(1)}K`, icon: ShoppingCart, color: '#C9A84C' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Icon size={13} color={color} />
                  <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                </div>
                <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 14, padding: 6, marginBottom: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ flex: '0 0 auto', padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === key ? 700 : 500, background: activeTab === key ? '#0f172a' : 'transparent', color: activeTab === key ? '#fff' : '#64748b', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Profile */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Personal Information</h2>
                  {!editing
                    ? <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}><Edit2 size={12} /> Edit</button>
                    : <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { setEditing(false); setForm({ name: user.name||'', email: user.email||'', phone: user.phone||'' }) }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}><X size={12} /> Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 16px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', fontSize: 12, fontWeight: 700, color: '#0f172a', cursor: 'pointer', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}><Check size={12} /> {saving ? 'Saving...' : 'Save'}</button>
                      </div>
                  }
                </div>
                <div style={{ padding: 22 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="profile-grid">
                    {[
                      { label: 'Full Name', key: 'name', icon: User, type: 'text', placeholder: 'Your full name', col: 'auto' },
                      { label: 'Email Address', key: 'email', icon: Mail, type: 'email', placeholder: 'your@email.com', col: 'auto' },
                      { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel', placeholder: '+91 98765 43210', col: '1 / -1' },
                    ].map(({ label, key, icon: Icon, type, placeholder, col }) => (
                      <div key={key} style={{ gridColumn: col }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
                        {editing ? (
                          <div style={{ position: 'relative' }}>
                            <Icon size={14} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={{ ...I, paddingLeft: 38 }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                            <Icon size={14} color="#94a3b8" />
                            <span style={{ fontSize: 14, color: form[key] ? '#0f172a' : '#94a3b8' }}>{form[key] || `No ${label.toLowerCase()} added`}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16, border: '1px solid #ebebeb' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>No orders yet</h3>
                  <p style={{ color: '#94a3b8', margin: '0 0 24px' }}>Start shopping to see your orders here</p>
                  <Link to="/" style={{ background: '#0f172a', color: '#fff', padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Shop Now</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orders.slice(0, 5).map((order, i) => {
                    const STATUS = { pending: { color: '#f59e0b', bg: '#fef9c3' }, processing: { color: '#3b82f6', bg: '#dbeafe' }, shipped: { color: '#06b6d4', bg: '#e0f2fe' }, delivered: { color: '#10b981', bg: '#dcfce7' }, cancelled: { color: '#ef4444', bg: '#fee2e2' } }
                    const s = STATUS[order.status] || STATUS.pending
                    return (
                      <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#C9A84C', fontFamily: 'monospace' }}>#{(order._id||'').slice(-8).toUpperCase()}</span>
                            <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{order.status}</span>
                          </div>
                          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items?.length||0} items</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>₹{(order.totalAmount||0).toLocaleString('en-IN')}</span>
                          <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#C9A84C', fontWeight: 600, textDecoration: 'none' }}>View <ChevronRight size={14} /></Link>
                        </div>
                      </motion.div>
                    )
                  })}
                  {orders.length > 5 && <Link to="/orders" style={{ display: 'block', textAlign: 'center', padding: '14px', background: '#fff', borderRadius: 14, border: '1px solid #ebebeb', fontSize: 13, fontWeight: 700, color: '#C9A84C', textDecoration: 'none' }}>View all {orders.length} orders →</Link>}
                </div>
              )}
            </motion.div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <motion.div key="addresses" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {addresses.map((addr, i) => (
                  <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #ebebeb', display: 'flex', alignItems: 'flex-start', gap: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={16} color="#10b981" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{addr.label}</p>
                      <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    </div>
                    <button onClick={() => deleteAddress(addr.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6, color: '#94a3b8' }} onMouseEnter={e => e.currentTarget.style.color='#ef4444'} onMouseLeave={e => e.currentTarget.style.color='#94a3b8'}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
                {addingAddress ? (
                  <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1.5px solid #C9A84C' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Add New Address</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Street Address</label>
                        <input value={newAddress.street} onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))} placeholder="123 Main Street" style={I} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>City</label>
                        <input value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} placeholder="New Delhi" style={I} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pincode</label>
                        <input value={newAddress.pincode} onChange={e => setNewAddress(a => ({ ...a, pincode: e.target.value }))} placeholder="110001" style={I} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                      <button onClick={() => setAddingAddress(false)} style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                      <button onClick={saveAddress} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', fontSize: 13, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>Save Address</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingAddress(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', background: '#fff', borderRadius: 14, border: '1.5px dashed #e2e8f0', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer', width: '100%', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#C9A84C'; e.currentTarget.style.color='#C9A84C' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#64748b' }}>
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9' }}>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Security Settings</h2>
                </div>
                <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: Shield, title: 'Change Password', desc: 'Update your password to keep your account secure', action: () => navigate('/forgot-password'), btn: 'Change Password', color: '#3b82f6' },
                    { icon: LogOut, title: 'Sign Out', desc: 'Log out from your PREMIA account', action: handleLogout, btn: 'Sign Out', color: '#ef4444' },
                  ].map(({ icon: Icon, title, desc, action, btn, color }) => (
                    <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{desc}</p>
                      </div>
                      <button onClick={action} style={{ padding: '8px 16px', borderRadius: 9, border: `1.5px solid ${color}30`, background: `${color}10`, color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{btn}</button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @media (max-width: 600px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
