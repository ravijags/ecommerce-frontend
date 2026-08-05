import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User, Mail, Package, Heart, Shield, ChevronRight, LogOut,
  Edit2, Check, X, MapPin, Bell, CreditCard, HelpCircle,
  FileText, Phone, Lock, Plus, Trash2, Home, Briefcase, Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 4px' }}>{title}</p>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        {children}
      </div>
    </motion.div>
  )
}

function SettingRow({ icon: Icon, label, desc, onClick, to, gold, danger, last }) {
  const style = {
    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
    cursor: 'pointer', textDecoration: 'none', color: 'inherit',
    borderBottom: last ? 'none' : '1px solid #f1f5f9',
    transition: 'background 0.12s',
  }
  const inner = (
    <>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: danger ? '#fef2f2' : gold ? '#fef9ec' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={danger ? '#ef4444' : gold ? '#C9A84C' : '#0f172a'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: danger ? '#ef4444' : '#0f172a', margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</p>}
      </div>
      <ChevronRight size={16} color="#cbd5e1" />
    </>
  )
  if (to) return (
    <Link to={to} style={style}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {inner}
    </Link>
  )
  return (
    <div onClick={onClick} style={style}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {inner}
    </div>
  )
}

// ── PASSWORD CHANGE MODAL ──
function PasswordModal({ onClose }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!current || !next || !confirm) return toast.error('Fill all fields')
    if (next.length < 6) return toast.error('Min 6 characters')
    if (next !== confirm) return toast.error('Passwords do not match')
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const d = await res.json()
      if (res.ok) { toast.success('Password changed!'); onClose() }
      else toast.error(d.message || 'Failed')
    } catch { toast.error('Network error') }
    setLoading(false)
  }

  return (
    <Modal title="Change Password" onClose={onClose}>
      {[
        { label: 'Current Password', val: current, set: setCurrent, id: 'cp' },
        { label: 'New Password', val: next, set: setNext, id: 'np' },
        { label: 'Confirm New Password', val: confirm, set: setConfirm, id: 'cnp' },
      ].map(({ label, val, set, id }) => (
        <div key={id} style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{label}</label>
          <input id={id} name={id} type="password" value={val} onChange={e => set(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#C9A84C'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>
      ))}
      <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Changing...' : 'Change Password'}
      </button>
    </Modal>
  )
}

// ── PHONE MODAL ──
function PhoneModal({ current, onClose, onSave }) {
  const [phone, setPhone] = useState(current || '')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!phone.trim()) return toast.error('Enter phone number')
    if (!/^\+?[\d\s\-]{8,15}$/.test(phone)) return toast.error('Invalid phone number')
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/api/auth/update-phone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ phone }),
      })
      const d = await res.json()
      if (res.ok) { toast.success('Phone updated!'); onSave(phone); onClose() }
      else toast.error(d.message || 'Failed')
    } catch { toast.error('Network error') }
    setLoading(false)
  }

  return (
    <Modal title="Update Phone Number" onClose={onClose}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Mobile Number</label>
        <input id="phone" name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = '#C9A84C'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
      </div>
      <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? 'Saving...' : 'Save Number'}
      </button>
    </Modal>
  )
}

