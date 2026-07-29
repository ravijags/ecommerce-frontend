import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Truck, RotateCcw, Shield, BadgeCheck } from 'lucide-react'
import { FaInstagram, FaXTwitter, FaFacebook, FaYoutube } from 'react-icons/fa6'
import PremiaLogo from './PremiaLogo'

function Footer() {
  const footerLinks = {
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
      { name: 'Returns & Refunds', href: '/' },
      { name: 'Shipping Policy', href: '/' },
      { name: 'Contact Us', href: '/' },
      { name: 'FAQ', href: '/' },
      { name: 'Size Guide', href: '/' },
    ],
    Company: [
      { name: 'About PREMIA', href: '/' },
      { name: 'Careers', href: '/' },
      { name: 'Press', href: '/' },
      { name: 'Privacy Policy', href: '/' },
      { name: 'Terms of Service', href: '/' },
    ],
  }

  const trustBadges = [
    { icon: <Truck size={22} />, title: 'Free Delivery', desc: 'On orders above ₹999' },
    { icon: <RotateCcw size={22} />, title: '7-Day Returns', desc: 'Hassle-free returns' },
    { icon: <Shield size={22} />, title: '100% Secure', desc: 'SSL encrypted payments' },
    { icon: <BadgeCheck size={22} />, title: 'Genuine Products', desc: '100% authentic brands' },
  ]

  const socialLinks = [
    { icon: <FaInstagram size={16} />, href: '#', label: 'Instagram' },
    { icon: <FaXTwitter size={16} />, href: '#', label: 'Twitter' },
    { icon: <FaFacebook size={16} />, href: '#', label: 'Facebook' },
    { icon: <FaYoutube size={16} />, href: '#', label: 'YouTube' },
  ]

  return (
    <footer style={{ backgroundColor: '#0a0a0a', marginTop: 64 }}>

      {/* Trust badges */}
      <div style={{ borderBottom: '1px solid #141414' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24
          }}>
            {trustBadges.map((badge, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{
                  width: 48, height: 48,
                  backgroundColor: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C9A84C',
                  flexShrink: 0
                }}>
                  {badge.icon}
                </div>
                <div>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                    {badge.title}
                  </p>
                  <p style={{ color: '#475569', fontSize: 12 }}>
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ borderBottom: '1px solid #141414' }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '56px 24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48
          }}>

            {/* Brand column */}
            <div>
              <PremiaLogo variant="dark" size="md" />
              <p style={{
                color: '#475569',
                fontSize: 13,
                lineHeight: 1.7,
                marginTop: 16,
                maxWidth: 280
              }}>
                India's most premium ecommerce destination. Curated products from the world's finest brands. Every item handpicked. Every price unbeatable.
              </p>

              {/* Contact */}
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: <Mail size={13} />, text: 'support@premia.in' },
                  { icon: <Phone size={13} />, text: '1800-PREMIA (Mon-Sat 9am-6pm)' },
                  { icon: <MapPin size={13} />, text: 'New Delhi, India' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#C9A84C', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ color: '#475569', fontSize: 12 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    style={{
                      width: 36, height: 36,
                      backgroundColor: '#111',
                      border: '1px solid #1e1e1e',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#C9A84C'
                      e.currentTarget.style.color = '#0a0a0a'
                      e.currentTarget.style.borderColor = '#C9A84C'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#111'
                      e.currentTarget.style.color = '#475569'
                      e.currentTarget.style.borderColor = '#1e1e1e'
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 style={{
                  color: '#C9A84C',
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  marginBottom: 20
                }}>
                  {title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {links.map((link, i) => (
                    <Link
                      key={i}
                      to={link.href}
                      style={{
                        color: '#475569',
                        fontSize: 13,
                        textDecoration: 'none',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = '#475569'}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid #141414' }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '32px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              Subscribe to PREMIA Newsletter
            </h3>
            <p style={{ color: '#475569', fontSize: 13 }}>
              Get exclusive deals, new arrivals and style tips.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                backgroundColor: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: 10,
                padding: '10px 16px',
                fontSize: 13,
                color: '#fff',
                outline: 'none',
                width: 260,
                fontFamily: 'Inter, system-ui'
              }}
            />
            <button style={{
              backgroundColor: '#C9A84C',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <p style={{ color: '#2a2a2a', fontSize: 12 }}>
            © 2026 PREMIA. All rights reserved. Made with ♥ in India.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#2a2a2a', fontSize: 11 }}>We accept:</span>
            {['VISA', 'Mastercard', 'UPI', 'RuPay', 'EMI'].map((method, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#111',
                  color: '#333',
                  border: '1px solid #1e1e1e',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer