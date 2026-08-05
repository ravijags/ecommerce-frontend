import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Truck, RotateCcw, Shield, BadgeCheck } from 'lucide-react'
import { FaInstagram, FaXTwitter, FaFacebook, FaYoutube } from 'react-icons/fa6'
import PremiaLogo from './PremiaLogo'

const TRUST_BADGES = [
  { Icon: Truck,      title: 'Free Delivery',    desc: 'On orders above ₹999' },
  { Icon: RotateCcw,  title: '7-Day Returns',    desc: 'Hassle-free returns' },
  { Icon: Shield,     title: '100% Secure',      desc: 'SSL encrypted payments' },
  { Icon: BadgeCheck, title: 'Genuine Products', desc: '100% authentic brands' },
]

const FOOTER_LINKS = {
  Shop: [
    { name: 'Smartphones', href: '/' },
    { name: 'Laptops', href: '/' },
    { name: 'Fashion', href: '/' },
    { name: 'Beauty', href: '/' },
    { name: 'Watches', href: '/' },
    { name: 'Sports', href: '/' },
  ],
  Help: [
    { name: 'Track Order', href: '/orders' },
    { name: 'Returns', href: '/' },
    { name: 'Shipping', href: '/' },
    { name: 'Contact Us', href: '/' },
    { name: 'FAQ', href: '/' },
    { name: 'Size Guide', href: '/' },
  ],
  Company: [
    { name: 'About PREMIA', href: '/' },
    { name: 'Careers', href: '/' },
    { name: 'Press', href: '/' },
    { name: 'Privacy', href: '/' },
    { name: 'Terms', href: '/' },
  ],
}

const SOCIAL = [
  { Icon: FaInstagram, href: '#', label: 'Instagram' },
  { Icon: FaXTwitter,  href: '#', label: 'Twitter' },
  { Icon: FaFacebook,  href: '#', label: 'Facebook' },
  { Icon: FaYoutube,   href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', color: '#fff', marginTop: 64 }}>

      {/* Trust badges */}
      <div style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
          <div className="footer-trust-grid">
            {TRUST_BADGES.map(({ Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#111', border: '1px solid #1e1e1e',
                }}>
                  <Icon size={20} color="#C9A84C" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</p>
                  <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main links */}
      <div style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 40px' }}>
          <div className="footer-main-grid">

            {/* Brand */}
            <div className="footer-brand">
              <PremiaLogo variant="dark" size="md" />
              <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.7, color: '#475569', maxWidth: 260 }}>
                India's most premium ecommerce destination. Curated products from the world's finest brands.
              </p>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { Icon: Mail, text: 'support@premia.in' },
                  { Icon: Phone, text: '1800-PREMIA (Mon–Sat 9am–6pm)' },
                  { Icon: MapPin, text: 'New Delhi, India' },
                ].map(({ Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={13} color="#C9A84C" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#475569' }}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {SOCIAL.map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} style={{
                    width: 34, height: 34, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#111', border: '1px solid #1e1e1e',
                    color: '#475569', textDecoration: 'none', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.borderColor = '#C9A84C' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#1e1e1e' }}>
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C9A84C', margin: '0 0 18px' }}>
                  {title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {links.map(({ name, href }) => (
                    <li key={name}>
                      <Link to={href} style={{ fontSize: 13, color: '#475569', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = '#475569'}>
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
          <div className="footer-newsletter">
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Subscribe to PREMIA Newsletter</p>
              <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Exclusive deals, new arrivals and style tips.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 420 }}>
              <input id="newsletter-email" name="newsletter" type="email" placeholder="Enter your email" style={{
                flex: 1, padding: '11px 14px', borderRadius: 10,
                border: '1px solid #1e1e1e', background: '#111',
                color: '#fff', fontSize: 13, outline: 'none',
              }} />
              <button style={{
                padding: '11px 20px', borderRadius: 10, border: 'none',
                background: '#C9A84C', color: '#0a0a0a',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
              }}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px' }}>
        <div className="footer-bottom">
          <p style={{ fontSize: 12, color: '#333', margin: 0 }}>© 2026 PREMIA. All rights reserved. Made with ♥ in India.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#333' }}>We accept:</span>
            {['VISA', 'MC', 'UPI', 'RUPAY', 'EMI'].map(m => (
              <span key={m} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: '#111', color: '#444', border: '1px solid #1e1e1e' }}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-trust-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .footer-main-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
        .footer-brand { grid-column: 1 / -1; }
        .footer-newsletter { display: flex; flex-direction: column; gap: 16px; }
        .footer-bottom { display: flex; flex-direction: column; gap: 12px; }
        @media (min-width: 768px) {
          .footer-trust-grid { grid-template-columns: repeat(4, 1fr); }
          .footer-main-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
          .footer-brand { grid-column: auto; }
          .footer-newsletter { flex-direction: row; align-items: center; justify-content: space-between; }
          .footer-bottom { flex-direction: row; align-items: center; justify-content: space-between; }
        }
      `}</style>
    </footer>
  )
}