// ── ADDRESS FORM ──
function AddressForm({ address, onSave, onClose }) {
  const [form, setForm] = useState({
    label: address?.label || 'Home',
    name: address?.name || '',
    phone: address?.phone || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    isDefault: address?.isDefault || false,
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode)
      return toast.error('Fill all required fields')
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const url = address?._id ? `${API}/api/auth/addresses/${address._id}` : `${API}/api/auth/addresses`
      const method = address?._id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (res.ok) { toast.success(address ? 'Address updated' : 'Address added'); onSave(d.addresses); onClose() }
      else toast.error(d.message || 'Failed')
    } catch { toast.error('Network error') }
    setLoading(false)
  }

  const LABELS = ['Home', 'Work', 'Other']
  const FIELDS = [
    { key: 'name', label: 'Full Name *', placeholder: 'Ravi Jags', type: 'text' },
    { key: 'phone', label: 'Phone *', placeholder: '+91 98765 43210', type: 'tel' },
    { key: 'line1', label: 'Address Line 1 *', placeholder: 'House no, Street, Area', type: 'text' },
    { key: 'line2', label: 'Address Line 2', placeholder: 'Landmark (optional)', type: 'text' },
    { key: 'city', label: 'City *', placeholder: 'New Delhi', type: 'text' },
    { key: 'state', label: 'State *', placeholder: 'Delhi', type: 'text' },
    { key: 'pincode', label: 'Pincode *', placeholder: '110001', type: 'text' },
  ]

  return (
    <Modal title={address ? 'Edit Address' : 'Add New Address'} onClose={onClose}>
      {/* Label selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {LABELS.map(l => (
          <button key={l} onClick={() => set('label', l)} style={{
            padding: '6px 14px', borderRadius: 20, border: '1.5px solid',
            borderColor: form.label === l ? '#0f172a' : '#e2e8f0',
            background: form.label === l ? '#0f172a' : '#fff',
            color: form.label === l ? '#fff' : '#64748b',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {FIELDS.map(({ key, label, placeholder, type }) => (
          <div key={key} style={{ gridColumn: ['line1','line2'].includes(key) ? '1 / -1' : 'auto' }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 5 }}>{label}</label>
            <input id={key} name={key} type={type} value={form[key]} placeholder={placeholder}
              onChange={e => set(key, e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
        ))}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, cursor: 'pointer', fontSize: 13, color: '#475569' }}>
        <input id="isDefault" name="isDefault" type="checkbox" checked={form.isDefault} onChange={e => set('isDefault', e.target.checked)}
          style={{ accentColor: '#C9A84C', width: 16, height: 16 }} />
        Set as default delivery address
      </label>

      <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>
        {loading ? 'Saving...' : address ? 'Update Address' : 'Save Address'}
      </button>
    </Modal>
  )
}

// ── ADDRESSES MODAL ──
function AddressesModal({ onClose }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editAddr, setEditAddr] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API}/api/auth/addresses`, { headers: { authorization: token } })
      .then(r => r.json()).then(d => { setAddresses(d.addresses || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const deleteAddr = async (id) => {
    if (!window.confirm('Delete this address?')) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/api/auth/addresses/${id}`, { method: 'DELETE', headers: { authorization: token } })
      const d = await res.json()
      if (res.ok) { setAddresses(d.addresses); toast.success('Address deleted') }
    } catch { toast.error('Failed') }
  }

  if (showForm || editAddr) return (
    <AddressForm
      address={editAddr}
      onSave={setAddresses}
      onClose={() => { setShowForm(false); setEditAddr(null) }}
    />
  )

  const LABEL_ICONS = { Home: Home, Work: Briefcase, Other: MapPin }

  return (
    <Modal title="Saved Addresses" onClose={onClose}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>Loading...</div>
      ) : (
        <>
          {addresses.length === 0 && (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '16px 0 8px' }}>No addresses saved yet.</p>
          )}
          {addresses.map(addr => {
            const Icon = LABEL_ICONS[addr.label] || MapPin
            return (
              <div key={addr._id} style={{ padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color="#0f172a" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{addr.label}</span>
                        {addr.isDefault && <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 7px', borderRadius: 20, background: '#dcfce7', color: '#15803d' }}>DEFAULT</span>}
                      </div>
                      <p style={{ fontSize: 13, color: '#0f172a', margin: '0 0 2px' }}>{addr.name} · {addr.phone}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setEditAddr(addr)} style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteAddr(addr._id)} style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px', borderRadius: 10, border: '1.5px dashed #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 12, justifyContent: 'center' }}>
            <Plus size={15} /> Add New Address
          </button>
        </>
      )}
    </Modal>
  )
}

// ── GENERIC MODAL ──
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

// ── MAIN ACCOUNT PAGE ──
export default function Account() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null) // 'password' | 'phone' | 'addresses'
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${API}/api/auth/me`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => {
        const u = d.user || d
        setUser(u); setName(u?.name || '')
        localStorage.setItem('premia_uname', u?.name || '')
        setLoading(false)
      })
      .catch(() => {
        try {
          const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
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
      const res = await fetch(`${API}/api/auth/update`, {
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

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 20, padding: '28px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#0f172a', flexShrink: 0, border: '3px solid rgba(201,168,76,0.3)' }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input id="account-name" name="name" value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 15, outline: 'none' }}
                  autoFocus />
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
            <p style={{ fontSize: 13, color: '#475569', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            {user?.phone && <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{user.phone}</p>}
            {user?.role === 'admin' && (
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: 'rgba(201,168,76,0.2)', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', marginTop: 6 }}>
                ADMIN
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* My Activity */}
      <Section title="My Activity">
        <SettingRow icon={Package} label="My Orders" desc="Track, return or buy again" to="/orders" />
        <SettingRow icon={Heart} label="Wishlist" desc={`${JSON.parse(localStorage.getItem('premia_wishlist') || '[]').length} saved items`} to="/wishlist" last />
      </Section>

      {/* Account Settings */}
      <Section title="Account Settings">
        <SettingRow icon={User} label="Full Name" desc={user?.name} onClick={() => setEditingName(true)} />
        <SettingRow icon={Mail} label="Email Address" desc={user?.email || 'Not set'} onClick={() => toast('Email cannot be changed', { icon: 'ℹ️' })} />
        <SettingRow icon={Phone} label="Phone Number" desc={user?.phone || 'Not added'} onClick={() => setModal('phone')} />
        <SettingRow icon={Lock} label="Change Password" desc="Update your account password" onClick={() => setModal('password')} />
        <SettingRow icon={MapPin} label="Saved Addresses" desc="Add or manage delivery addresses" onClick={() => setModal('addresses')} last />
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <SettingRow icon={Bell} label="Notifications" desc="Email and push notification settings" onClick={() => toast('Coming soon', { icon: '🚧' })} />
        <SettingRow icon={CreditCard} label="Payment Methods" desc="Saved cards and UPI IDs" onClick={() => toast('Coming soon', { icon: '🚧' })} last />
      </Section>

      {/* Help */}
      <Section title="Help & Support">
        <SettingRow icon={HelpCircle} label="Help Center" desc="FAQs and support articles" onClick={() => toast('Coming soon', { icon: '🚧' })} />
        <SettingRow icon={Phone} label="Contact Us" desc="support@premia.in · 1800-PREMIA" onClick={() => toast('Coming soon', { icon: '🚧' })} />
        <SettingRow icon={FileText} label="Terms & Privacy" desc="Legal information" onClick={() => toast('Coming soon', { icon: '🚧' })} last />
      </Section>

      {/* Admin */}
      {user?.role === 'admin' && (
        <Section title="Administration">
          <SettingRow icon={Shield} label="Admin Panel" desc="Manage store, orders & users" to="/admin" gold last />
        </Section>
      )}

      {/* Sign out */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '14px', borderRadius: 14,
          border: '1.5px solid #fee2e2', background: '#fff',
          color: '#ef4444', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxSizing: 'border-box',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          <LogOut size={16} /> Sign Out
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 16 }}>
          PREMIA v1.0 · Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {modal === 'password' && <PasswordModal onClose={() => setModal(null)} />}
        {modal === 'phone' && <PhoneModal current={user?.phone} onClose={() => setModal(null)} onSave={(p) => setUser(u => ({ ...u, phone: p }))} />}
        {modal === 'addresses' && <AddressesModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </main>
  )
}
