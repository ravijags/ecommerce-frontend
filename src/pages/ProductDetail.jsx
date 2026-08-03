import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronLeft, Shield, Truck, RotateCcw, Plus, Minus, CheckCircle, Zap, Share2, Tag } from 'lucide-react'
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
    setSelectedImage(0)
    setQuantity(1)
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product)
        setLoading(false)
        // Fetch related products
        if (d.product?.category) {
          fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
            .then(r => r.json())
            .then(all => {
              const others = (all.products || [])
                .filter(p => p._id !== d.product._id && p.category === d.product.category)
                .sort(() => Math.random() - 0.5)
                .slice(0, 5)
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

  const images = [
    product.image, product.thumbnail,
    ...(product.images || [])
  ].filter(Boolean).filter(u => u.startsWith('http'))
  if (images.length === 0) images.push('https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image')
  const unique = [...new Set(images)]

  const hasDiscount = product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const savings = hasDiscount ? (product.originalPrice - product.price) : 0
  const emiPerMonth = product.price > 3000 ? Math.round(product.price / 12) : null
  const isLowStock = product.stock > 0 && product.stock <= 10

  // Delivery date — 2 days from now
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 64px', fontFamily: 'Inter, sans-serif' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 13 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
          <ChevronLeft size={15} /> Back
        </Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <Link to={`/?category=${product.category}`} style={{ color: '#64748b', textDecoration: 'none', textTransform: 'capitalize' }}>
          {product.category?.replace(/-/g, ' ')}
        </Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {product.name?.length > 40 ? product.name.slice(0, 40) + '…' : product.name}
        </span>
      </nav>

      {/* Main grid */}
      <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

        {/* ── LEFT: Images ── */}
        <div style={{ display: 'flex', gap: 12, position: 'sticky', top: 100 }}>
          {unique.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {unique.slice(0, 6).map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} style={{
                  width: 60, height: 60, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                  border: `2px solid ${selectedImage === i ? '#C9A84C' : '#e2e8f0'}`,
                  background: '#f8fafc', cursor: 'pointer', padding: 0, transition: 'border-color 0.15s',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://placehold.co/60x60/f1f5f9/94a3b8?text=?' }} />
                </button>
              ))}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={selectedImage}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              style={{ flex: 1, borderRadius: 20, background: '#f8fafc', aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
              {hasDiscount && (
                <div style={{ position: 'absolute', top: 14, left: 14, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, zIndex: 2 }}>
                  {discountPct}% OFF
                </div>
              )}
              <img src={unique[selectedImage]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }}
                onError={e => { e.target.src = 'https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image' }} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Info ── */}
        <div>
          {/* Brand */}
          {product.brand && (
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: 12, letterSpacing: '-0.4px' }}>
            {product.name}
          </h1>

          {/* Rating + stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {product.rating > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#0f172a', borderRadius: 6, padding: '3px 8px' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#C9A84C' }}>{product.rating.toFixed(1)}</span>
                  <Star size={10} fill="#C9A84C" color="#C9A84C" />
                </div>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  {((product.rating * 1000) | 0).toLocaleString()} reviews
                </span>
                <span style={{ color: '#e2e8f0' }}>|</span>
              </>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: isLowStock ? '#ef4444' : product.stock === 0 ? '#ef4444' : '#16a34a' }}>
              {product.stock === 0 ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left!` : `${product.stock} in stock`}
            </span>
          </div>

          {/* Price block */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: 16, color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 6 }}>
                    {discountPct}% off
                  </span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, margin: '0 0 4px' }}>
                You save ₹{savings.toLocaleString('en-IN')} on this order
              </p>
            )}
            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Inclusive of all taxes · Free delivery above ₹999</p>
            {emiPerMonth && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '6px 0 0', borderTop: '1px solid #e2e8f0' }}>
                <Zap size={12} color="#3b82f6" />
                <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>
                  No-cost EMI from ₹{emiPerMonth.toLocaleString('en-IN')}/month
                </span>
              </div>
            )}
          </div>

          {/* Delivery info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 16 }}>
            <Truck size={15} color="#16a34a" />
            <span style={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>
              Free delivery by <strong>{deliveryStr}</strong>
            </span>
          </div>

          {/* Specs table */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
              Key Specifications
            </p>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              {[
                product.brand && ['Brand', product.brand],
                product.category && ['Category', product.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())],
                product.stock > 0 && ['Availability', isLowStock ? `Only ${product.stock} left` : 'In Stock'],
                product.rating > 0 && ['Rating', `${product.rating.toFixed(1)} / 5 (${((product.rating * 1000) | 0).toLocaleString()} reviews)`],
                savings > 0 && ['You Save', `₹${savings.toLocaleString('en-IN')} (${discountPct}% off)`],
              ].filter(Boolean).map(([label, value], i) => (
                <div key={label} style={{
                  display: 'flex',
                  background: i % 2 === 0 ? '#f8fafc' : '#fff',
                  borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none',
                }}>
                  <div style={{ padding: '10px 14px', fontSize: 12, color: '#64748b', fontWeight: 600, minWidth: 130, flexShrink: 0 }}>{label}</div>
                  <div style={{ padding: '10px 14px', fontSize: 12, color: '#0f172a', fontWeight: 500, borderLeft: '1px solid #f1f5f9' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Qty</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#0f172a', fontSize: 16, fontWeight: 700 }}>−</button>
              <span style={{ padding: '8px 16px', fontWeight: 800, fontSize: 15, color: '#0f172a', minWidth: 36, textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} style={{ padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#0f172a', fontSize: 16, fontWeight: 700 }}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.stock === 0}
              style={{
                flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                background: addedToCart ? '#16a34a' : '#0f172a',
                color: '#fff', fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1,
                transition: 'background 0.2s',
              }}>
              <ShoppingCart size={17} />
              {addedToCart ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
            <button onClick={() => setWishlisted(w => !w)} style={{
              padding: '14px 16px', borderRadius: 12,
              border: `2px solid ${wishlisted ? '#ef4444' : '#e2e8f0'}`,
              background: wishlisted ? '#fef2f2' : '#fff',
              color: wishlisted ? '#ef4444' : '#94a3b8', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
              <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
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
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>About this product</h2>
          <p style={{ color: '#475569', lineHeight: 1.85, fontSize: 14, maxWidth: 720, margin: 0 }}>{product.description}</p>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginBottom: 20 }}>
            You might also like
          </h2>
          <div className="product-grid">
            {related.map(p => (
              <ProductCard
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price}
                image={p.image || p.thumbnail || p.images?.[0]}
                rating={p.rating}
                discount={p.discount}
                originalPrice={p.originalPrice}
                brand={p.brand}
                onAddToCart={() => addToCart(p)}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </main>
  )
}
