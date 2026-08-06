import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState } from 'react'

function ProductCard({ name, price, image, onAddToCart, onAddToWishlist, id, rating, discount, originalPrice, brand }) {
  const [wishlisted, setWishlisted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('premia_wishlist') || '[]')
      return saved.some(p => p._id === id)
    } catch { return false }
  })
  const [added, setAdded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const imageUrl = (image && image.startsWith('http'))
    ? image
    : `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(name?.slice(0, 14) || 'Product')}`

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  // Wishlist button is OUTSIDE the Link — no navigation conflict
  const handleWishlist = () => {
    if (!wishlisted) {
      setWishlisted(true)
      if (onAddToWishlist) onAddToWishlist()
    } else {
      setWishlisted(false)
    }
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', height: '100%',
      border: '1px solid #f1f5f9', position: 'relative',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Discount badge */}
          {discount > 0 && (
            <div style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 6, letterSpacing: '0.03em', pointerEvents: 'none' }}>
              {Math.round(discount)}% OFF
            </div>
          )}

      {/* Wishlist button — OUTSIDE Link, top-right, high z-index */}
      <button
        onClick={handleWishlist}
        className="wishlist-btn"
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 20,
          background: '#fff', border: 'none', borderRadius: '50%',
          width: 30, height: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
          cursor: 'pointer', transition: 'opacity 0.2s',
        }}
      >
        <Heart
          size={13}
          color={wishlisted ? '#ef4444' : '#94a3b8'}
          fill={wishlisted ? '#ef4444' : 'none'}
        />
      </button>

      {/* Image — Link only wraps the image */}
      <Link to={`/products/${id}`} className="product-img-wrapper" style={{ display: 'block' }}>
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={name}
            onError={e => {
              e.target.onerror = null
              e.target.src = `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(name?.slice(0, 14) || 'Product')}`
            }}
            onLoad={() => setImgLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8, transition: 'transform 0.35s ease, opacity 0.3s ease', opacity: imgLoaded ? 1 : 0 }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            loading="lazy"
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {brand && (
          <p style={{ color: '#C9A84C', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
            {brand}
          </p>
        )}

        <Link to={`/products/${id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            color: '#0f172a', fontSize: 13, fontWeight: 600,
            lineHeight: 1.35, marginBottom: 6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '2.4em',
          }}>
            {name}
          </h3>
        </Link>

        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#16a34a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
              {rating.toFixed(1)} <Star size={7} fill="white" stroke="none" />
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
          <span style={{ color: '#0f172a', fontSize: 15, fontWeight: 800 }}>
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span style={{ color: '#cbd5e1', fontSize: 11, textDecoration: 'line-through' }}>
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            width: '100%', padding: '9px 0',
            background: added ? '#C9A84C' : '#0f172a',
            color: added ? '#0f172a' : '#fff',
            border: 'none', borderRadius: 10,
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.2s, color 0.2s, transform 0.1s', cursor: 'pointer',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ShoppingCart size={12} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>

      <style>{`
        .wishlist-btn { opacity: 1 !important; }
        @media (hover: hover) {
          .wishlist-btn { opacity: 0 !important; }
        }
        .wishlist-btn:hover,
        div:hover .wishlist-btn { opacity: 1 !important; }
      `}</style>
    </div>
  )
}

export default ProductCard
