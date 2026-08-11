import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_API_URL

export default function ResetPassword() {
  const { token }               = useParams()   // grabs token from /reset-password/:token
  const navigate                = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!password)              return setError('Please enter a new password')
    if (password.length < 6)   return setError('Password must be at least 6 characters')
    if (password !== confirm)   return setError('Passwords do not match')

    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Reset failed. The link may have expired.')
      setSuccess(true)
      // Redirect to login after 2.5s
      setTimeout(() => navigate('/login'), 2500)
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

          {success ? (
            /* ── SUCCESS STATE ── */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
                ✅
              </div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 10px' }}>Password Reset!</h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: '0 0 8px' }}>Your password has been updated successfully.</p>
              <p style={{ color: '#475569', fontSize: 12, margin: '0 0 24px' }}>Redirecting you to Sign In...</p>
              <Link to="/login" style={{ display: 'inline-block', background: '#C9A84C', color: '#0f172a', padding: '11px 28px', borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '0.05em' }}>
                SIGN IN NOW →
              </Link>
            </motion.div>
          ) : (
            /* ── FORM STATE ── */
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Set New Password</h2>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0, lineHeight: 1.6 }}>Choose a strong password for your account.</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
                  <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>
                </motion.div>
              )}

              {/* New password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 44px 13px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16, padding: 0 }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Confirm Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="Repeat your password"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${confirm && confirm !== password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = confirm && confirm !== password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
                />
                {confirm && confirm !== password && (
                  <p style={{ color: '#f87171', fontSize: 12, margin: '6px 0 0' }}>Passwords don't match</p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', background: loading ? '#92702a' : '#C9A84C', color: '#0f172a', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              >
                {loading ? 'Resetting...' : 'Reset Password →'}
              </motion.button>

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
