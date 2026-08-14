import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  Search, Plus, Edit2, Trash2, Eye, LogOut, X,
  Menu, AlertTriangle, ChevronDown, Upload,
  Star, Tag, BarChart2, RefreshCw, Check
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL

const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products', icon: Package,          label: 'Products' },
  { to: '/admin/users',    icon: Users,            label: 'Users' },
]

function Sidebar({ onClose }) {
  const navigate = useNavigate()
  return (
    <div style={{ width: 220, background: '#0f172a', height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#C9A84C', letterSpacing: '-0.5px' }}>PREMIA</div>
            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
          {onClose && <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>}
        </div>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = window.location.pathname === to
          return (
            <Link key={to} to={to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 3, textDecoration: 'none', transition: 'all 0.15s', background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent', color: isActive ? '#C9A84C' : '#475569', fontWeight: isActive ? 700 : 500, fontSize: 13 }}>
              <Icon size={16} />{label}
              {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C', marginLeft: 'auto' }} />}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', color: '#475569', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
          <Eye size={16} /> View Store
        </Link>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

// ── Product Form Modal ────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave, token }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    discount: product?.discount || '',
    stock: product?.stock || '',
    description: product?.description || '',
    image: product?.image || product?.thumbnail || '',
  })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [imgPreview, setImgPreview] = useState(form.image)

  const CATEGORIES = [
    'smartphones','laptops','mobile-accessories','mens-shirts','mens-shoes',
    'beauty','skin-care','fragrances','mens-watches','furniture',
    'groceries','sports-accessories','sunglasses','tablets','kitchen-accessories'
  ]

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const [imageFile, setImageFile] = useState(null)

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      return setError('Name, price and category are required')
    }
    setSaving(true); setError('')
    try {
      const method = product?._id ? 'PUT' : 'POST'
      const url    = product?._id
        ? `${import.meta.env.VITE_API_URL}/api/admin/products/${product._id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/products`

      const data = new FormData()
      data.append('name',          form.name)
      data.append('brand',         form.brand)
      data.append('category',      form.category)
      data.append('price',         Number(form.price))
      data.append('originalPrice', Number(form.originalPrice) || Number(form.price))
      data.append('discount',      Number(form.discount) || 0)
      data.append('stock',         Number(form.stock) || 0)
      data.append('description',   form.description)
      data.append('image',         form.image)
      if (imageFile) data.append('image', imageFile)

      const res = await fetch(url, {
        method,
        headers: { authorization: token },
        body: data,
      })
      const json = await res.json()
      if (!res.ok) return setError(json.message || json.error || 'Failed to save')
      onSave(json.product)
    } catch (e) { setError('Network error: ' + e.message) }
    finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 640,
          maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {product?._id ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
              {product?._id ? `Editing: ${product.name?.slice(0, 30)}` : 'Fill in product details below'}
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Image — URL or file upload */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Product Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <input value={form.image} onChange={e => { set('image', e.target.value); setImgPreview(e.target.value) }}
                    placeholder="Paste image URL — or upload file below"
                    style={{ ...inputStyle, marginBottom: 8 }} />
                  <div
                    onClick={() => document.getElementById('prod-img-upload').click()}
                    style={{ border: `2px dashed ${imageFile ? '#C9A84C' : '#e2e8f0'}`,
                      borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                      background: imageFile ? '#fef9ec' : '#fafafa',
                      display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}>
                    <input id="prod-img-upload" type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files[0]
                        if (file) {
                          setImageFile(file)
                          setImgPreview(URL.createObjectURL(file))
                        }
                      }} />
                    <Upload size={16} color={imageFile ? '#C9A84C' : '#94a3b8'} />
                    <span style={{ fontSize: 12, color: imageFile ? '#C9A84C' : '#64748b', fontWeight: 600 }}>
                      {imageFile ? `✓ ${imageFile.name}` : 'Or click to upload image file'}
                    </span>
                  </div>
                </div>
                {imgPreview && (
                  <div style={{ width: 80, height: 80, borderRadius: 12, border: '1px solid #e2e8f0',
                    background: '#f4f6f8', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={imgPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                      onError={() => setImgPreview('')} />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Apple iPhone 15 Pro Max 256GB"
                style={inputStyle} />
            </div>

            {/* Brand */}
            <div>
              <label style={labelStyle}>Brand</label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)}
                placeholder="e.g. Apple" style={inputStyle} />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label style={labelStyle}>Sale Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                placeholder="e.g. 79999" style={inputStyle} />
            </div>

            {/* Original Price */}
            <div>
              <label style={labelStyle}>Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)}
                placeholder="e.g. 89999" style={inputStyle} />
            </div>

            {/* Discount */}
            <div>
              <label style={labelStyle}>Discount (%)</label>
              <input type="number" value={form.discount} onChange={e => set('discount', e.target.value)}
                placeholder="e.g. 10" style={inputStyle} />
            </div>

            {/* Stock */}
            <div>
              <label style={labelStyle}>Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
                placeholder="e.g. 50" style={inputStyle} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the product features, specifications..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2',
              border: '1px solid #fecaca', borderRadius: 10, color: '#ef4444', fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0',
              background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave} disabled={saving}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none',
              background: saving ? '#92702a' : 'linear-gradient(135deg,#C9A84C,#e8b84b)',
              color: '#0f172a', fontSize: 13, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
            {saving
              ? <><div style={{ width: 14, height: 14, border: '2px solid #0f172a40', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</>
              : <><Check size={14} /> {product?._id ? 'Save Changes' : 'Add Product'}</>
            }
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, system-ui', background: '#fafafa', boxSizing: 'border-box', transition: 'border-color 0.15s' }

// ── Delete confirm ────────────────────────────────────────────────────────
function DeleteConfirm({ product, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 380, width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Trash2 size={22} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Delete Product?</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{product?.name?.slice(0, 40)}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts]     = useState([])
  const [filtered, setFiltered]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [modalProduct, setModalProduct] = useState(null)  // null=closed, {}=new, {...}=edit
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast]           = useState('')
  const token = localStorage.getItem('token')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    fetch(`${API}/api/products?limit=500`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setFiltered(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let res = products
    if (catFilter !== 'all') res = res.filter(p => p.category === catFilter)
    if (stockFilter === 'low')  res = res.filter(p => p.stock > 0 && p.stock <= 10)
    if (stockFilter === 'out')  res = res.filter(p => p.stock === 0)
    if (search) res = res.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(res)
  }, [search, catFilter, stockFilter, products])

  const handleSave = (savedProduct) => {
    setProducts(prev => {
      const exists = prev.find(p => p._id === savedProduct._id)
      if (exists) return prev.map(p => p._id === savedProduct._id ? savedProduct : p)
      return [savedProduct, ...prev]
    })
    setModalProduct(null)
    showToast(savedProduct._id ? '✓ Product updated!' : '✓ Product added!')
  }

  const handleDelete = async () => {
    if (!deleteProduct) return
    try {
      await fetch(`${API}/api/products/${deleteProduct._id}`, {
        method: 'DELETE', headers: { authorization: token },
      })
      setProducts(prev => prev.filter(p => p._id !== deleteProduct._id))
      showToast('✓ Product deleted')
    } catch {}
    setDeleteProduct(null)
  }

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const lowStock   = products.filter(p => p.stock > 0 && p.stock <= 10).length
  const outOfStock = products.filter(p => p.stock === 0).length

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>

      {/* Sidebar desktop */}
      <div className="admin-sidebar-desktop" style={{ height: '100vh' }}><Sidebar /></div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
          <motion.div initial={{ x: -220 }} animate={{ x: 0 }} style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}
            style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Products</h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              {filtered.length} of {products.length} products
              {lowStock > 0 && <span style={{ color: '#f97316', marginLeft: 8 }}>· {lowStock} low stock</span>}
              {outOfStock > 0 && <span style={{ color: '#ef4444', marginLeft: 8 }}>· {outOfStock} out of stock</span>}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setModalProduct({})}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
              borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#C9A84C,#e8b84b)',
              color: '#0f172a', fontSize: 13, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(201,168,76,0.3)', whiteSpace: 'nowrap' }}>
            <Plus size={15} /> Add Product
          </motion.button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px)' }}>

          {/* Search + filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 12px' }}>
              <Search size={14} color="#94a3b8" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, padding: '10px 0', background: 'transparent', color: '#0f172a', fontFamily: 'Inter, system-ui' }} />
              {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}><X size={13} color="#94a3b8" /></button>}
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 12, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 12, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              <option value="all">All Stock</option>
              <option value="low">Low Stock (≤10)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Products table */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((product, i) => {
                      const isLow  = product.stock > 0 && product.stock <= 10
                      const isOut  = product.stock === 0
                      return (
                        <motion.tr key={product._id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                          style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                          {/* Product */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f4f6f8', border: '1px solid #e8ecf0', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={product.image || product.thumbnail} alt={product.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                                  onError={e => { e.target.style.display = 'none' }} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                                  {product.name}
                                </p>
                                {product.brand && <p style={{ fontSize: 11, color: '#C9A84C', margin: 0, fontWeight: 600 }}>{product.brand}</p>}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                              {product.category?.replace(/-/g, ' ')}
                            </span>
                          </td>

                          {/* Price */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>₹{product.price?.toLocaleString('en-IN')}</div>
                            {product.originalPrice > product.price && (
                              <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</div>
                            )}
                          </td>

                          {/* Stock */}
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                              background: isOut ? '#fee2e2' : isLow ? '#fef9c3' : '#dcfce7',
                              color: isOut ? '#991b1b' : isLow ? '#92400e' : '#166534',
                            }}>
                              {isOut ? 'Out of stock' : isLow ? `${product.stock} left` : `${product.stock} in stock`}
                            </span>
                          </td>

                          {/* Rating */}
                          <td style={{ padding: '12px 16px' }}>
                            {product.rating > 0 ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Star size={11} color="#f59e0b" fill="#f59e0b" />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{product.rating?.toFixed(1)}</span>
                              </div>
                            ) : <span style={{ fontSize: 11, color: '#cbd5e1' }}>—</span>}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                                onClick={() => setModalProduct(product)}
                                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0',
                                  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = '#fef9ec' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                <Edit2 size={13} color="#64748b" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                                onClick={() => setDeleteProduct(product)}
                                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0',
                                  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.background = '#fef2f2' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                <Trash2 size={13} color="#ef4444" />
                              </motion.button>
                              <motion.a whileHover={{ scale: 1.08 }} href={`/products/${product._id}`} target="_blank"
                                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0',
                                  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.15s', textDecoration: 'none' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                <Eye size={13} color="#3b82f6" />
                              </motion.a>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {filtered.length === 0 && !loading && (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>No products found</p>
                  <button onClick={() => { setSearch(''); setCatFilter('all'); setStockFilter('all') }}
                    style={{ marginTop: 12, padding: '8px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalProduct !== null && (
          <ProductModal product={modalProduct?._id ? modalProduct : null}
            onClose={() => setModalProduct(null)}
            onSave={handleSave} token={token} />
        )}
        {deleteProduct && (
          <DeleteConfirm product={deleteProduct}
            onConfirm={handleDelete}
            onCancel={() => setDeleteProduct(null)} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff',
              padding: '12px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, zIndex: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={14} color="#C9A84C" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}
