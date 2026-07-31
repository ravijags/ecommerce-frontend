import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, X, Upload, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

const EMPTY = { name: '', description: '', price: '', stock: '', category: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => {
    setFiltered(search ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())) : products)
  }, [search, products])

  const fetchProducts = () => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/products`, { headers: { authorization: token } })
      .then(r => r.json()).then(d => { setProducts(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Fill in required fields'); return }
    const token = localStorage.getItem('token')
    setSubmitting(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (imageFile) data.append('image', imageFile)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, { method: 'POST', headers: { authorization: token }, body: data })
      if (res.ok) { toast.success('Product created!'); setShowForm(false); setForm(EMPTY); setImageFile(null); fetchProducts() }
      else toast.error('Failed to create')
    } catch { toast.error('Something went wrong') }
    finally { setSubmitting(false) }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, { method: 'DELETE', headers: { authorization: token } })
    if (res.ok) { toast.success('Deleted'); setProducts(p => p.filter(x => x._id !== id)) }
    else toast.error('Failed to delete')
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all bg-slate-50"

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} /></div></AdminLayout>

  return (
    <AdminLayout>
      {/* Toolbar */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <Search size={16} style={{ color: '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 text-sm outline-none" style={{ color: '#0f172a' }} />
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: showForm ? '#f1f5f9' : '#0f172a', color: showForm ? '#0f172a' : '#fff', cursor: 'pointer' }}>
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Product</>}
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }}
            className="rounded-2xl p-6 mb-6 bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <h3 className="font-black mb-5 text-sm uppercase tracking-wider" style={{ color: '#94a3b8' }}>New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Product name *', placeholder: 'iPhone 15 Pro', type: 'text' },
                { key: 'category', label: 'Category', placeholder: 'Electronics', type: 'text' },
                { key: 'price', label: 'Price (₹) *', placeholder: '99999', type: 'number' },
                { key: 'stock', label: 'Stock *', placeholder: '50', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className={inp} style={{ borderColor: '#e2e8f0', color: '#0f172a' }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#475569' }}>Description</label>
                <textarea placeholder="Product description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className={inp} style={{ borderColor: '#e2e8f0', color: '#0f172a', resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#475569' }}>Product Image</label>
                <div onClick={() => document.getElementById('img-upload').click()} className="rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-all"
                  style={{ borderColor: imageFile ? '#C9A84C' : '#e2e8f0', background: '#f8fafc' }}>
                  <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                  <Upload size={20} className="mx-auto mb-1.5" style={{ color: '#94a3b8' }} />
                  <p className="text-sm" style={{ color: '#64748b' }}>{imageFile ? imageFile.name : 'Click to upload image'}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                style={{ background: '#0f172a', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={15} />}
                {submitting ? 'Creating...' : 'Create Product'}
              </motion.button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #e2e8f0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f1f5f9' }}>
          <span className="text-sm font-semibold" style={{ color: '#64748b' }}>{filtered.length} products</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Image', 'Product', 'Category', 'Price', 'Stock', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
              {filtered.map((product, i) => (
                <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: '#f1f5f9' }}>
                      <img src={product.image?.startsWith('http') ? product.image : 'https://placehold.co/50x50'} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: '#0f172a' }}>{product.name}</p>
                    {product.brand && <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{product.brand}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2 py-1 rounded-lg capitalize font-medium" style={{ background: '#f1f5f9', color: '#475569' }}>{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold" style={{ color: '#0f172a' }}>₹{product.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: product.stock < 10 ? '#ef4444' : '#22c55e' }}>{product.stock}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteProduct(product._id)}
                      className="p-2 rounded-xl transition-all" style={{ color: '#94a3b8' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}>
                      <Trash2 size={15} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-sm" style={{ color: '#94a3b8' }}>No products found</div>}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
