import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronLeft, Shield, Truck, RotateCcw, CheckCircle, Zap, Tag, Package, Clock, MapPin, CreditCard, Percent } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ProductCard from '../ProductCard'

export default function ProductDetail({ addToCart }) {
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedImage(0); setQuantity(1); setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product)
        setLoading(false)
        if (d.product?.category) {
          fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
            .then(r => r.json())
            .then(all => {
              const others = (all.products || [])
                .filter(p => p._id !== d.product._id && p.category === d.product.category)
                .sort(() => Math.random() - 0.5).slice(0, 5)
              setRelated(others)
            })
        }
      })
      .catch(() => { toast.error('Product not found!'); navigate('/') })
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product)
    setAddedToCart(true)
    toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!product) return null

  const images = [product.image, product.thumbnail, ...(product.images || [])].filter(u => u?.startsWith?.('http'))
  const unique = [...new Set(images)]
  if (unique.length === 0) unique.push('https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image')

  const hasDiscount = product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const savings = hasDiscount ? (product.originalPrice - product.price) : 0
  const emiPerMonth = product.price > 3000 ? Math.round(product.price / 12) : null
  const isLowStock = product.stock > 0 && product.stock <= 10
  const deliveryDate = new Date(); deliveryDate.setDate(deliveryDate.getDate() + 2)
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  // Split description into bullet points for richer display
  const descSentences = product.description
    ? product.description.split(/[.!]/).map(s => s.trim()).filter(s => s.length > 20)
    : []

  const SPECS = [
    product.brand && ['Brand', product.brand],
    product.category && ['Category', product.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())],
    product.stock > 0 && ['Availability', isLowStock ? `Only ${product.stock} left` : `${product.stock} units in stock`],
    product.rating > 0 && ['Customer Rating', `${product.rating.toFixed(1)} ★ (${((product.rating * 1000) | 0).toLocaleString()} reviews)`],
    savings > 0 && ['Savings', `₹${savings.toLocaleString('en-IN')} (${discountPct}% off)`],
    emiPerMonth && ['No-Cost EMI', `From ₹${emiPerMonth.toLocaleString('en-IN')}/month`],
    ['Delivery', `Free by ${deliveryStr}`],
    ['Sold by', 'PREMIA Official Store'],
    ['Warranty', '1 Year Brand Warranty'],
  ].filter(Boolean)

  const OFFERS = [
    { icon: Percent, color: '#7c3aed', bg: '#ede9fe', title: 'Bank Offer', desc: '10% cashback on PREMIA card. Min. ₹3,000' },
    { icon: Zap, color: '#2563eb', bg: '#dbeafe', title: 'No-Cost EMI', desc: `EMI from ₹${emiPerMonth?.toLocaleString('en-IN') || '999'}/month. No interest charged` },
    { icon: Tag, color: '#16a34a', bg: '#dcfce7', title: 'Partner Offer', desc: 'Buy with PREMIA Pay & get ₹200 cashback' },
  ]

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 64px', fontFamily: 'Inter, sans-serif' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#64748b', textDecoration: 'none' }}>
          <ChevronLeft size={14} /> Home
        </Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <Link to={`/?category=${product.category}`} style={{ color: '#64748b', textDecoration: 'none', textTransform: 'capitalize' }}>
          {product.category?.replace(/-/g, ' ')}
        </Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {product.name?.length > 45 ? product.name.slice(0, 45) + '…' : product.name}
        </span>
      </nav>

      {/* Main 2-col grid */}
      <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

        {/* ── LEFT: Images ── */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Thumbnails */}
            {unique.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {unique.slice(0, 6).map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} style={{
                    width: 58, height: 58, borderRadius: 10, overflow: 'hidden',
                    border: `2px solid ${selectedImage === i ? '#C9A84C' : '#e2e8f0'}`,
                    background: '#f8fafc', cursor: 'pointer', padding: 0, transition: 'border-color 0.15s',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://placehold.co/58x58/f1f5f9/94a3b8?text=?' }} />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <AnimatePresence mode="wait">
              <motion.div key={selectedImage}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ flex: 1, borderRadius: 18, background: '#f8fafc', aspectRatio: '1', overflow: 'hidden', position: 'relative', border: '1px solid #e2e8f0' }}>
                {hasDiscount && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, zIndex: 2 }}>
                    {discountPct}% OFF
                  </div>
                )}
                <img src={unique[selectedImage]} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20 }}
                  onError={e => { e.target.src = 'https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image' }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Brand badge */}
          {product.brand && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Visit the {product.brand} Store
              </span>
            </div>
          )}

          {/* Title */}
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.3px' }}>
            {product.name}
          </h1>

          {/* Rating row */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14}
                    fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                    color={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>
                {((product.rating * 1000) | 0).toLocaleString()} ratings
              </span>
              <span style={{ color: '#e2e8f0' }}>|</span>
              <span style={{ fontSize: 13, color: isLowStock ? '#ef4444' : '#16a34a', fontWeight: 600 }}>
                {product.stock === 0 ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left!` : `${product.stock} in stock`}
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'line-through' }}>
                  M.R.P.: ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#ef4444' }}>-{discountPct}%</span>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                  You save ₹{savings.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Inclusive of all taxes</p>
            {emiPerMonth && (
              <p style={{ fontSize: 13, color: '#0f172a', marginTop: 4 }}>
                EMI starts at <strong>₹{emiPerMonth.toLocaleString('en-IN')}</strong>.{' '}
                <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>No Cost EMI available</span>
              </p>
            )}
          </div>

          {/* Offers */}
          {product.price > 500 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag size={14} color="#C9A84C" /> Offers
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {OFFERS.map(({ icon: Icon, color, bg, title, desc }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: bg, borderRadius: 10, border: `1px solid ${color}25` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</p>
                      <p style={{ fontSize: 11, color: '#475569', margin: 0, marginTop: 1 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery + location */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Truck size={14} color="#16a34a" />
              <span style={{ fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                FREE delivery <strong>{deliveryStr}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={13} color="#64748b" />
              <span style={{ fontSize: 12, color: '#64748b' }}>Delivering to <strong style={{ color: '#0f172a' }}>New Delhi 110001</strong></span>
            </div>
          </div>

          {/* Qty + Add to Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '10px 14px', border: 'none', background: '#f8fafc', cursor: 'pointer', color: '#0f172a', fontSize: 16, fontWeight: 700 }}>−</button>
              <span style={{ padding: '10px 18px', fontWeight: 800, fontSize: 15, color: '#0f172a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} style={{ padding: '10px 14px', border: 'none', background: '#f8fafc', cursor: 'pointer', color: '#0f172a', fontSize: 16, fontWeight: 700 }}>+</button>
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>Max {product.stock || 99} per order</span>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.stock === 0}
              style={{
                flex: 1, padding: '13px', borderRadius: 12, border: 'none',
                background: addedToCart ? '#16a34a' : '#0f172a',
                color: '#fff', fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1, transition: 'background 0.2s',
              }}>
              <ShoppingCart size={16} />
              {addedToCart ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
            <button onClick={() => setWishlisted(w => !w)} style={{
              padding: '13px 16px', borderRadius: 12,
              border: `2px solid ${wishlisted ? '#ef4444' : '#e2e8f0'}`,
              background: wishlisted ? '#fef2f2' : '#fff',
              color: wishlisted ? '#ef4444' : '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
              <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Secure transaction */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <Shield size={13} color="#16a34a" />
            <span style={{ fontSize: 11, color: '#64748b' }}>Secure transaction · Sold by <strong style={{ color: '#0f172a' }}>PREMIA Official Store</strong></span>
          </div>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { Icon: Truck, title: 'Free Delivery', desc: 'Above ₹999' },
              { Icon: RotateCcw, title: '7-Day Return', desc: 'Easy returns' },
              { Icon: Shield, title: 'Secure Pay', desc: '100% safe' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center', padding: '10px 6px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <Icon size={18} color="#C9A84C" style={{ margin: '0 auto 5px' }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Protection plan */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>Add a Protection Plan</p>
            {[
              { label: '1 Year Complete Protection', price: '₹499' },
              { label: '2 Year Complete Protection', price: '₹799' },
            ].map(plan => (
              <label key={plan.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#C9A84C', width: 14, height: 14 }} />
                <span style={{ fontSize: 12, color: '#475569' }}>{plan.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginLeft: 'auto' }}>{plan.price}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* About this item */}
      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }} className="pd-about-grid">

        {/* Left: Description as bullets */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #0f172a', display: 'inline-block' }}>
            About this item
          </h2>
          {descSentences.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {descSentences.map((s, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle size={16} color="#C9A84C" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>{s}.</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.85, margin: 0 }}>{product.description}</p>
          )}
        </div>

        {/* Right: Tech specs */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 16 }}>Technical Details</h2>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            {SPECS.map(([label, value], i) => (
              <div key={label} style={{ display: 'flex', background: i % 2 === 0 ? '#f8fafc' : '#fff', borderBottom: i < SPECS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ padding: '9px 14px', fontSize: 12, color: '#64748b', fontWeight: 600, width: 120, flexShrink: 0 }}>{label}</div>
                <div style={{ padding: '9px 14px', fontSize: 12, color: '#0f172a', fontWeight: 500, borderLeft: '1px solid #f1f5f9', flex: 1 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 20 }}>
            Customers also viewed
          </h2>
          <div className="product-grid">
            {related.map(p => (
              <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                image={p.image || p.thumbnail || p.images?.[0]}
                rating={p.rating} discount={p.discount} originalPrice={p.originalPrice}
                brand={p.brand} onAddToCart={() => addToCart(p)}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pd-about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </main>
  )
}
