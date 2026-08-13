import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronLeft, Shield, Truck, RotateCcw, CheckCircle, Zap, Tag, Package, MapPin, Percent, Share2, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ProductCard from '../ProductCard'
import { addRecentlyViewed } from '../recentlyViewed'
import { getWishlist } from '../wishlistStore'

export default function ProductDetail({ addToCart, addToWishlist, removeFromWishlist, cartItemIds, wishlistIds }) {
  const { id }       = useParams()
  const navigate     = useNavigate()

  const [product, setProduct]         = useState(null)
  const [related, setRelated]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity]       = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [selectedProtection, setSelectedProtection] = useState(null)

  const isWishlisted = wishlistIds
    ? wishlistIds.has(id)
    : getWishlist().some(p => p._id === id)

  useEffect(() => {
    setSelectedImage(0); setQuantity(1); setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product)
        setLoading(false)
        if (d.product) {
          document.title = `${d.product.name} — PREMIA`
          addRecentlyViewed(d.product)
        }
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

  const handleWishlist = () => {
    if (isWishlisted) { if (removeFromWishlist) removeFromWishlist(id) }
    else { if (addToWishlist) addToWishlist(product) }
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        style={{ width: 36, height: 36, border: '3px solid #f1f5f9', borderTopColor: '#C9A84C', borderRadius: '50%' }} />
    </div>
  )
  if (!product) return null

  const images = [product.image, product.thumbnail, ...(product.images || [])].filter(u => u?.startsWith?.('http'))
  const unique = [...new Set(images)]
  if (unique.length === 0) unique.push('https://placehold.co/600x600/f4f6f8/94a3b8?text=No+Image')

  const hasDiscount = product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const savings     = hasDiscount ? (product.originalPrice - product.price) : 0
  const emiPerMonth = product.price > 3000 ? Math.round(product.price / 12) : null
  const isLowStock  = product.stock > 0 && product.stock <= 10
  const isOutOfStock = product.stock === 0
  const deliveryDate = new Date(); deliveryDate.setDate(deliveryDate.getDate() + 2)
  const deliveryStr  = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const inCart = cartItemIds?.has(id) || addedToCart

  const descSentences = product.description
    ? product.description.split(/[.!]/).map(s => s.trim()).filter(s => s.length > 20)
    : []

  const SPECS = [
    product.brand    && ['Brand', product.brand],
    product.category && ['Category', product.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())],
    product.stock > 0 && ['Stock', isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`],
    product.rating > 0 && ['Rating', `${product.rating.toFixed(1)} ★ (${((product.rating * 1000) | 0).toLocaleString()} reviews)`],
    savings > 0 && ['You Save', `₹${savings.toLocaleString('en-IN')} (${discountPct}% off)`],
    emiPerMonth && ['EMI From', `₹${emiPerMonth.toLocaleString('en-IN')}/month`],
    ['Delivery', `Free by ${deliveryStr}`],
    ['Sold by', 'PREMIA Official Store'],
    ['Warranty', '1 Year Brand Warranty'],
  ].filter(Boolean)

  const OFFERS = [
    { icon: Percent, color: '#7c3aed', bg: '#ede9fe', title: 'Bank Offer', desc: '10% cashback on PREMIA card. Min. ₹3,000' },
    { icon: Zap,     color: '#2563eb', bg: '#dbeafe', title: 'No-Cost EMI', desc: `From ₹${emiPerMonth?.toLocaleString('en-IN') || '999'}/month. No interest charged` },
    { icon: Tag,     color: '#16a34a', bg: '#dcfce7', title: 'Partner Offer', desc: 'Buy with PREMIA Pay & get ₹200 cashback' },
  ]

  const PROTECTION_PLANS = [
    { id: '1yr', label: '1 Year Complete Protection', price: 499 },
    { id: '2yr', label: '2 Year Complete Protection', price: 799 },
  ]

  // Reviews
  const rating  = product.rating || 4.2
  const count   = ((rating * 1000) | 0)
  const dist    = [Math.round(count * 0.55), Math.round(count * 0.22), Math.round(count * 0.13), Math.round(count * 0.06), Math.round(count * 0.04)]
  const NAMES   = ['Arjun S.','Priya M.','Rahul K.','Sneha R.','Vikram P.','Anjali T.','Rohit G.']
  const REVIEWS_TEXT = [
    'Excellent product! Exactly as described. Very happy with the quality and finish.',
    'Good value for money. Delivery was fast and packaging was premium quality.',
    'Product is decent. Met my expectations. Would definitely recommend to others.',
    'Amazing quality! Better than expected. The build quality is impressive.',
  ]
  const reviews = Array.from({ length: 4 }, (_, i) => ({
    name: NAMES[i % NAMES.length],
    rating: Math.min(5, Math.max(3, Math.round(rating + (i % 2 === 0 ? 0.5 : -0.3)))),
    date: new Date(Date.now() - (i + 1) * 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    comment: REVIEWS_TEXT[i % REVIEWS_TEXT.length],
    verified: i < 3,
  }))

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(12px,3vw,24px) clamp(12px,3vw,24px) 64px', fontFamily: 'Inter, sans-serif' }}>

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
          {product.name?.length > 40 ? product.name.slice(0, 40) + '…' : product.name}
        </span>
      </nav>

      {/* ── MAIN GRID ── */}
      <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>

        {/* ── LEFT: Images ── */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Thumbnails — desktop: left column, mobile: hidden (shown below) */}
            {unique.length > 1 && (
              <div className="pd-thumbnails" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {unique.slice(0, 6).map((img, i) => (
                  <motion.button key={i} onClick={() => setSelectedImage(i)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{
                      width: 58, height: 58, borderRadius: 10, overflow: 'hidden',
                      border: `2px solid ${selectedImage === i ? '#C9A84C' : '#e2e8f0'}`,
                      background: '#f4f6f8', cursor: 'pointer', padding: 0,
                      transition: 'border-color 0.15s',
                      boxShadow: selectedImage === i ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
                    }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                      onError={e => { e.target.src = 'https://placehold.co/58x58/f4f6f8/94a3b8?text=?' }} />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Main image */}
            <AnimatePresence mode="wait">
              <motion.div key={selectedImage}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ flex: 1, borderRadius: 20, background: '#f4f6f8',
                  aspectRatio: '1', overflow: 'hidden', position: 'relative',
                  border: '1px solid #e8ecf0',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                {hasDiscount && (
                  <div style={{ position: 'absolute', top: 14, left: 14, background: '#ef4444', color: '#fff',
                    fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, zIndex: 2 }}>
                    {discountPct}% OFF
                  </div>
                )}
                {isOutOfStock && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, borderRadius: 20 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#64748b', letterSpacing: '0.1em' }}>OUT OF STOCK</span>
                  </div>
                )}
                <img src={unique[selectedImage]} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24,
                    transition: 'transform 0.4s ease', cursor: 'zoom-in' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => { e.target.src = 'https://placehold.co/600x600/f4f6f8/94a3b8?text=No+Image' }} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile thumbnails — horizontal scroll below main image */}
          {unique.length > 1 && (
            <div className="pd-mobile-thumbs" style={{ display: 'none', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {unique.slice(0, 6).map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                    border: `2px solid ${selectedImage === i ? '#C9A84C' : '#e2e8f0'}`,
                    background: '#f4f6f8', cursor: 'pointer', padding: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                    onError={e => { e.target.src = 'https://placehold.co/52x52/f4f6f8/94a3b8?text=?' }} />
                </button>
              ))}
            </div>
          )}

          {/* Share button — desktop */}
          <button onClick={() => {
            const url = window.location.href
            if (navigator.share) navigator.share({ title: product.name, url })
            else navigator.clipboard.writeText(url).then(() => toast.success('Link copied!'))
          }} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '8px 14px',
            borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
            fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Share2 size={13} /> Share
          </button>
        </div>

        {/* ── RIGHT: Info ── */}
        <div>
          {/* Brand */}
          {product.brand && (
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 8 }}>
              {product.brand} Store
            </p>
          )}

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#0f172a',
            lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.3px' }}>
            {product.name}
          </h1>

          {/* Rating row */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              paddingBottom: 16, borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14}
                    fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                    color={s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db'} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>
                {((product.rating * 1000) | 0).toLocaleString()} ratings
              </span>
              <span style={{ color: '#e2e8f0' }}>|</span>
              <span style={{ fontSize: 13, fontWeight: 600,
                color: isOutOfStock ? '#ef4444' : isLowStock ? '#f97316' : '#16a34a' }}>
                {isOutOfStock ? '❌ Out of Stock' : isLowStock ? `⚡ Only ${product.stock} left!` : '✓ In Stock'}
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>-{discountPct}%</span>
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                  Save ₹{savings.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Inclusive of all taxes</p>
            {emiPerMonth && (
              <p style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
                No-cost EMI from <strong style={{ color: '#0f172a' }}>₹{emiPerMonth.toLocaleString('en-IN')}/mo</strong>
              </p>
            )}
          </div>

          {/* Offers */}
          {product.price > 500 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag size={13} color="#C9A84C" /> Available Offers
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {OFFERS.map(({ icon: Icon, color, bg, title, desc }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '9px 12px', background: bg, borderRadius: 10,
                    border: `1px solid ${color}20` }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={13} color="#fff" />
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

          {/* Delivery */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12,
            padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <Truck size={14} color="#16a34a" />
              <span style={{ fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                FREE delivery <strong>{deliveryStr}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={12} color="#64748b" />
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Delivering to <strong style={{ color: '#0f172a' }}>New Delhi 110001</strong>
              </span>
            </div>
          </div>

          {/* Qty + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            {/* Qty control */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0',
              borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '10px 14px', border: 'none', background: '#f8fafc',
                  cursor: 'pointer', color: '#0f172a', fontSize: 16, fontWeight: 700 }}>
                <Minus size={14} />
              </button>
              <span style={{ padding: '10px 18px', fontWeight: 800, fontSize: 15, color: '#0f172a',
                borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                {quantity}
              </span>
              <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                style={{ padding: '10px 14px', border: 'none', background: '#f8fafc',
                  cursor: 'pointer', color: '#0f172a', fontSize: 16, fontWeight: 700 }}>
                <Plus size={14} />
              </button>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Max {product.stock || 99}</span>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <motion.button whileTap={{ scale: 0.98 }} onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                background: addedToCart ? '#16a34a' : inCart ? '#f0fdf4' : '#0f172a',
                color: addedToCart ? '#fff' : inCart ? '#16a34a' : '#fff',
                border: inCart && !addedToCart ? '1.5px solid #bbf7d0' : 'none',
                fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                opacity: isOutOfStock ? 0.5 : 1, transition: 'background 0.2s',
                boxShadow: !inCart && !isOutOfStock ? '0 4px 16px rgba(15,23,42,0.15)' : 'none',
              }}>
              <ShoppingCart size={16} />
              {addedToCart ? '✓ Added to Cart!' : inCart ? '✓ In Cart' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>

            <motion.button whileTap={{ scale: 0.95 }} onClick={handleWishlist}
              style={{
                padding: '14px 18px', borderRadius: 12,
                border: `2px solid ${isWishlisted ? '#ef4444' : '#e2e8f0'}`,
                background: isWishlisted ? '#fef2f2' : '#fff',
                color: isWishlisted ? '#ef4444' : '#94a3b8',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                transition: 'all 0.2s',
              }}>
              <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} />
            </motion.button>
          </div>

          {/* Secure badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
            background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <Shield size={13} color="#16a34a" />
            <span style={{ fontSize: 11, color: '#64748b' }}>
              Secure transaction · Sold by <strong style={{ color: '#0f172a' }}>PREMIA Official Store</strong>
            </span>
          </div>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { Icon: Truck,     title: 'Free Delivery', desc: 'Above ₹999' },
              { Icon: RotateCcw, title: '7-Day Return',  desc: 'Easy returns' },
              { Icon: Shield,    title: 'Secure Pay',    desc: '100% safe' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center', padding: '10px 6px', background: '#f8fafc',
                borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <Icon size={18} color="#C9A84C" style={{ margin: '0 auto 5px' }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Protection plan — premium styled */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: '0 0 10px',
              display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={13} color="#C9A84C" /> Add a Protection Plan
            </p>
            {PROTECTION_PLANS.map(plan => (
              <motion.div key={plan.id} whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedProtection(selectedProtection === plan.id ? null : plan.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  background: selectedProtection === plan.id ? '#fef9ec' : '#f8fafc',
                  border: `1.5px solid ${selectedProtection === plan.id ? '#C9A84C' : '#e2e8f0'}`,
                  transition: 'all 0.15s',
                }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${selectedProtection === plan.id ? '#C9A84C' : '#cbd5e1'}`,
                  background: selectedProtection === plan.id ? '#C9A84C' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedProtection === plan.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <span style={{ fontSize: 12, color: '#0f172a', flex: 1 }}>{plan.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: selectedProtection === plan.id ? '#C9A84C' : '#0f172a' }}>
                  ₹{plan.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ABOUT + SPECS ── */}
      <div className="pd-about-grid" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 20,
            paddingBottom: 12, borderBottom: '2px solid #0f172a', display: 'inline-block' }}>
            About this item
          </h2>
          {descSentences.length > 0 ? (
            <>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(showFullDesc ? descSentences : descSentences.slice(0, 4)).map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle size={15} color="#C9A84C" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>{s}.</span>
                  </motion.li>
                ))}
              </ul>
              {descSentences.length > 4 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14,
                    background: 'none', border: 'none', color: '#C9A84C', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer', padding: '4px 0' }}>
                  {showFullDesc ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
                </button>
              )}
            </>
          ) : (
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.85 }}>{product.description}</p>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>Technical Details</h2>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            {SPECS.map(([label, value], i) => (
              <div key={label} style={{ display: 'flex', background: i % 2 === 0 ? '#f8fafc' : '#fff',
                borderBottom: i < SPECS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ padding: '9px 14px', fontSize: 11, color: '#64748b', fontWeight: 600,
                  width: 110, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ padding: '9px 14px', fontSize: 12, color: '#0f172a', fontWeight: 500,
                  borderLeft: '1px solid #f1f5f9', flex: 1 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FREQUENTLY BOUGHT TOGETHER ── */}
      {related.length >= 2 && (
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 20 }}>
            Frequently Bought Together
          </h2>
          <div className="fbt-container" style={{ background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: 'clamp(16px,3vw,24px)', display: 'flex', alignItems: 'center',
            gap: 'clamp(12px,2vw,20px)', flexWrap: 'wrap' }}>
            {/* Current product */}
            {[product, related[0]].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,16px)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 80 }}>
                  <Link to={i > 0 ? `/products/${p._id}` : '#'}>
                    <div style={{ width: 72, height: 72, borderRadius: 12, background: '#fff',
                      border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex',
                      alignItems: 'center', justifyContent: 'center' }}>
                      <img src={p.image || p.thumbnail} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                    </div>
                  </Link>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a',
                    textAlign: 'center', maxWidth: 90, lineHeight: 1.3 }}>
                    {p.name?.slice(0, 22)}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#C9A84C' }}>
                    ₹{p.price?.toLocaleString('en-IN')}
                  </span>
                </div>
                {i === 0 && (
                  <span style={{ fontSize: 22, color: '#94a3b8', fontWeight: 300, flexShrink: 0 }}>+</span>
                )}
              </div>
            ))}
            {/* Total + CTA */}
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <div>
                <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px', textAlign: 'right' }}>Combined price</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  ₹{((product.price || 0) + (related[0]?.price || 0)).toLocaleString('en-IN')}
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => { addToCart({...product, _suppressToast: true}); addToCart({...related[0], _suppressToast: true}); toast.success('Both items added to cart! 🛒') }}
                style={{ padding: '11px 22px', borderRadius: 12, border: 'none',
                  background: '#C9A84C', color: '#0f172a', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
                Add Both to Cart
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMER REVIEWS ── */}
      {product.rating > 0 && (
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>Customer Reviews</h2>

          {/* Rating summary */}
          <div className="pd-reviews-grid" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 28, marginBottom: 28, alignItems: 'start' }}>
            <div style={{ textAlign: 'center', padding: '20px 16px', background: '#f8fafc',
              borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{rating.toFixed(1)}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '8px 0' }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(rating) ? '#f59e0b' : '#e2e8f0', fontSize: 16 }}>★</span>)}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{count.toLocaleString()} ratings</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[5,4,3,2,1].map((star, i) => (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#64748b', width: 8, flexShrink: 0 }}>{star}</span>
                  <span style={{ color: '#f59e0b', fontSize: 12 }}>★</span>
                  <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', minWidth: 0 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(dist[5-star] / count * 100)}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', background: '#f59e0b', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8', width: 40, flexShrink: 0, textAlign: 'right' }}>
                    {dist[5-star].toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0f172a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: '#C9A84C', flexShrink: 0 }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r.rating ? '#f59e0b' : '#e2e8f0', fontSize: 12 }}>★</span>)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.date}</div>
                    {r.verified && <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>✓ Verified Purchase</div>}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{r.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── RELATED PRODUCTS ── */}
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
                onAddToWishlist={() => addToWishlist && addToWishlist(p)}
                onRemoveFromWishlist={removeFromWishlist}
                isInCart={cartItemIds?.has(p._id) || false}
                isWishlisted={wishlistIds?.has(p._id) || false}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .pd-about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pd-reviews-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .pd-thumbnails { display: none !important; }
          .pd-mobile-thumbs { display: flex !important; }

        }
      `}</style>
    </main>
  )
}
