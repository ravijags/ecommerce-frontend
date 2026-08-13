import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
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
    { label: 'My Wishlist',       to: '/wishlist' },
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

// ── Payment badge component ───────────────────────────────────────────────
function PayBadge({ children, bg, color, border }) {
  return (
    <div style={{
      background: bg || '#fff',
      border: `1.5px solid ${border || '#e2e8f0'}`,
      borderRadius: 8,
      padding: '5px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 32,
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    }}>
      <span style={{ color: color || '#0f172a', fontSize: 12, fontWeight: 900, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </div>
  )
}

// ── Social button ─────────────────────────────────────────────────────────
function SocialBtn({ href, label, emoji, color }) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
      title={label}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, textDecoration: 'none', transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.borderColor = `${color}50` }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
      {emoji}
    </motion.a>
  )
}

export default function Footer() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer style={{ background: '#080d1a', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Trust bar ── */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px clamp(20px,5vw,64px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 16, flexWrap: 'wrap' }}>
          {[
            { Icon: Truck,     text: 'Free Delivery Above ₹999' },
            { Icon: RotateCcw, text: '7-Day Easy Returns' },
            { Icon: Shield,    text: '100% Secure Payments' },
          ].map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={14} color="#C9A84C" />
              <span style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 'clamp(15px,2.5vw,20px)', fontWeight: 800,
              margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Get exclusive deals & early access
            </h3>
            <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
              Join 50,000+ premium shoppers. No spam, ever.
            </p>
          </div>
          {subscribed ? (
            <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ color: '#C9A84C', fontWeight: 700, fontSize: 14, margin: 0 }}>
              ✓ Welcome to PREMIA!
            </motion.p>
          ) : (
            <div style={{ display: 'flex', gap: 8, width: 'clamp(260px,38%,400px)', flexShrink: 0 }}>
              <input type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  fontSize: 13, outline: 'none', fontFamily: 'Inter, system-ui',
                  minWidth: 0 }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleSubscribe}
                style={{ padding: '10px 18px', borderRadius: 10, border: 'none',
                  background: '#C9A84C', color: '#0f172a', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  whiteSpace: 'nowrap', flexShrink: 0 }}>
                Subscribe <ArrowRight size={13} />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main links ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto',
        padding: 'clamp(36px,5vw,56px) clamp(20px,5vw,64px) clamp(24px,4vw,40px)' }}>

        <div className="footer-grid" style={{ display: 'grid',
          gridTemplateColumns: 'clamp(160px,22%,220px) repeat(4,1fr)',
          gap: 'clamp(24px,3vw,48px)', marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#C9A84C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 15, color: '#0f172a' }}>P</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>PREMIA</div>
                <div style={{ fontSize: 8, color: '#C9A84C', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Premium Shopping</div>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: 12, lineHeight: 1.75, margin: '0 0 16px' }}>
              India's finest curated marketplace. Every item handpicked for quality and value.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
              {[
                { Icon: Mail,   text: 'hello@premia.in' },
                { Icon: Phone,  text: '+91 98765 43210' },
                { Icon: MapPin, text: 'New Delhi, India' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon size={11} color="#C9A84C" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#475569' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <SocialBtn href="#" label="Instagram" emoji="📸" color="#E1306C" />
              <SocialBtn href="#" label="Twitter"   emoji="🐦" color="#1DA1F2" />
              <SocialBtn href="#" label="YouTube"   emoji="▶️" color="#FF0000" />
              <SocialBtn href="#" label="Facebook"  emoji="👥" color="#1877F2" />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em',
                textTransform: 'uppercase', margin: '0 0 16px' }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      style={{ color: '#475569', fontSize: 12, textDecoration: 'none',
                        fontWeight: 500, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color = '#C9A84C'}
                      onMouseLeave={e => e.target.style.color = '#475569'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Payment methods ── */}
        <div style={{ paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
          <p style={{ color: '#334155', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', margin: '0 0 14px' }}>
            🔒 Secure Payment Methods
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <PayBadge bg="#1A1F71" color="#fff" border="#1A1F71">
              <span style={{ fontStyle: 'italic', fontSize: 14, fontWeight: 900, letterSpacing: '1px' }}>VISA</span>
            </PayBadge>
            <PayBadge bg="#fff" color="#fff" border="#e2e8f0">
              <span style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <span style={{ color: '#EB001B', fontWeight: 900, fontSize: 18 }}>●</span>
                <span style={{ color: '#F79E1B', fontWeight: 900, fontSize: 18, marginLeft: -4 }}>●</span>
                <span style={{ color: '#0f172a', fontSize: 10, fontWeight: 700, marginLeft: 4 }}>Mastercard</span>
              </span>
            </PayBadge>
            <PayBadge bg="#528FF0" color="#fff" border="#528FF0">
              ⚡ Razorpay
            </PayBadge>
            <PayBadge bg="#097939" color="#fff" border="#097939">
              🇮🇳 UPI
            </PayBadge>
            <PayBadge bg="#006BA6" color="#fff" border="#006BA6">
              RuPay
            </PayBadge>
            <PayBadge bg="#0f172a" color="#C9A84C" border="#C9A84C">
              Net Banking
            </PayBadge>
            <PayBadge bg="#fff" color="#0f172a" border="#e2e8f0">
              💳 Cards
            </PayBadge>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#C9A84C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 10, color: '#0f172a', flexShrink: 0 }}>P</div>
            <p style={{ color: '#334155', fontSize: 11, margin: 0, lineHeight: 1.5 }}>
              © {new Date().getFullYear()}{' '}
              <span style={{ color: '#C9A84C', fontWeight: 800 }}>PREMIA</span>
              {' '}— Everything Premium. Delivered. All rights reserved.
            </p>
          </div>
          <p style={{ color: '#1e293b', fontSize: 11, margin: 0 }}>
            Made with <span style={{ color: '#ef4444' }}>♥</span> in India 🇮🇳
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </footer>
  )
}
