import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Wishlist({ wishlistItems, removeFromWishlist, addToCart }) {

  const moveToCart = (product) => {
    addToCart(product)
    removeFromWishlist(product._id)
    toast.success('Moved to cart!')
  }

  if (wishlistItems.length === 0) {
    return (
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Heart size={40} color="#fca5a5" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Your wishlist is empty</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 32px', lineHeight: 1.6 }}>
            Save items you love by tapping the ♡ heart on any product.
          </p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Browse Products
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Wishlist</h1>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#fef2f2', color: '#ef4444' }}>
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items — clean list layout, no ProductCard to avoid double heart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {wishlistItems.map(product => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 16, padding: '16px',
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}
            >
              {/* Image */}
              <Link to={`/products/${product._id}`} style={{ flexShrink: 0, display: 'block' }}>
                <div style={{ width: 80, height: 80, borderRadius: 12, background: '#f8fafc', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <img
                    src={product.image || `https://placehold.co/80x80/f1f5f9/94a3b8?text=${encodeURIComponent(product.name?.slice(0, 6) || 'Item')}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                    onError={e => { e.target.src = 'https://placehold.co/80x80/f1f5f9/94a3b8?text=Item' }}
                  />
                </div>
              </Link>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {product.brand && (
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>
                    {product.brand}
                  </p>
                )}
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                </Link>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice?.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => moveToCart(product)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 10, border: 'none',
                      background: '#0f172a', color: '#fff',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <ShoppingCart size={13} /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 10,
                      border: '1px solid #fee2e2', background: '#fff',
                      color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  )
}
