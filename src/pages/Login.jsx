import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import PremiaLogo from '../components/PremiaLogo'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Login failed!')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      toast.success('Welcome back!')
      navigate('/')
    } catch {
      toast.error('Something went wrong!')
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>

      {/* Left panel – brand */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ background: '#0f172a' }}
      >
        <PremiaLogo variant="dark" size="lg" />

        <div>
          <p className="text-5xl font-black leading-tight mb-6" style={{ color: '#fff' }}>
            Everything Premium.<br />
            <span style={{ color: '#C9A84C' }}>Delivered.</span>
          </p>
          <p className="text-lg" style={{ color: '#94a3b8' }}>
            Sign in to access your orders, wishlist, and exclusive member deals.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { num: '194+', label: 'Premium Products' },
            { num: '50K+', label: 'Happy Customers' },
            { num: '4.8★', label: 'Average Rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black" style={{ color: '#C9A84C' }}>{s.num}</p>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel – form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden">
            <PremiaLogo variant="light" size="lg" />
          </div>

          <h1 className="text-3xl font-black mb-2" style={{ color: '#0f172a' }}>Welcome back</h1>
          <p className="mb-8" style={{ color: '#64748b' }}>Sign in to your PREMIA account</p>

          <div className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                style={{
                  borderColor: '#e2e8f0',
                  background: '#fff',
                  color: '#0f172a',
                }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold" style={{ color: '#0f172a' }}>Password</label>
                <button className="text-xs font-medium" style={{ color: '#C9A84C' }}>Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 text-sm outline-none transition-all"
                  style={{ borderColor: '#e2e8f0', background: '#fff', color: '#0f172a' }}
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
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
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
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </motion.button>

          </div>

          <p className="text-center text-sm mt-8" style={{ color: '#64748b' }}>
            New to PREMIA?{' '}
            <Link to="/register" className="font-bold" style={{ color: '#C9A84C' }}>
              Create an account
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
            <span className="text-xs" style={{ color: '#94a3b8' }}>or continue as</span>
            <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          </div>

          <Link
            to="/"
            className="w-full py-3 rounded-xl border-2 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ borderColor: '#e2e8f0', color: '#0f172a', display: 'flex' }}
          >
            <ShoppingBag size={16} />
            Browse without signing in
          </Link>

        </div>
      </motion.div>
    </div>
  )
}

export default Login
