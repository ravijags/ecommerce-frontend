import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const PERKS = [
  'Access to 194+ premium products',
  'Exclusive member discounts & offers',
  'Order tracking & full history',
  'Priority customer support',
]

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const strength = password.length === 0 ? 0 : password.length < 4 ? 1 : password.length < 7 ? 2 : password.length < 10 ? 3 : 4
  const strengthColor = ['#e2e8f0', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'][strength]

  const handleRegister = async () => {
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.message || 'Registration failed'); setLoading(false); return }
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch { toast.error('Something went wrong'); setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box', transition: 'border 0.15s'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Left panel */}
      <div style={{
        width: '50%', background: '#0f172a',
        display: 'none', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px 56px',
      }} className="auth-left">

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#0f172a' }}>P</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', lineHeight: 1 }}>PREMIA</div>
            <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Premium Shopping</div>
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 12px' }}>
            Join PREMIA.<br />
            <span style={{ color: '#C9A84C' }}>Shop smarter.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 36 }}>
            Create your account and unlock<br />member-only benefits.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PERKS.map(perk => (
              <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} strokeWidth={3} color="#0f172a" />
                </div>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#334155' }}>
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#f8fafc' }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: '#fff', borderRadius: 20,
          padding: '40px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          border: '1px solid #e2e8f0',
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }} className="auth-mobile-logo">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#C9A84C' }}>P</div>
            <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>PREMIA</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Create account</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>Join thousands of PREMIA members</p>

          {[
            { label: 'Full name', value: name, set: setName, type: 'text', placeholder: 'Ravi Jags' },
            { label: 'Email address', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com' },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
              <input type={type} placeholder={placeholder} value={value}
                onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {password.length > 0 && (
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: strength >= i ? strengthColor : '#e2e8f0', transition: 'background 0.2s' }} />
                ))}
              </div>
            )}
          </div>

          <button onClick={handleRegister} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#94a3b8' : '#0f172a', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading
              ? <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              : <><span>Create account</span><ArrowRight size={16} /></>}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: '20px 0 0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#C9A84C', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
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
