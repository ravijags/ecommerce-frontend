import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import {
  Menu, Save, Store, Truck, Shield, Bell,
  Mail, Phone, MapPin, Globe, Check, X,
  IndianRupee, RefreshCw, Eye, EyeOff
} from 'lucide-react'

const STORAGE_KEY = 'premia_settings'

const DEFAULT_SETTINGS = {
  storeName:          'PREMIA',
  tagline:            'Everything Premium. Delivered.',
  email:              'hello@premia.in',
  phone:              '+91 98765 43210',
  address:            'New Delhi, India',
  currency:           'INR',
  currencySymbol:     '₹',
  freeShippingAbove:  999,
  shippingCharge:     99,
  taxRate:            18,
  razorpayKeyId:      '',
  razorpayKeySecret:  '',
  resendApiKey:       '',
  lowStockThreshold:  10,
  orderNotifications: true,
  lowStockAlerts:     true,
  newsletterSignups:  true,
  maintenanceMode:    false,
  allowReviews:       true,
  allowGuestCheckout: false,
}

function Section({ title, icon: Icon, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color="#C9A84C" />
        </div>
        <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h2>
      </div>
      <div style={{ padding: '18px 20px' }}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #f8fafc', gap: 24 }}>
      <div style={{ flex: '0 0 240px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 3px' }}>{label}</p>
        {hint && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{hint}</p>}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: value ? '#C9A84C' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } }
    catch { return DEFAULT_SETTINGS }
  })
  const [saved, setSaved]           = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [showResend, setShowResend] = useState(false)

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const I = { width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, system-ui', background: '#fafafa', boxSizing: 'border-box' }

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
              <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 700 }}>Settings</span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Manage your store configuration</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 9, border: 'none', background: saved ? '#10b981' : 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: saved ? '#fff' : '#0f172a', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: saved ? '0 4px 12px rgba(16,185,129,0.3)' : '0 4px 12px rgba(201,168,76,0.3)', transition: 'all 0.2s' }}>
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </motion.button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>

            {/* Store Info */}
            <Section title="Store Information" icon={Store}>
              <Field label="Store Name" hint="Displayed in emails and browser tab">
                <input value={settings.storeName} onChange={e => set('storeName', e.target.value)} style={I} />
              </Field>
              <Field label="Tagline" hint="Short description of your store">
                <input value={settings.tagline} onChange={e => set('tagline', e.target.value)} style={I} />
              </Field>
              <Field label="Contact Email" hint="Customer support and order emails">
                <input type="email" value={settings.email} onChange={e => set('email', e.target.value)} style={I} />
              </Field>
              <Field label="Phone Number" hint="Shown on receipts and contact page">
                <input value={settings.phone} onChange={e => set('phone', e.target.value)} style={I} />
              </Field>
              <Field label="Address" hint="Business address for invoices">
                <input value={settings.address} onChange={e => set('address', e.target.value)} style={I} />
              </Field>
            </Section>

            {/* Shipping & Tax */}
            <Section title="Shipping & Tax" icon={Truck}>
              <Field label="Free Shipping Above (₹)" hint="Orders above this amount get free delivery">
                <input type="number" value={settings.freeShippingAbove} onChange={e => set('freeShippingAbove', Number(e.target.value))} style={I} />
              </Field>
              <Field label="Shipping Charge (₹)" hint="Applied when order is below free shipping threshold">
                <input type="number" value={settings.shippingCharge} onChange={e => set('shippingCharge', Number(e.target.value))} style={I} />
              </Field>
              <Field label="Tax Rate (%)" hint="GST applied on orders (for invoices)">
                <input type="number" value={settings.taxRate} onChange={e => set('taxRate', Number(e.target.value))} style={I} />
              </Field>
            </Section>

            {/* Payment */}
            <Section title="Payment (Razorpay)" icon={IndianRupee}>
              <Field label="Razorpay Key ID" hint="Your Razorpay publishable key (starts with rzp_)">
                <input value={settings.razorpayKeyId} onChange={e => set('razorpayKeyId', e.target.value)} placeholder="rzp_live_..." style={I} />
              </Field>
              <Field label="Razorpay Key Secret" hint="Keep this secret — never share publicly">
                <div style={{ position: 'relative' }}>
                  <input type={showSecret ? 'text' : 'password'} value={settings.razorpayKeySecret} onChange={e => set('razorpayKeySecret', e.target.value)} placeholder="••••••••••••" style={{ ...I, paddingRight: 40 }} />
                  <button onClick={() => setShowSecret(!showSecret)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                    {showSecret ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
                  </button>
                </div>
              </Field>
              <Field label="Resend API Key" hint="For transactional emails (order confirmations)">
                <div style={{ position: 'relative' }}>
                  <input type={showResend ? 'text' : 'password'} value={settings.resendApiKey} onChange={e => set('resendApiKey', e.target.value)} placeholder="re_••••••••" style={{ ...I, paddingRight: 40 }} />
                  <button onClick={() => setShowResend(!showResend)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                    {showResend ? <EyeOff size={14} color="#94a3b8" /> : <Eye size={14} color="#94a3b8" />}
                  </button>
                </div>
              </Field>
            </Section>

            {/* Inventory */}
            <Section title="Inventory" icon={RefreshCw}>
              <Field label="Low Stock Threshold" hint="Alert when product stock falls below this number">
                <input type="number" value={settings.lowStockThreshold} onChange={e => set('lowStockThreshold', Number(e.target.value))} style={{ ...I, maxWidth: 120 }} />
              </Field>
            </Section>

            {/* Notifications */}
            <Section title="Notifications" icon={Bell}>
              {[
                { key: 'orderNotifications', label: 'New Order Alerts', hint: 'Get notified when a new order is placed' },
                { key: 'lowStockAlerts',     label: 'Low Stock Alerts', hint: 'Get notified when products run low' },
                { key: 'newsletterSignups',  label: 'Newsletter Signups', hint: 'Get notified when someone subscribes' },
              ].map(({ key, label, hint }) => (
                <Field key={key} label={label} hint={hint}>
                  <Toggle value={settings[key]} onChange={v => set(key, v)} />
                </Field>
              ))}
            </Section>

            {/* Store Policies */}
            <Section title="Store Policies" icon={Shield}>
              {[
                { key: 'allowReviews',       label: 'Allow Product Reviews', hint: 'Customers can leave reviews on products' },
                { key: 'allowGuestCheckout', label: 'Guest Checkout', hint: 'Allow checkout without creating an account' },
                { key: 'maintenanceMode',    label: 'Maintenance Mode', hint: 'Show maintenance page to customers (admin still works)' },
              ].map(({ key, label, hint }) => (
                <Field key={key} label={label} hint={hint}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Toggle value={settings[key]} onChange={v => set(key, v)} />
                    {key === 'maintenanceMode' && settings[key] && (
                      <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, background: '#fef2f2', padding: '2px 8px', borderRadius: 20 }}>⚠ Store is offline</span>
                    )}
                  </div>
                </Field>
              ))}
            </Section>

            {/* Danger zone */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #fecaca', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 32 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={15} color="#ef4444" />
                </div>
                <h2 style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Danger Zone</h2>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <Field label="Reset Settings" hint="Reset all settings to default values. This cannot be undone.">
                  <button onClick={() => { if (window.confirm('Reset all settings to defaults?')) { setSettings(DEFAULT_SETTINGS); localStorage.removeItem(STORAGE_KEY) } }}
                    style={{ padding: '8px 16px', borderRadius: 9, border: '1.5px solid #fca5a5', background: '#fff', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Reset to Defaults
                  </button>
                </Field>
              </div>
            </div>
          </div>
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
