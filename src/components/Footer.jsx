import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const FOOTER_LINKS = {
  'Shop': [
    { label: 'All Products',      to: '/' },
    { label: 'New Arrivals',      to: '/?category=smartphones' },
    { label: 'Watches',           to: '/?category=mens-watches' },
    { label: 'Fragrances',        to: '/?category=fragrances' },
    { label: 'Electronics',       to: '/?category=laptops' },
    { label: 'Fashion',           to: '/?category=mens-shirts' },
  ],
  'Account': [
    { label: 'My Account',        to: '/account' },
    { label: 'My Orders',         to: '/orders' },
    { label: 'Wishlist',          to: '/wishlist' },
    { label: 'My Cart',           to: '/cart' },
  ],
  'Support': [
    { label: 'Help Center',       to: '/' },
    { label: 'Returns & Refunds', to: '/' },
    { label: 'Shipping Info',     to: '/' },
    { label: 'Contact Us',        to: '/' },
  ],
  'Company': [
    { label: 'About PREMIA',      to: '/' },
    { label: 'Privacy Policy',    to: '/' },
    { label: 'Terms of Service',  to: '/' },
    { label: 'Careers',           to: '/' },
  ],
}

// ── Payment badge ─────────────────────────────────────────────────────────
function PayBadge({ label, bg, textColor, accent }) {
  return (
    <div style={{
      background: bg,
      borderRadius: 6,
      padding: '4px 10px',
      height: 28,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${accent || 'transparent'}`,
    }}>
      <span style={{ color: textColor, fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail]           = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer style={{ background: '#04060f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Top trust strip ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto',
          padding: '14px clamp(20px,5vw,64px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(20px,4vw,56px)', flexWrap: 'wrap' }}>
          {[
            { Icon: Truck,     text: 'Free Delivery Above ₹999' },
            { Icon: RotateCcw, text: '7-Day Easy Returns' },
            { Icon: Shield,    text: '100% Secure Payments' },
          ].map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={13} color="#C9A84C" />
              <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(28px,4vw,44px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Newsletter
            </p>
            <h3 style={{ color: '#fff', fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 800,
              margin: '0 0 4px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              Exclusive deals & early access
            </h3>
            <p style={{ color: '#334155', fontSize: 12, margin: 0 }}>
              Join 50,000+ premium shoppers. No spam, ever.
            </p>
          </div>
          <div style={{ flex: '0 1 420px', minWidth: 260 }}>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div key="done"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 18px', background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C9A84C',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#0f172a', fontWeight: 900, flexShrink: 0 }}>✓</div>
                  <p style={{ color: '#C9A84C', fontWeight: 600, fontSize: 13, margin: 0 }}>
                    You're in. Welcome to PREMIA.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" style={{ display: 'flex', gap: 8 }}>
                  <input type="email" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: '#fff',
                      fontSize: 13, outline: 'none', fontFamily: 'Inter, system-ui', minWidth: 0 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    onClick={handleSubscribe}
                    style={{ padding: '12px 20px', borderRadius: 10, border: 'none',
                      background: '#C9A84C', color: '#0f172a', fontSize: 13, fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      whiteSpace: 'nowrap', flexShrink: 0,
                      boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
                    Subscribe <ArrowRight size={13} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Main links ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto',
        padding: 'clamp(40px,5vw,60px) clamp(20px,5vw,64px) clamp(28px,4vw,44px)' }}>

        <div className="footer-main-grid" style={{ display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 'clamp(20px,3vw,48px)',
          marginBottom: 52 }}>

          {/* Brand col */}
          <div>
            {/* Logo */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: '#fff',
                letterSpacing: '-1px', lineHeight: 1, marginBottom: 3 }}>PREMIA</div>
              <div style={{ fontSize: 9, color: '#C9A84C', letterSpacing: '0.3em',
                textTransform: 'uppercase', fontWeight: 600 }}>Everything Premium. Delivered.</div>
            </div>

            <p style={{ color: '#334155', fontSize: 12, lineHeight: 1.8,
              margin: '0 0 20px', maxWidth: 220 }}>
              India's finest curated marketplace for premium products from the world's best brands.
            </p>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {[
                { Icon: Mail,   text: 'hello@premia.in' },
                { Icon: Phone,  text: '+91 98765 43210' },
                { Icon: MapPin, text: 'New Delhi, India' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={11} color="#C9A84C" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#334155' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Social — minimal dots style */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: 'IG', color: '#E1306C' },
                { label: 'TW', color: '#1DA1F2' },
                { label: 'YT', color: '#FF0000' },
                { label: 'FB', color: '#1877F2' },
              ].map(({ label, color }) => (
                <motion.div key={label}
                  whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 900, color: color, letterSpacing: '0.05em' }}>
                  {label}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: '#fff', fontSize: 10, fontWeight: 800,
                letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 18px' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 11 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      style={{ color: '#334155', fontSize: 12, textDecoration: 'none',
                        fontWeight: 500, transition: 'color 0.15s, padding-left 0.15s',
                        display: 'block' }}
                      onMouseEnter={e => { e.target.style.color = '#C9A84C'; e.target.style.paddingLeft = '4px' }}
                      onMouseLeave={e => { e.target.style.color = '#334155'; e.target.style.paddingLeft = '0' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)', marginBottom: 28 }} />

        {/* ── Payment methods ── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#1e293b', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Secure Payments
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* VISA — classic navy italic */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 12px', height: 30, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#1A1F71', fontSize: 13, fontWeight: 900, fontStyle: 'italic', letterSpacing: '1px' }}>VISA</span>
            </div>
            {/* Mastercard — red + yellow circles */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', height: 30, display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EB001B' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F79E1B', marginLeft: -6 }} />
              <span style={{ color: '#231F20', fontSize: 9, fontWeight: 700, marginLeft: 4, letterSpacing: '0.02em' }}>mastercard</span>
            </div>
            {/* Razorpay — blue */}
            <div style={{ background: '#2563EB', border: '1px solid #2563EB', borderRadius: 6, padding: '4px 10px', height: 30, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em' }}>Razorpay</span>
            </div>
            {/* UPI — purple/multicolor */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', height: 30, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ color: '#097939', fontSize: 11, fontWeight: 900 }}>U</span>
              <span style={{ color: '#EB3D3D', fontSize: 11, fontWeight: 900 }}>P</span>
              <span style={{ color: '#F7941D', fontSize: 11, fontWeight: 900 }}>I</span>
            </div>
            {/* RuPay — blue */}
            <div style={{ background: '#006BA6', border: '1px solid #006BA6', borderRadius: 6, padding: '4px 10px', height: 30, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: '0.05em' }}>RuPay</span>
            </div>
            {/* Net Banking — gold on dark */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 6, padding: '4px 10px', height: 30, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#C9A84C', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Net Banking</span>
            </div>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: '#1e293b', fontSize: 11, margin: 0 }}>
            © {new Date().getFullYear()}{' '}
            <span style={{ color: '#C9A84C', fontWeight: 700 }}>PREMIA</span>
            {' '}· All rights reserved.
          </p>
          <p style={{ color: '#1e293b', fontSize: 11, margin: 0 }}>
            Made with <span style={{ color: '#ef4444', fontSize: 12 }}>♥</span> in India
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .footer-main-grid > div:first-child {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 480px) {
          .footer-main-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
