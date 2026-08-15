import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import {
  Menu, Plus, Tag, Trash2, Edit2, Copy,
  Check, X, Calendar, Percent, IndianRupee,
  Users, ShoppingCart, AlertTriangle
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

// ── Local coupon storage (since backend may not have coupon routes) ────────
const STORAGE_KEY = 'premia_admin_coupons'

const DEFAULT_COUPONS = [
  { id: '1', code: 'PREMIA10', type: 'percent', value: 10, minOrder: 999,  maxUses: 1000, uses: 23,  expiry: '2026-12-31', active: true,  description: 'Welcome offer — 10% off' },
  { id: '2', code: 'SAVE20',   type: 'percent', value: 20, minOrder: 1999, maxUses: 500,  uses: 8,   expiry: '2026-09-30', active: true,  description: 'Flash sale — 20% off' },
  { id: '3', code: 'FLAT500',  type: 'fixed',   value: 500, minOrder: 2999, maxUses: 200, uses: 45,  expiry: '2026-08-31', active: false, description: 'Flat ₹500 off on orders above ₹2999' },
]

function getCoupons() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_COUPONS
  } catch { return DEFAULT_COUPONS }
}

function saveCoupons(coupons) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons))
}

// ── Coupon Modal ──────────────────────────────────────────────────────────
function CouponModal({ coupon, onClose, onSave }) {
  const isEdit = !!coupon?.id
  const [form, setForm] = useState({
    code:        coupon?.code        || '',
    type:        coupon?.type        || 'percent',
    value:       coupon?.value       || '',
    minOrder:    coupon?.minOrder    || '',
    maxUses:     coupon?.maxUses     || '',
    expiry:      coupon?.expiry      || '',
    description: coupon?.description || '',
    active:      coupon?.active      ?? true,
  })
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.code.trim()) return setError('Coupon code is required')
    if (!form.value || Number(form.value) <= 0) return setError('Value must be greater than 0')
    if (form.type === 'percent' && Number(form.value) > 100) return setError('Percentage cannot exceed 100')
    if (!form.expiry) return setError('Expiry date is required')

    const saved = {
      id: coupon?.id || Date.now().toString(),
      code: form.code.toUpperCase().trim().replace(/\s+/g, ''),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxUses: Number(form.maxUses) || 999999,
      uses: coupon?.uses || 0,
      expiry: form.expiry,
      description: form.description,
      active: form.active,
    }
    onSave(saved)
  }

  const L = { display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }
  const I = { width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, system-ui', background: '#fafafa', boxSizing: 'border-box' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h2>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Configure discount code details</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', borderRadius: 9, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} color="#64748b" />
          </button>
        </div>

        <div style={{ padding: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Code */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={L}>Coupon Code *</label>
              <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
                placeholder="e.g. PREMIA10" style={{ ...I, fontFamily: 'monospace', fontWeight: 700, fontSize: 15, letterSpacing: '0.1em' }} />
              <p style={{ fontSize: 10, color: '#94a3b8', margin: '4px 0 0' }}>Customers enter this at checkout</p>
            </div>

            {/* Type */}
            <div>
              <label style={L}>Discount Type *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ val: 'percent', label: '% Off', icon: Percent }, { val: 'fixed', label: '₹ Off', icon: IndianRupee }].map(({ val, label, icon: Icon }) => (
                  <button key={val} onClick={() => set('type', val)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 9, border: `1.5px solid ${form.type === val ? '#C9A84C' : '#e2e8f0'}`, background: form.type === val ? '#fef9ec' : '#fafafa', color: form.type === val ? '#C9A84C' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Value */}
            <div>
              <label style={L}>Discount Value *</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={form.value} onChange={e => set('value', e.target.value)}
                  placeholder={form.type === 'percent' ? '10' : '500'} style={{ ...I, paddingRight: 36 }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>
                  {form.type === 'percent' ? '%' : '₹'}
                </span>
              </div>
            </div>

            {/* Min order */}
            <div>
              <label style={L}>Min Order Amount</label>
              <input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)}
                placeholder="999" style={I} />
            </div>

            {/* Max uses */}
            <div>
              <label style={L}>Max Uses</label>
              <input type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)}
                placeholder="1000" style={I} />
            </div>

            {/* Expiry */}
            <div>
              <label style={L}>Expiry Date *</label>
              <input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} style={I} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={L}>Description</label>
              <input value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="e.g. Welcome offer for new customers" style={I} />
            </div>

            {/* Active toggle */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>Active</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Customers can use this coupon</p>
              </div>
              <button onClick={() => set('active', !form.active)}
                style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.active ? '#C9A84C' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>

          {error && <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, color: '#ef4444', fontSize: 12 }}>{error}</div>}
        </div>

        <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, justifyContent: 'flex-end', background: '#fafafa' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
            style={{ padding: '9px 24px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
            <Check size={13} /> {isEdit ? 'Save Changes' : 'Create Coupon'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminCoupons() {
  const [coupons, setCoupons]     = useState(getCoupons)
  const [modal, setModal]         = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [copied, setCopied]       = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toastMsg, setToastMsg]   = useState('')

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

  const handleSave = (coupon) => {
    const updated = modal?.id
      ? coupons.map(c => c.id === coupon.id ? coupon : c)
      : [coupon, ...coupons]
    setCoupons(updated)
    saveCoupons(updated)
    setModal(null)
    showToast(modal?.id ? '✓ Coupon updated!' : '✓ Coupon created!')
  }

  const handleDelete = (id) => {
    const updated = coupons.filter(c => c.id !== id)
    setCoupons(updated)
    saveCoupons(updated)
    setDeleteId(null)
    showToast('✓ Coupon deleted')
  }

  const toggleActive = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c)
    setCoupons(updated)
    saveCoupons(updated)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(code)
    setTimeout(() => setCopied(''), 2000)
  }

  const now = new Date()
  const activeCoupons  = coupons.filter(c => c.active && new Date(c.expiry) >= now)
  const expiredCoupons = coupons.filter(c => new Date(c.expiry) < now)
  const totalUses      = coupons.reduce((s, c) => s + (c.uses || 0), 0)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div className="admin-sidebar-desktop" style={{ height: '100vh', flexShrink: 0 }}><AdminSidebar /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }} transition={{ type: 'tween', duration: 0.22 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link to="/admin" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 700 }}>Coupons</span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{activeCoupons.length} active · {totalUses} total uses</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setModal({})}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
            <Plus size={14} /> Create Coupon
          </motion.button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }} className="coupon-stats">
            {[
              { label: 'Total Coupons', value: coupons.length, icon: Tag, color: '#C9A84C' },
              { label: 'Active Now', value: activeCoupons.length, icon: Check, color: '#10b981' },
              { label: 'Total Uses', value: totalUses, icon: ShoppingCart, color: '#3b82f6' },
              { label: 'Expired', value: expiredCoupons.length, icon: AlertTriangle, color: '#ef4444' },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={16} color={color} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 3 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Coupons list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {coupons.map((coupon, i) => {
              const isExpired = new Date(coupon.expiry) < now
              const usePct = coupon.maxUses ? Math.min(100, Math.round((coupon.uses / coupon.maxUses) * 100)) : 0
              return (
                <motion.div key={coupon.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: '#fff', borderRadius: 14, border: `1px solid ${!coupon.active || isExpired ? '#f1f5f9' : '#ebebeb'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', opacity: !coupon.active || isExpired ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', flexWrap: 'wrap' }}>

                    {/* Code */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: coupon.type === 'percent' ? '#fef9ec' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {coupon.type === 'percent' ? <Percent size={18} color="#C9A84C" /> : <IndianRupee size={18} color="#10b981" />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em' }}>{coupon.code}</span>
                          <button onClick={() => copyCode(coupon.code)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 3, display: 'flex', color: copied === coupon.code ? '#10b981' : '#94a3b8' }}>
                            {copied === coupon.code ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                        <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{coupon.description}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'flex', gap: 20, flex: 1, flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Discount</p>
                        <p style={{ fontSize: 15, fontWeight: 900, color: coupon.type === 'percent' ? '#C9A84C' : '#10b981', margin: 0 }}>
                          {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Min Order</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>₹{coupon.minOrder?.toLocaleString('en-IN') || 0}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Usage</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{coupon.uses} / {coupon.maxUses === 999999 ? '∞' : coupon.maxUses}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Expires</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: isExpired ? '#ef4444' : '#0f172a', margin: 0 }}>
                          {isExpired ? '⚠ Expired' : new Date(coupon.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Usage bar */}
                    {coupon.maxUses !== 999999 && (
                      <div style={{ width: 80, flexShrink: 0 }}>
                        <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 4, fontWeight: 600, textAlign: 'right' }}>{usePct}%</div>
                        <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${usePct}%`, background: usePct > 80 ? '#ef4444' : '#C9A84C', borderRadius: 3, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    )}

                    {/* Status + Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => toggleActive(coupon.id)}
                        style={{ width: 40, height: 22, borderRadius: 11, border: 'none', background: coupon.active && !isExpired ? '#C9A84C' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: coupon.active && !isExpired ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </button>
                      <button onClick={() => setModal(coupon)}
                        style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = '#fef9ec' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                        <Edit2 size={12} color="#64748b" />
                      </button>
                      <button onClick={() => setDeleteId(coupon.id)}
                        style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.background = '#fef2f2' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                        <Trash2 size={12} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {coupons.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 14, border: '1px solid #ebebeb' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
                <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>No coupons yet</p>
                <button onClick={() => setModal({})}
                  style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Create your first coupon
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal !== null && <CouponModal coupon={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />}
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              style={{ background: '#fff', borderRadius: 18, padding: 28, maxWidth: 340, width: '100%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Trash2 size={20} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Delete Coupon?</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 22px' }}>This coupon will be permanently removed.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '10px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={13} color="#C9A84C" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
          .coupon-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
