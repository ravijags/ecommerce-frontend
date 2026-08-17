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
              <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>{text}</span>
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
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#C9A84C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 18, color: '#0f172a', flexShrink: 0 }}>P</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: '#fff',
                    letterSpacing: '-0.5px', lineHeight: 1 }}>PREMIA</div>
                  <div style={{ fontSize: 8, color: '#C9A84C', letterSpacing: '0.25em',
                    textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>Everything Premium. Delivered.</div>
                </div>
              </div>
            </div>

            <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.8,
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

            {/* Social icons — brand colored */}
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Instagram */}
              <motion.a href="#" whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                </svg>
              </motion.a>
              {/* X (Twitter) */}
              <motion.a href="#" whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ width: 34, height: 34, borderRadius: 8, background: '#000', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.857L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>
              {/* Facebook */}
              <motion.a href="#" whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ width: 34, height: 34, borderRadius: 8, background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
                </svg>
              </motion.a>
              {/* YouTube */}
              <motion.a href="#" whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ width: 34, height: 34, borderRadius: 8, background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.5v-7l6.25 3.5-6.25 3.5z"/>
                </svg>
              </motion.a>
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
                      style={{ color: '#64748b', fontSize: 12, textDecoration: 'none',
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

        {/* ── Payment methods — small brand-colored rectangles ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500, marginRight: 2 }}>We accept:</span>

            {/* VISA */}
            <div style={{ background: '#1A1F71', borderRadius: 5, padding: '3px 10px', height: 26, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, fontStyle: 'italic', letterSpacing: '1.5px' }}>VISA</span>
            </div>

            {/* Mastercard */}
            <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 5, padding: '3px 8px', height: 26, display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ position: 'relative', width: 26, height: 16, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EB001B', position: 'absolute', left: 0 }} />
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F79E1B', position: 'absolute', left: 10, opacity: 0.95 }} />
              </div>
            </div>

            {/* UPI */}
            <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 5, padding: '3px 8px', height: 26, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ color: '#097939', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>U</span>
              <span style={{ color: '#EB3D3D', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>P</span>
              <span style={{ color: '#F7941D', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>I</span>
            </div>

            {/* RuPay */}
            <div style={{ background: '#006BA6', borderRadius: 5, padding: '3px 10px', height: 26, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.3px' }}>RuPay</span>
            </div>

            {/* Razorpay */}
            <div style={{ background: '#2563EB', borderRadius: 5, padding: '3px 10px', height: 26, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>Razorpay</span>
            </div>

            {/* EMI */}
            <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 5, padding: '3px 10px', height: 26, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>EMI</span>
            </div>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>
            © {new Date().getFullYear()}{' '}
            <span style={{ color: '#C9A84C', fontWeight: 700 }}>PREMIA</span>
            {' '}· All rights reserved.
          </p>
          <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>
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
