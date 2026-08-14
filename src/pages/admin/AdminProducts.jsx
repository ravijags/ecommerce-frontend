import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  Search, Plus, Edit2, Trash2, Eye, LogOut, X,
  Menu, Upload, Check, ChevronUp, ChevronDown,
  Star, ArrowUpDown, Download
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL
const PAGE_SIZE = 20

const NAV = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/products', icon: Package,          label: 'Products' },
  { to: '/admin/users',    icon: Users,            label: 'Users' },
]

const CATEGORIES = [
  'smartphones','laptops','mobile-accessories','mens-shirts','mens-shoes',
  'beauty','skin-care','fragrances','mens-watches','furniture',
  'groceries','sports-accessories','sunglasses','tablets','kitchen-accessories'
]

// ── Tooltip wrapper ───────────────────────────────────────────────────────
function Tip({ label, children }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none' }}>
          {label}
        </div>
      )}
    </div>
  )
}

// ── Product Form Modal ────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave, token }) {
  const [form, setForm] = useState({
    name:          product?.name          || '',
    brand:         product?.brand         || '',
    category:      product?.category      || '',
    price:         product?.price         || '',
    originalPrice: product?.originalPrice || product?.price || '',
    discount:      product?.discount      || '',
    stock:         product?.stock         ?? '',
    description:   product?.description   || '',
    image:         product?.image || product?.thumbnail || '',
  })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [imgPreview, setImgPreview] = useState(form.image)
  const [imageFile, setImageFile] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return setError('Name, price and category are required')
    setSaving(true); setError('')
    try {
      const method = product?._id ? 'PUT' : 'POST'
      const url = product?._id ? `${API}/api/admin/products/${product._id}` : `${API}/api/admin/products`
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      data.set('price', Number(form.price))
      data.set('originalPrice', Number(form.originalPrice) || Number(form.price))
      data.set('discount', Number(form.discount) || 0)
      data.set('stock', Number(form.stock) || 0)
      if (imageFile) data.append('image', imageFile)
      const res = await fetch(url, { method, headers: { authorization: token }, body: data })
      const json = await res.json()
      if (!res.ok) return setError(json.message || json.error || 'Failed to save')
      onSave(json.product)
    } catch (e) { setError('Network error') }
    finally { setSaving(false) }
  }

  const L = { display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }
  const I = { width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, system-ui', background: '#fafafa', boxSizing: 'border-box' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 680, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {product?._id ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              {product?._id ? product.name?.slice(0, 40) : 'Fill in details to add product to catalogue'}
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f8fafc', borderRadius: 9, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div className="prod-modal" style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Image section */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 14 }}>
              {/* Preview */}
              <div style={{ width: 100, height: 100, borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f4f6f8', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imgPreview
                  ? <img src={imgPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} onError={() => setImgPreview('')} />
                  : <Package size={28} color="#cbd5e1" />
                }
              </div>
              <div style={{ flex: 1 }}>
                <label style={L}>Image URL</label>
                <input value={form.image} onChange={e => { set('image', e.target.value); setImgPreview(e.target.value) }}
                  placeholder="https://example.com/image.jpg" style={{ ...I, marginBottom: 8 }} />
                <div onClick={() => document.getElementById('prod-img-file').click()}
                  style={{ border: `1.5px dashed ${imageFile ? '#C9A84C' : '#e2e8f0'}`, borderRadius: 9, padding: '8px 12px', cursor: 'pointer', background: imageFile ? '#fef9ec' : '#fafafa', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input id="prod-img-file" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setImgPreview(URL.createObjectURL(f)) } }} />
                  <Upload size={14} color={imageFile ? '#C9A84C' : '#94a3b8'} />
                  <span style={{ fontSize: 11, color: imageFile ? '#C9A84C' : '#64748b', fontWeight: 600 }}>
                    {imageFile ? `✓ ${imageFile.name.slice(0, 25)}` : 'Or upload image file'}
                  </span>
                </div>
              </div>
            </div>

            {/* Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={L}>Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Apple iPhone 15 Pro Max" style={I} />
            </div>

            {/* Brand + Category */}
            <div>
              <label style={L}>Brand</label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Apple" style={I} />
            </div>
            <div>
              <label style={L}>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={I}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
              </select>
            </div>

            {/* Price + Original Price */}
            <div>
              <label style={L}>Sale Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="79999" style={I} />
            </div>
            <div>
              <label style={L}>Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="89999" style={I} />
            </div>

            {/* Discount + Stock */}
            <div>
              <label style={L}>Discount (%)</label>
              <input type="number" value={form.discount} onChange={e => set('discount', e.target.value)} placeholder="10" style={I} />
            </div>
            <div>
              <label style={L}>Stock Qty</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="50" style={I} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={L}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Product features and specifications..." rows={3}
                style={{ ...I, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, color: '#ef4444', fontSize: 12, fontWeight: 500 }}>{error}</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0, background: '#fafafa' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
            style={{ padding: '9px 24px', borderRadius: 9, border: 'none', background: saving ? '#92702a' : 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', fontSize: 13, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
            {saving ? <><div style={{ width: 13, height: 13, border: '2px solid #0f172a30', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</> : <><Check size={13} />{product?._id ? 'Save Changes' : 'Add Product'}</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Delete confirm ────────────────────────────────────────────────────────
function DeleteConfirm({ product, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        style={{ background: '#fff', borderRadius: 18, padding: 28, maxWidth: 360, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Trash2 size={20} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Delete Product?</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 22px', lineHeight: 1.6 }}>
          <strong>{product?.name?.slice(0, 40)}</strong> will be permanently removed from your catalogue.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts]       = useState([])
  const [filtered, setFiltered]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [catFilter, setCatFilter]     = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [sortKey, setSortKey]         = useState('name')
  const [sortDir, setSortDir]         = useState('asc')
  const [page, setPage]               = useState(1)
  const [modalProduct, setModalProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toastMsg, setToastMsg]       = useState('')
  const token = localStorage.getItem('token')

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

  useEffect(() => {
    fetch(`${API}/api/products?limit=500`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setFiltered(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let res = [...products]
    if (catFilter !== 'all') res = res.filter(p => p.category === catFilter)
    if (stockFilter === 'low')  res = res.filter(p => p.stock > 0 && p.stock <= 10)
    if (stockFilter === 'out')  res = res.filter(p => p.stock === 0)
    if (search) res = res.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
    )
    res.sort((a, b) => {
      const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? av - bv : bv - av
    })
    setFiltered(res)
    setPage(1)
  }, [search, catFilter, stockFilter, products, sortKey, sortDir])

  const toggleSort = (key) => { setSortKey(key); setSortDir(d => key === sortKey ? (d === 'asc' ? 'desc' : 'asc') : 'asc') }

  const handleSave = (saved) => {
    setProducts(prev => {
      const exists = prev.find(p => p._id === saved._id)
      return exists ? prev.map(p => p._id === saved._id ? saved : p) : [saved, ...prev]
    })
    setModalProduct(null)
    showToast(saved._id ? '✓ Product updated!' : '✓ Product added!')
  }

  const handleDelete = async () => {
    if (!deleteProduct) return
    try {
      await fetch(`${API}/api/admin/products/${deleteProduct._id}`, { method: 'DELETE', headers: { authorization: token } })
      setProducts(prev => prev.filter(p => p._id !== deleteProduct._id))
      showToast('✓ Product deleted')
    } catch {}
    setDeleteProduct(null)
  }

  const exportCSV = () => {
    const rows = [['Name','Brand','Category','Price','Stock','Rating']]
    filtered.forEach(p => rows.push([p.name, p.brand || '', p.category || '', p.price || 0, p.stock || 0, p.rating || 0]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'premia-products.csv'; a.click()
    showToast('✓ CSV exported!')
  }

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length
  const outOfStock = products.filter(p => p.stock === 0).length
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={11} color="#C9A84C" /> : <ChevronDown size={11} color="#C9A84C" />)
    : <ArrowUpDown size={10} color="#cbd5e1" />

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, system-ui' }}>
      <div className="admin-sidebar-desktop" style={{ height: '100vh', flexShrink: 0 }}><AdminSidebar /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div initial={{ x: -220 }} animate={{ x: 0 }} exit={{ x: -220 }} transition={{ type: 'tween', duration: 0.22 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41, height: '100vh' }}>
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 clamp(16px,3vw,28px)', height: 60, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
            <Menu size={20} color="#0f172a" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link to="/admin" style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
              <span style={{ color: '#cbd5e1', fontSize: 11 }}>›</span>
              <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 700 }}>Products</span>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
              {filtered.length} products · {lowStock > 0 && <span style={{ color: '#f97316' }}>{lowStock} low stock · </span>}{outOfStock > 0 && <span style={{ color: '#ef4444' }}>{outOfStock} out of stock</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Download size={13} /> Export CSV
            </button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModalProduct({})}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(201,168,76,0.3)', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> Add Product
            </motion.button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(14px,3vw,22px)' }}>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 9, padding: '0 12px' }}>
              <Search size={13} color="#94a3b8" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or brands..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, padding: '9px 0', background: 'transparent', color: '#0f172a', fontFamily: 'Inter, system-ui' }} />
              {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}><X size={12} color="#94a3b8" /></button>}
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 12, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
            </select>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
              style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 12, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              <option value="all">All Stock</option>
              <option value="low">Low Stock (≤10)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                    <th style={TH}>Product</th>
                    <th style={TH} onClick={() => toggleSort('category')} className="sortable">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>Category <SortIcon k="category" /></div>
                    </th>
                    <th style={TH} onClick={() => toggleSort('price')} className="sortable">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>Price <SortIcon k="price" /></div>
                    </th>
                    <th style={TH} onClick={() => toggleSort('stock')} className="sortable">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>Stock <SortIcon k="stock" /></div>
                    </th>
                    <th style={TH} onClick={() => toggleSort('rating')} className="sortable">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>Rating <SortIcon k="rating" /></div>
                    </th>
                    <th style={{ ...TH, width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Loading products...</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center' }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
                      <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>No products found</p>
                      <button onClick={() => { setSearch(''); setCatFilter('all'); setStockFilter('all') }}
                        style={{ padding: '8px 18px', borderRadius: 9, border: 'none', background: '#0f172a', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Clear filters
                      </button>
                    </td></tr>
                  ) : paginated.map((product, i) => {
                    const isLow = product.stock > 0 && product.stock <= 10
                    const isOut = product.stock === 0
                    return (
                      <motion.tr key={product._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.2) }}
                        style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa'}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 9, background: '#f4f6f8', border: '1px solid #e8ecf0', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {(product.image || product.thumbnail) ? (
                                <img src={product.image || product.thumbnail} alt={product.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                                  onError={e => { e.target.style.display = 'none' }} />
                              ) : <Package size={14} color="#cbd5e1" />}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{product.name}</p>
                              {product.brand && <p style={{ fontSize: 11, color: '#C9A84C', margin: 0, fontWeight: 600 }}>{product.brand}</p>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                            {product.category?.replace(/-/g,' ')}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>₹{product.price?.toLocaleString('en-IN')}</div>
                          {product.originalPrice > product.price && (
                            <div style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</div>
                          )}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: isOut ? '#fee2e2' : isLow ? '#fef9c3' : '#dcfce7', color: isOut ? '#991b1b' : isLow ? '#92400e' : '#166534', whiteSpace: 'nowrap' }}>
                            {isOut ? 'Out of stock' : isLow ? `${product.stock} left` : `${product.stock}`}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          {product.rating > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Star size={10} color="#f59e0b" fill="#f59e0b" />
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{product.rating?.toFixed(1)}</span>
                            </div>
                          ) : <span style={{ color: '#cbd5e1', fontSize: 11 }}>—</span>}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <Tip label="Edit">
                              <button onClick={() => setModalProduct(product)}
                                style={ActionBtn}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = '#fef9ec' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                <Edit2 size={12} color="#64748b" />
                              </button>
                            </Tip>
                            <Tip label="Delete">
                              <button onClick={() => setDeleteProduct(product)}
                                style={ActionBtn}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.background = '#fef2f2' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                <Trash2 size={12} color="#ef4444" />
                              </button>
                            </Tip>
                            <Tip label="View on store">
                              <a href={`/products/${product._id}`} target="_blank" rel="noopener noreferrer"
                                style={{ ...ActionBtn, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#eff6ff' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                <Eye size={12} color="#3b82f6" />
                              </a>
                            </Tip>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length} products
              </p>
              <div style={{ display: 'flex', gap: 5 }}>
                <button onClick={() => setPage(1)} disabled={page===1}
                  style={{ ...PagBtn, color: page===1?'#cbd5e1':'#64748b' }}>«</button>
                <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ ...PagBtn, color: page===1?'#cbd5e1':'#64748b' }}>‹ Prev</button>
                {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                  const p = Math.min(Math.max(page-2,1)+i,totalPages)
                  return p <= totalPages ? (
                    <button key={p} onClick={()=>setPage(p)}
                      style={{ ...PagBtn, borderColor: p===page?'#C9A84C':'#e2e8f0', background: p===page?'#fef9ec':'#fff', color: p===page?'#C9A84C':'#64748b', fontWeight: p===page?800:500 }}>
                      {p}
                    </button>
                  ) : null
                })}
                <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ ...PagBtn, color: page===totalPages?'#cbd5e1':'#64748b' }}>Next ›</button>
                <button onClick={() => setPage(totalPages)} disabled={page===totalPages}
                  style={{ ...PagBtn, color: page===totalPages?'#cbd5e1':'#64748b' }}>»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalProduct !== null && <ProductModal product={modalProduct?._id ? modalProduct : null} onClose={() => setModalProduct(null)} onSave={handleSave} token={token} />}
        {deleteProduct && <DeleteConfirm product={deleteProduct} onConfirm={handleDelete} onCancel={() => setDeleteProduct(null)} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '11px 18px', borderRadius: 11, fontSize: 13, fontWeight: 600, zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={13} color="#C9A84C" /> {toastMsg}
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
        .prod-modal input:focus, .prod-modal textarea:focus, .prod-modal select:focus {
          border-color: #C9A84C !important;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.1) !important;
        }
        th.sortable:hover { background: #f1f5f9 !important; cursor: pointer; }
      `}</style>
    </div>
  )
}

const TH = { padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap', userSelect: 'none' }
const ActionBtn = { width: 28, height: 28, borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }
const PagBtn = { padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }
