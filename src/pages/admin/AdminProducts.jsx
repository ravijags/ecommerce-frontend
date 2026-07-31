import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

const EMPTY = { name: '', category: '', price: '', stock: '', description: '' }

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = () => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/products`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Fill required fields'); return }
    const token = localStorage.getItem('token')
    setSubmitting(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (imageFile) data.append('image', imageFile)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        method: 'POST', headers: { authorization: token }, body: data
      })
      if (res.ok) { toast.success('Product created!'); setShowForm(false); setForm(EMPTY); setImageFile(null); fetchProducts() }
      else toast.error('Failed to create')
    } catch { toast.error('Something went wrong') }
    finally { setSubmitting(false) }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
      method: 'DELETE', headers: { authorization: token }
    })
    if (res.ok) { toast.success('Deleted'); setProducts(p => p.filter(x => x._id !== id)) }
    else toast.error('Failed to delete')
  }

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #C9A84C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Products</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{products.length} items in catalogue</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 18px', borderRadius: 10, border: 'none',
          background: showForm ? '#f1f5f9' : '#0f172a',
          color: showForm ? '#0f172a' : '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Product</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { key: 'name', label: 'Product name *', placeholder: 'iPhone 15 Pro', type: 'text' },
              { key: 'category', label: 'Category', placeholder: 'Electronics', type: 'text' },
              { key: 'price', label: 'Price (₹) *', placeholder: '99999', type: 'number' },
              { key: 'stock', label: 'Stock *', placeholder: '50', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <textarea placeholder="Product description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', background: '#f8fafc', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Image</label>
              <div onClick={() => document.getElementById('img-upload').click()}
                style={{ border: '2px dashed', borderColor: imageFile ? '#C9A84C' : '#e2e8f0', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
                <input id="img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files[0])} />
                <Upload size={20} style={{ color: '#94a3b8', margin: '0 auto 6px' }} />
                <p style={{ fontSize: 13, color: '#64748b' }}>{imageFile ? imageFile.name : 'Click to upload image'}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Creating...' : <><Plus size={14} /> Create Product</>}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Image', 'Product', 'Category', 'Price', 'Stock', ''].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9', overflow: 'hidden' }}>
                      <img src={product.image?.startsWith('http') ? product.image : 'https://placehold.co/44x44'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                    {product.brand && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{product.brand}</div>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                      {product.category?.replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    ₹{product.price?.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: product.stock < 10 ? '#dc2626' : '#16a34a' }}>
                    {product.stock}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => deleteProduct(product._id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts
