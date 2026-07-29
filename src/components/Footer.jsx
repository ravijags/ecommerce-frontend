import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
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
      { name: 'Cookie Policy', href: '/' },
    ],
  }

  const socialLinks = [
  { icon: <FaInstagram size={18} />, href: '#', label: 'Instagram' },
  { icon: <FaXTwitter size={18} />, href: '#', label: 'Twitter' },
  { icon: <FaFacebook size={18} />, href: '#', label: 'Facebook' },
  { icon: <FaYoutube size={18} />, href: '#', label: 'YouTube' },
]

  const trustBadges = [
    { icon: '🔒', title: '100% Secure', desc: 'SSL encrypted payments' },
    { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
    { icon: '↩️', title: '7-Day Returns', desc: 'Hassle-free returns' },
    { icon: '✓', title: 'Genuine Products', desc: '100% authentic brands' },
  ]

  return (
    <footer style={{ backgroundColor: '#0a0a0a' }} className="text-white mt-16">

      {/* Trust badges strip */}
      <div style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: '#111', border: '1px solid #1e1e1e' }}
                >
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{badge.title}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ borderBottom: '1px solid #1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Brand column */}
            <div className="lg:col-span-2">
              <PremiaLogo variant="dark" size="md" />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#475569', maxWidth: '280px' }}>
                India's most premium ecommerce destination. 348+ curated products from the world's finest brands. Every item handpicked. Every price unbeatable.
              </p>

              {/* Contact info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={14} style={{ color: '#C9A84C' }} />
                  <span className="text-sm" style={{ color: '#475569' }}>support@premia.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={14} style={{ color: '#C9A84C' }} />
                  <span className="text-sm" style={{ color: '#475569' }}>1800-PREMIA (Mon-Sat 9am-6pm)</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={14} style={{ color: '#C9A84C' }} />
                  <span className="text-sm" style={{ color: '#475569' }}>New Delhi, India</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', color: '#475569' }}
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
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-5"
                  style={{ color: '#C9A84C' }}
                >
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: '#475569' }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = '#475569'}
                      >
                        {link.name}
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Subscribe to PREMIA Newsletter
              </h3>
              <p className="text-sm" style={{ color: '#475569' }}>
                Get exclusive deals, new arrivals and style tips straight to your inbox.
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: '#111',
                  border: '1px solid #1e1e1e',
                  color: '#fff',
                }}
              />
              <button
                className="px-6 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: '#C9A84C', color: '#0a0a0a' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: '#2a2a2a' }}>
            © 2026 PREMIA. All rights reserved. Made with ♥ in India.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs" style={{ color: '#2a2a2a' }}>We accept:</span>
            {['VISA', 'MASTERCARD', 'UPI', 'RUPAY', 'EMI'].map((method, i) => (
              <span
                key={i}
                className="text-xs font-bold px-2 py-1 rounded"
                style={{ backgroundColor: '#111', color: '#333', border: '1px solid #1e1e1e' }}
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