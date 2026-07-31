import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.message || 'Login failed'); setLoading(false); return }
      localStorage.setItem('token', data.token)
      toast.success('Welcome back!')
      navigate('/')
    } catch { toast.error('Something went wrong'); setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Left brand panel ── */}
      <div style={{
        width: '50%', background: '#0f172a', display: 'none',
        flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 56px',
      }} className="auth-left">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#C9A84C', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 20, color: '#0f172a'
          }}>P</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', lineHeight: 1 }}>PREMIA</div>
            <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium Shopping</div>
          </div>
        </div>

        {/* Middle content */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Everything Premium.
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 16px' }}>
            The New<br />Standard of<br />
            <span style={{ color: '#C9A84C' }}>Shopping.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, marginBottom: 40 }}>
            Sign in to access your orders, wishlist,<br />and exclusive member deals.
          </p>
          <div style={{ display: 'flex', gap: 32 }}>
            {[['194+', 'Products'], ['50K+', 'Customers'], ['4.8★', 'Rating']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#C9A84C' }}>{n}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { Icon: ShieldCheck, text: 'SSL encrypted & 100% secure checkout' },
            { Icon: Truck, text: 'Free delivery on orders above ₹999' },
            { Icon: Star, text: 'Rated 4.8/5 by 50,000+ happy customers' },
          ].map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={14} style={{ color: '#C9A84C', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#475569' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', background: '#f8fafc',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: '#fff', borderRadius: 20,
          padding: '40px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          border: '1px solid #e2e8f0',
        }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }} className="auth-mobile-logo">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#C9A84C' }}>P</div>
            <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>PREMIA</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>Sign in to your PREMIA account</p>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address</label>
            <input
              type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box', transition: 'border 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <button style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box', transition: 'border 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#94a3b8' : '#0f172a', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s'
          }}>
            {loading
              ? <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              : <><span>Sign in</span><ArrowRight size={16} /></>}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: '20px 0 0' }}>
            New to PREMIA?{' '}
            <Link to="/register" style={{ color: '#C9A84C', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 11, color: '#94a3b8' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <Link to="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px', borderRadius: 10,
            border: '1.5px solid #e2e8f0', background: '#fff',
            fontSize: 13, fontWeight: 600, color: '#475569', textDecoration: 'none',
            boxSizing: 'border-box', transition: 'border 0.15s'
          }}>
            Browse without signing in
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .auth-left { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}
