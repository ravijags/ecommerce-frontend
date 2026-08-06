import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertTriangle, Package, ArrowLeft } from 'lucide-react'
import AdminLayout from './AdminLayout'

export default function AdminLowStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => {
        const low = (d.products || [])
          .filter(p => p.stock < 10)
          .sort((a, b) => a.stock - b.stock)
        setProducts(low)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', textDecoration: 'none', fontSize: 13 }}>
          <ArrowLeft size={15} /> Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={20} color="#d97706" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Low Stock Alert</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{products.length} products need restocking</p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Product', 'Category', 'Stock', 'Status'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={p.image || p.thumbnail || 'https://placehold.co/40'} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://placehold.co/40x40/f1f5f9/94a3b8?text=P' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#f1f5f9', color: '#64748b', textTransform: 'capitalize' }}>
                    {p.category?.replace(/-/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: p.stock === 0 ? '#dc2626' : p.stock < 5 ? '#d97706' : '#16a34a' }}>
                    {p.stock}
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>units</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                    background: p.stock === 0 ? '#fee2e2' : p.stock < 5 ? '#fef3c7' : '#fef9ec',
                    color: p.stock === 0 ? '#dc2626' : p.stock < 5 ? '#d97706' : '#d97706',
                  }}>
                    {p.stock === 0 ? 'Out of Stock' : p.stock < 5 ? 'Critical' : 'Low Stock'}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                All products are well stocked! 🎉
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
