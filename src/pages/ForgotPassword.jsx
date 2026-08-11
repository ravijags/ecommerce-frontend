import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_API_URL

export default function ForgotPassword() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!email.trim()) return setError('Please enter your email address')
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Something went wrong')
      setSent(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.06) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ color: '#C9A84C', fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>PREMIA</h1>
            <p style={{ color: '#475569', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '4px 0 0' }}>Everything Premium. Delivered.</p>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px', backdropFilter: 'blur(12px)' }}>

          {sent ? (
            /* ── SUCCESS STATE ── */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
                📧
              </div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 10px' }}>Check your inbox!</h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' }}>
                We sent a password reset link to<br />
                <span style={{ color: '#C9A84C', fontWeight: 600 }}>{email}</span>
              </p>
              <p style={{ color: '#475569', fontSize: 12, margin: '0 0 24px' }}>The link expires in 15 minutes. Check your spam folder if you don't see it.</p>
              <Link to="/login" style={{ display: 'inline-block', color: '#C9A84C', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                ← Back to Sign In
              </Link>
            </motion.div>
          ) : (
            /* ── FORM STATE ── */
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Forgot Password?</h2>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0, lineHeight: 1.6 }}>Enter your email and we'll send you a reset link.</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
                  <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>
                </motion.div>
              )}

              {/* Email input */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@example.com"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', background: loading ? '#92702a' : '#C9A84C', color: '#0f172a', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </motion.button>

              {/* Back to login */}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link to="/login" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
                  ← Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
