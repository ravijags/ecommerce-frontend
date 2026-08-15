import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Wishlist({ wishlistItems, removeFromWishlist, addToCart, cartItemIds }) {
  const handleAddToCart = (item) => {
    addToCart(item)
    toast.success('Added to cart!')
  }

  if (!wishlistItems || wishlistItems.length === 0) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafafa', fontFamily: 'Inter, system-ui' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 360 }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <Heart size={64} color="#e2e8f0" fill="#f1f5f9" style={{ marginBottom: 20 }} />
        </motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Your wishlist is empty</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: '0 0 28px' }}>
          Save items you love by tapping the heart icon on any product.
        </p>
        <Link to="/">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', border: 'none', borderRadius: 14, padding: '14px 36px', fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', cursor: 'pointer', boxShadow: '0 8px 24px rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}>
            Explore Products <ArrowRight size={16} />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', padding: 'clamp(20px,4vw,36px) clamp(16px,5vw,24px) 80px', fontFamily: 'Inter, system-ui' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Heart size={24} color="#ef4444" fill="#ef4444" />
              My Wishlist
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          </div>
          <Link to="/" style={{ fontSize: 13, color: '#C9A84C', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="product-grid">
          <AnimatePresence>
            {wishlistItems.map((item, i) => {
              const inCart = cartItemIds?.has(item._id)
              const imageUrl = item.image || item.thumbnail || `https://placehold.co/400x300/f4f6f8/94a3b8?text=${encodeURIComponent(item.name?.slice(0,14)||'Product')}`
              const hasDiscount = item.originalPrice > item.price
              const discountPct = hasDiscount ? Math.round((item.originalPrice - item.price) / item.originalPrice * 100) : 0

              return (
                <motion.div key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.04 }}
                  style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                  {/* Discount badge */}
                  {discountPct > 0 && (
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                      {discountPct}% OFF
                    </div>
                  )}

                  {/* Remove button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => { removeFromWishlist(item._id); toast.success('Removed from wishlist') }}
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={13} color="#ef4444" />
                  </motion.button>

                  {/* Image */}
                  <Link to={`/products/${item._id}`}>
                    <div className="product-img-wrapper" style={{ background: '#f4f6f8' }}>
                      <img src={imageUrl} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10, transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.target.style.transform='scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform='scale(1)'}
                        onError={e => { e.target.src = `https://placehold.co/400x300/f4f6f8/94a3b8?text=Product` }} />
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {item.brand && <p style={{ fontSize: 10, fontWeight: 700, color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>{item.brand}</p>}
                    <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4em' }}>
                        {item.name}
                      </h3>
                    </Link>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>₹{item.price?.toLocaleString('en-IN')}</span>
                      {hasDiscount && <span style={{ fontSize: 11, color: '#c4c4c4', textDecoration: 'line-through' }}>₹{item.originalPrice?.toLocaleString('en-IN')}</span>}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleAddToCart(item)}
                      style={{ width: '100%', padding: '10px', borderRadius: 10, border: inCart ? '1.5px solid #bbf7d0' : 'none', background: inCart ? '#f0fdf4' : '#0f172a', color: inCart ? '#16a34a' : '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      <ShoppingCart size={13} />
                      {inCart ? 'In Cart' : 'Add to Cart'}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
