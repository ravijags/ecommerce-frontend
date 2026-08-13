import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

// ── Real colored payment brand SVGs ──────────────────────────────────────
const VisaLogo = () => (
  <svg viewBox="0 0 60 20" width="48" height="16" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="16" fontFamily="Arial" fontSize="18" fontWeight="900" fill="#1A1F71" letterSpacing="-1">VISA</text>
  </svg>
)

const MastercardLogo = () => (
  <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="12" r="10" fill="#EB001B" />
    <circle cx="24" cy="12" r="10" fill="#F79E1B" />
    <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00" />
  </svg>
)

const RazorpayLogo = () => (
  <svg viewBox="0 0 80 24" width="72" height="22" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 20,10 14,10 22,22 8,22 16,12 10,12" fill="#2563EB" />
    <text x="26" y="17" fontFamily="Arial" fontSize="13" fontWeight="700" fill="#2563EB">Razorpay</text>
  </svg>
)

const UPILogo = () => (
  <svg viewBox="0 0 60 24" width="48" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="24" rx="4" fill="#7C3AED" />
    <text x="8" y="17" fontFamily="Arial" fontSize="13" fontWeight="900" fill="white">UPI</text>
    <circle cx="48" cy="12" r="6" fill="#F59E0B" />
    <text x="44" y="16" fontFamily="Arial" fontSize="9" fontWeight="700" fill="#7C3AED">₹</text>
  </svg>
)

const RuPayLogo = () => (
  <svg viewBox="0 0 72 24" width="64" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="24" rx="4" fill="#006BA6" />
    <text x="6" y="16" fontFamily="Arial" fontSize="11" fontWeight="900" fill="white">RuPay</text>
    <rect x="52" y="4" width="14" height="16" rx="2" fill="#F97316" />
    <text x="54" y="16" fontFamily="Arial" fontSize="10" fontWeight="900" fill="white">✓</text>
  </svg>
)

const NetBankingLogo = () => (
  <svg viewBox="0 0 80 24" width="72" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="24" rx="4" fill="#0f172a" />
    <text x="6" y="16" fontFamily="Arial" fontSize="9" fontWeight="700" fill="#C9A84C" letterSpacing="0.5">NET BANKING</text>
  </svg>
)

const FOOTER_LINKS = {
  'Shop': [
    { label: 'All Products',    to: '/' },
    { label: 'New Arrivals',    to: '/?category=smartphones' },
    { label: 'Best Sellers',    to: '/?sort=rating' },
    { label: 'Watches',         to: '/?category=mens-watches' },
    { label: 'Fragrances',      to: '/?category=fragrances' },
    { label: 'Electronics',     to: '/?category=laptops' },
  ],
  'Account': [
    { label: 'My Account',      to: '/account' },
    { label: 'My Orders',       to: '/orders' },
    { label: 'My Wishlist',     to: '/wishlist' },
    { label: 'My Cart',         to: '/cart' },
    { label: 'Track Order',     to: '/orders' },
  ],
  'Support': [
    { label: 'Help Center',     to: '/' },
    { label: 'Returns & Refunds', to: '/' },
    { label: 'Shipping Info',   to: '/' },
    { label: 'Size Guide',      to: '/' },
    { label: 'Contact Us',      to: '/' },
  ],
  'Company': [
    { label: 'About PREMIA',    to: '/' },
    { label: 'Careers',         to: '/' },
    { label: 'Press',           to: '/' },
    { label: 'Privacy Policy',  to: '/' },
    { label: 'Terms of Service', to: '/' },
  ],
}

const SOCIALS = [
  { Icon: Instagram, label: 'Instagram', color: '#E1306C', href: '#' },
  { Icon: Twitter,   label: 'Twitter',   color: '#1DA1F2', href: '#' },
  { Icon: Youtube,   label: 'YouTube',   color: '#FF0000', href: '#' },
  { Icon: Facebook,  label: 'Facebook',  color: '#1877F2', href: '#' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer style={{ background: '#0a0f1e', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Newsletter strip ── */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Get exclusive deals & early access
            </h3>
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
              Join 50,000+ premium shoppers. No spam, ever.
            </p>
          </div>
          {subscribed ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C9A84C', fontWeight: 700, fontSize: 14 }}>
              ✓ You're subscribed! Welcome to PREMIA.
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: 8, flex: '0 0 auto', width: 'clamp(280px, 40%, 420px)' }}>
              <input type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13,
                  outline: 'none', fontFamily: 'Inter, system-ui' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleSubscribe}
                style={{ padding: '11px 20px', borderRadius: 10, border: 'none',
                  background: '#C9A84C', color: '#0f172a', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                Subscribe <ArrowRight size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,64px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(180px,25%,260px) repeat(4, 1fr)', gap: 'clamp(24px,3vw,48px)', marginBottom: 48 }}
          className="footer-grid">

          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#C9A84C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 16, color: '#0f172a' }}>P</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>PREMIA</div>
                  <div style={{ fontSize: 9, color: '#C9A84C', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Premium Shopping</div>
                </div>
              </div>
              <p style={{ color: '#475569', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                Everything Premium. Delivered. India's finest curated marketplace for premium products.
              </p>
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {[
                { Icon: Mail,    text: 'hello@premia.in' },
                { Icon: Phone,   text: '+91 98765 43210' },
                { Icon: MapPin,  text: 'New Delhi, India' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={12} color="#C9A84C" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#475569' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIALS.map(({ Icon, label, color, href }) => (
                <motion.a key={label} href={href} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${color}20`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  <Icon size={14} color={color} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', margin: '0 0 16px' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      style={{ color: '#475569', fontSize: 12, textDecoration: 'none', transition: 'color 0.15s', fontWeight: 500 }}
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
            Secure Payment Methods
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {[VisaLogo, MastercardLogo, RazorpayLogo, UPILogo, RuPayLogo, NetBankingLogo].map((Logo, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '6px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                <Logo />
              </div>
            ))}
          </div>
        </div>

        {/* ── Copyright ── */}
        <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#C9A84C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 10, color: '#0f172a' }}>P</div>
            <p style={{ color: '#334155', fontSize: 11, margin: 0 }}>
              © {new Date().getFullYear()} <span style={{ color: '#C9A84C', fontWeight: 700 }}>PREMIA</span>
              {' '}— Everything Premium. Delivered.
              <span style={{ color: '#1e293b', margin: '0 6px' }}>·</span>
              All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#1e293b', fontSize: 11 }}>Made with</span>
            <span style={{ color: '#ef4444', fontSize: 13 }}>♥</span>
            <span style={{ color: '#1e293b', fontSize: 11 }}>in India</span>
            <span style={{ fontSize: 14, marginLeft: 2 }}>🇮🇳</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
