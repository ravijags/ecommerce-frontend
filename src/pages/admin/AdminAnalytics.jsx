import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import {
  Menu, TrendingUp, ShoppingCart, Users, IndianRupee,
  ArrowUpRight, ArrowDownRight, Package, Star
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

// ── Simple line chart using SVG ───────────────────────────────────────────
function LineChart({ data, color = '#C9A84C', height = 120 }) {
  if (!data || data.length < 2) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>No data yet</div>
  const allZero = data.every(d => d.value === 0)
  if (allZero) return (
    <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <div style={{ fontSize: 28 }}>📊</div>
      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 500 }}>No activity in this period</p>
      <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0 }}>Try a wider date range</p>
    </div>
  )
  const max = Math.max(...data.map(d => d.value), 1)
  const min = Math.min(...data.map(d => d.value), 0)
  const range = max - min || 1
  const w = 600, h = height
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((d.value - min) / range) * (h - 20) - 10
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `0,${h} ${points} ${w},${h}`

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${color.replace('#','')})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * w
          const y = h - ((d.value - min) / range) * (h - 20) - 10
          return <circle key={i} cx={x} cy={y} r="3.5" fill={color} stroke="#fff" strokeWidth="2" />
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{data[0]?.label}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{data[data.length-1]?.label}</span>
      </div>
    </div>
  )
}

