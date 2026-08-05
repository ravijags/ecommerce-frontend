import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState } from 'react'

function ProductCard({ name, price, image, onAddToCart, onAddToWishlist, id, rating, discount, originalPrice, brand }) {
  const [wishlist, setWishlist] = useState(false)
  const [added, setAdded] = useState(false)

  // Try every possible image field
  const rawImage = image
  const imageUrl = (rawImage && rawImage.startsWith('http'))
    ? rawImage
    : `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(name?.slice(0, 14) || 'Product')}`

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!wishlist) {
      setWishlist(true)
      if (onAddToWishlist) onAddToWishlist()
    } else {
      setWishlist(false)
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #f1f5f9',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.09)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <Link to={`/products/${id}`} className="product-img-wrapper" style={{ display: 'block' }}>
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
          <img
            src={imageUrl}
            alt={name}
            onError={e => {
              e.target.onerror = null
              e.target.src = `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(name?.slice(0, 14) || 'Product')}`
            }}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain', padding: 8,
              transition: 'transform 0.35s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            loading="lazy"
          />

          {/* Discount badge */}
          {discount > 0 && (
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: '#ef4444', color: '#fff',
              fontSize: 9, fontWeight: 800,
              padding: '2px 6px', borderRadius: 6,
              letterSpacing: '0.03em',
            }}>
              {Math.round(discount)}% OFF
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="wishlist-btn"
            style={{
              position: 'absolute', top: 8, right: 8,
              background: '#fff', border: 'none',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            <Heart size={12} color={wishlist ? '#ef4444' : '#94a3b8'} fill={wishlist ? '#ef4444' : 'none'} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Brand */}
        {brand && (
          <p style={{ color: '#C9A84C', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
            {brand}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`}>
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

        {/* Rating */}
        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: '#16a34a', color: '#fff',
              fontSize: 9, fontWeight: 700,
              padding: '2px 6px', borderRadius: 4,
            }}>
              {rating.toFixed(1)} <Star size={7} fill="white" stroke="none" />
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Price */}
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

        {/* Add to Cart */}
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
            transition: 'background 0.2s, color 0.2s',
            cursor: 'pointer',
          }}
        >
          <ShoppingCart size={12} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>

      <style>{`
        .wishlist-btn { opacity: 0; }
        .wishlist-btn:focus { opacity: 1; }
        @media (hover: hover) {
          div:hover .wishlist-btn { opacity: 1; }
        }
        @media (hover: none) {
          .wishlist-btn { display: none; }
        }
      `}</style>
    </div>
  )
}

export default ProductCard
