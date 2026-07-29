import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import PremiaLogo from '../components/PremiaLogo'

const perks = [
  'Access to 194+ premium products',
  'Exclusive member discounts',
  'Order tracking & history',
  'Priority customer support', 
]

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Registration failed!')
        setLoading(false)
        return
      }
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch {
      toast.error('Something went wrong!')
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRegister()
  }

  const inputStyle = {
    borderColor: '#e2e8f0',
    background: '#fff',
    color: '#0f172a',
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>

      {/* Left – brand */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ background: '#0f172a' }}
      >
        <PremiaLogo variant="dark" size="lg" />

        <div>
          <p className="text-4xl font-black leading-tight mb-4" style={{ color: '#fff' }}>
            Join PREMIA.<br />
            <span style={{ color: '#C9A84C' }}>Shop smarter.</span>
          </p>
          <p className="mb-10" style={{ color: '#94a3b8' }}>
            Create your account and unlock member-only benefits.
          </p>

          <div className="space-y-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#C9A84C' }}>
                  <Check size={11} strokeWidth={3} color="#0f172a" />
                </div>
                <span className="text-sm" style={{ color: '#cbd5e1' }}>{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#334155' }}>
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>

      {/* Right – form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">

          <div className="flex justify-center mb-10 lg:hidden">
            <PremiaLogo variant="light" size="lg" />
          </div>

          <h1 className="text-3xl font-black mb-2" style={{ color: '#0f172a' }}>Create account</h1>
          <p className="mb-8" style={{ color: '#64748b' }}>Join thousands of PREMIA members</p>

          <div className="space-y-5">

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Full name</label>
              <input
                type="text"
                placeholder="Ravi Jags"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{
                      background: password.length >= i * 2
                        ? (password.length >= 8 ? '#22c55e' : '#C9A84C')
                        : '#e2e8f0'
                    }} />
                  ))}
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: loading ? '#94a3b8' : '#0f172a',
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create account <ArrowRight size={16} /></>
              )}
            </motion.button>

          </div>

          <p className="text-center text-sm mt-8" style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold" style={{ color: '#C9A84C' }}>
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}

export default Register