// ── Bar chart ─────────────────────────────────────────────────────────────
function BarChart({ data, color = '#3b82f6', height = 100 }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height }}>
      {data.map(({ label, value }, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <motion.div initial={{ height: 0 }} animate={{ height: Math.max(3, (value / max) * (height - 20)) }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
            style={{ width: '100%', background: `linear-gradient(to top, ${color}, ${color}99)`, borderRadius: '3px 3px 0 0', minHeight: 3 }} />
          <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalytics() {
  const [orders, setOrders]     = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [range, setRange]       = useState(30) // days
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/admin/orders`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/products?limit=500`, { headers: { authorization: token } }).then(r => r.json()),
      fetch(`${API}/api/admin/users`, { headers: { authorization: token } }).then(r => r.json()),
    ]).then(([od, pd, ud]) => {
      setOrders(od.orders || [])
      setProducts(pd.products || [])
      setUsers(ud.users || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 32, height: 32, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%' }} />
    </div>
  )

  // ── Calculations ──────────────────────────────────────────────────────
  const now = new Date()
  const rangeStart = new Date(now - range * 864e5)
  const prevStart  = new Date(now - range * 2 * 864e5)

  const inRange  = orders.filter(o => new Date(o.createdAt) >= rangeStart)
  const inPrev   = orders.filter(o => new Date(o.createdAt) >= prevStart && new Date(o.createdAt) < rangeStart)

  const revenue     = inRange.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const prevRevenue = inPrev.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const revChange   = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : null

  const orderCount     = inRange.length
  const prevOrderCount = inPrev.length
  const ordChange      = prevOrderCount > 0 ? ((orderCount - prevOrderCount) / prevOrderCount * 100).toFixed(1) : null

  const newUsers     = users.filter(u => new Date(u.createdAt) >= rangeStart).length
  const prevUsers    = users.filter(u => new Date(u.createdAt) >= prevStart && new Date(u.createdAt) < rangeStart).length
  const usersChange  = prevUsers > 0 ? ((newUsers - prevUsers) / prevUsers * 100).toFixed(1) : null

  const avgOrder     = orderCount > 0 ? Math.round(revenue / orderCount) : 0
  const prevAvg      = prevOrderCount > 0 ? Math.round(prevRevenue / prevOrderCount) : 0
  const avgChange    = prevAvg > 0 ? ((avgOrder - prevAvg) / prevAvg * 100).toFixed(1) : null

  // Revenue over time — use ALL orders for chart, range for stats
  const chartDays = Math.min(range, 30)
  const revenueChart = Array.from({ length: chartDays }, (_, i) => {
    const d = new Date(now - (chartDays - 1 - i) * 864e5)
    const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
    return {
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
    }
  })
  // If all values are 0, spread orders across chart for visual
  const hasChartData = revenueChart.some(d => d.value > 0)

  const ordersChart = Array.from({ length: chartDays }, (_, i) => {
    const d = new Date(now - (chartDays - 1 - i) * 864e5)
    return {
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: orders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString()).length
    }
  })
  const hasOrderChartData = ordersChart.some(d => d.value > 0)

  // Top products by revenue
  const productRevenue = {}
  orders.forEach(o => (o.items || []).forEach(item => {
    const id = item.product?._id || item.product
    const name = item.product?.name || 'Unknown'
    if (!productRevenue[id]) productRevenue[id] = { name, revenue: 0, count: 0 }
    productRevenue[id].revenue += (item.price || 0) * (item.quantity || 1)
    productRevenue[id].count += item.quantity || 1
  }))
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 8)

  // Orders by status
  const statusBreakdown = ['pending','processing','shipped','delivered','cancelled'].map(s => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: orders.filter(o => o.status === s).length,
  }))

  // Revenue by category
  const catRevenue = {}
  orders.forEach(o => (o.items || []).forEach(item => {
    const cat = item.product?.category || 'Other'
    catRevenue[cat] = (catRevenue[cat] || 0) + (item.price || 0) * (item.quantity || 1)
  }))
  const topCats = Object.entries(catRevenue).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label: label.replace(/-/g,' '), value }))

  const usersChart = Array.from({ length: chartDays }, (_, i) => {
    const d = new Date(now - (chartDays - 1 - i) * 864e5)
    return {
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: users.filter(u => new Date(u.createdAt).toDateString() === d.toDateString()).length
    }
  })

  const STATS = [
    { label: 'Total Revenue',   value: `₹${(revenue/1000).toFixed(1)}K`,      icon: IndianRupee,  color: '#C9A84C', change: revChange,   up: Number(revChange) >= 0 },
    { label: 'Total Orders',    value: orderCount,                              icon: ShoppingCart, color: '#3b82f6', change: ordChange,   up: Number(ordChange) >= 0 },
    { label: 'New Customers',   value: newUsers,                                icon: Users,        color: '#8b5cf6', change: usersChange, up: Number(usersChange) >= 0 },
    { label: 'Avg Order Value', value: `₹${avgOrder.toLocaleString('en-IN')}`, icon: TrendingUp,   color: '#10b981', change: avgChange,   up: Number(avgChange) >= 0 },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div className="admin-sidebar-desktop" style={{ height: '100vh', flexShrink: 0 }}><AdminSidebar /></div>

      {sidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <motion.div initial={{ x: -220 }} animate={{ x: 0 }} transition={{ type: 'tween', duration: 0.22 }}
            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link to="/admin" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 700 }}>Analytics</span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Performance overview</p>
          </div>
          {/* Date range selector */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[7, 14, 30, 90].map(d => (
              <button key={d} onClick={() => setRange(d)}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid', borderColor: range === d ? '#C9A84C' : '#e2e8f0', background: range === d ? '#fef9ec' : '#fff', fontSize: 12, fontWeight: range === d ? 800 : 500, color: range === d ? '#C9A84C' : '#64748b', cursor: 'pointer' }}>
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>

          {/* Stat cards */}
          <div className="analytics-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            {STATS.map(({ label, value, icon: Icon, color, change, up }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={color} />
                  </div>
                  {change !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: up ? '#16a34a' : '#ef4444' }}>
                      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(change)}%
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{label}</div>
                {change !== null && <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>vs previous {range} days</div>}
              </motion.div>
            ))}
          </div>

          {/* Revenue chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }} className="analytics-charts">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Revenue Trend</h3>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>Daily revenue over {range} days</p>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#C9A84C' }}>₹{(revenue/1000).toFixed(1)}K</div>
              </div>
              <LineChart data={revenueChart} color="#C9A84C" height={130} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Orders Trend</h3>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>Daily orders over {range} days</p>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#3b82f6' }}>{orderCount}</div>
              </div>
              <LineChart data={ordersChart} color="#3b82f6" height={130} />
            </motion.div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }} className="analytics-bottom">

            {/* Top products */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Products</h3>
              {topProducts.length === 0
                ? <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No data yet</p>
                : topProducts.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? '#C9A84C' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: i === 0 ? '#0f172a' : '#64748b', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{p.count} sold</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>₹{(p.revenue/1000).toFixed(1)}K</span>
                  </div>
                ))
              }
            </motion.div>

            {/* Revenue by category */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>By Category</h3>
              {topCats.length === 0
                ? <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No data yet</p>
                : <>
                  <BarChart data={topCats} color="#8b5cf6" height={100} />
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {topCats.slice(0, 3).map(({ label, value }, i) => {
                      const total = topCats.reduce((s, c) => s + c.value, 0)
                      const pct = total > 0 ? Math.round(value / total * 100) : 0
                      const COLORS = ['#8b5cf6','#3b82f6','#10b981']
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: '#475569', flex: 1, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              }
            </motion.div>

            {/* Order status + new users */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #ebebeb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {statusBreakdown.map(({ label, value }) => {
                  const total = orders.length || 1
                  const pct = Math.round(value / total * 100)
                  const COLORS = { Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#06b6d4', Delivered: '#10b981', Cancelled: '#ef4444' }
                  const color = COLORS[label] || '#94a3b8'
                  return (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{value} ({pct}%)</span>
                      </div>
                      <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          style={{ height: '100%', background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>New Customers ({range}d)</h4>
                <LineChart data={usersChart} color="#8b5cf6" height={60} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
          .analytics-stats { grid-template-columns: repeat(2,1fr) !important; }
          .analytics-charts { grid-template-columns: 1fr !important; }
          .analytics-bottom { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
