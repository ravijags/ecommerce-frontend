import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Users, TrendingUp, Package, ArrowRight, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import PremiaLogo from '../../components/PremiaLogo'

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-6"
      style={{ background: '#fff', border: '1px solid #e2e8f0' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <Activity size={14} style={{ color: '#cbd5e1' }} />
      </div>
      <p className="text-sm mb-1" style={{ color: '#64748b' }}>{label}</p>
      <p className="text-3xl font-black" style={{ color: '#0f172a' }}>{value}</p>
    </motion.div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers: { authorization: token } }).then(r => r.json()),
    ]).then(([ordersData, usersData]) => {
      const totalRevenue = (ordersData.orders || [])
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0)
      setStats({
        totalOrders: (ordersData.orders || []).length,
        totalUsers: (usersData.users || []).length,
        totalRevenue,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* Admin topbar */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#0f172a' }}>
        <PremiaLogo variant="dark" size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#C9A84C22', color: '#C9A84C' }}>
            Admin Panel
          </span>
          <Link to="/" className="text-xs font-medium" style={{ color: '#64748b' }}>← Back to Store</Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-black" style={{ color: '#0f172a' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Overview of your PREMIA store</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="#3b82f6" delay={0} />
          <StatCard icon={Users} label="Registered Users" value={stats.totalUsers} color="#22c55e" delay={0.1} />
          <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="#C9A84C" delay={0.2} />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              to: '/admin/orders',
              icon: ShoppingBag,
              title: 'Manage Orders',
              desc: 'View, filter, and update order statuses',
              color: '#3b82f6',
            },
            {
              to: '/admin/products',
              icon: Package,
              title: 'Manage Products',
              desc: 'Add new products, edit listings, remove items',
              color: '#22c55e',
            },
          ].map(({ to, icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                to={to}
                className="flex items-center gap-4 p-6 rounded-2xl transition-all group"
                style={{ background: '#fff', border: '1px solid #e2e8f0', display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: '#0f172a' }}>{title}</p>
                  <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{desc}</p>
                </div>
                <ArrowRight size={18} style={{ color: '#cbd5e1' }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default AdminDashboard
