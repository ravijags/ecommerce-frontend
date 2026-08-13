import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Check } from 'lucide-react'
import { useState } from 'react'

function ProductCard({
  name, price, image, onAddToCart, onAddToWishlist, onRemoveFromWishlist,
  id, rating, discount, originalPrice, brand,
  isInCart, isWishlisted,
}) {
  const [added, setAdded]           = useState(false)
  const [imgLoaded, setImgLoaded]   = useState(false)

  const imageUrl = (image && image.startsWith('http'))
    ? image
    : `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(name?.slice(0, 14) || 'Product')}`

  const handleAddToCart = (e) => {
    e.preventDefault(); e.stopPropagation()
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (isWishlisted) { if (onRemoveFromWishlist) onRemoveFromWishlist(id) }
    else { if (onAddToWishlist) onAddToWishlist() }
  }

  const inCart = isInCart || added

  return (
    <div
      className="product-card"
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid #ebebeb',
        position: 'relative',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      }}
      onMouseMove={e => {
        if (window.matchMedia('(hover: none)').matches) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
        e.currentTarget.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`
        e.currentTarget.style.boxShadow = `${-x * 2}px ${y * 2}px 32px rgba(0,0,0,0.14)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'
        e.currentTarget.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease'
        e.currentTarget.style.willChange = 'auto'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transition = 'none'
        e.currentTarget.style.willChange = 'transform'
      }}
      onTouchStart={e => { e.currentTarget.style.transform = 'none' }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'none' }}
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div style={{
          position: 'absolute', top: 8, left: 8, zIndex: 10,
          background: '#ef4444', color: '#fff',
          fontSize: 9, fontWeight: 800, padding: '3px 8px',
          borderRadius: 6, letterSpacing: '0.03em', pointerEvents: 'none',
        }}>
          {Math.round(discount)}% OFF
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        className="wishlist-btn"
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 20,
          background: isWishlisted ? '#fff0f0' : 'rgba(255,255,255,0.92)',
          border: isWishlisted ? '1px solid #fecaca' : '1px solid rgba(0,0,0,0.08)',
          borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <Heart size={14} color={isWishlisted ? '#ef4444' : '#94a3b8'} fill={isWishlisted ? '#ef4444' : 'none'} />
      </button>

      {/* Image */}
      <Link to={`/products/${id}`} className="product-img-wrapper" style={{ display: 'block' }}>
        <div style={{ width: '100%', height: '100%', background: '#f9f9f9', overflow: 'hidden' }}>
          <img
            src={imageUrl} alt={name}
            onError={e => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/f1f5f9/94a3b8?text=${encodeURIComponent(name?.slice(0, 14) || 'Product')}` }}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', padding: 8,
              transition: 'transform 0.35s ease, opacity 0.3s ease',
              opacity: imgLoaded ? 1 : 0,
            }}
            onMouseEnter={e => { if (!window.matchMedia('(hover: none)').matches) e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            loading="lazy"
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand */}
        {brand && (
          <p className="product-card-brand" style={{
            color: '#C9A84C', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            {brand}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-card-name" style={{
            color: '#0f172a', fontSize: 13, fontWeight: 600,
            lineHeight: 1.35, marginBottom: 6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '2.4em',
          }}>
            {name}
          </h3>
        </Link>

        {/* Rating badge — bigger on mobile */}
        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 7 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: '#16a34a', color: '#fff',
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              fontWeight: 700, padding: '3px 7px', borderRadius: 5,
            }}>
              {rating.toFixed(1)} <Star size={9} fill="white" stroke="none" />
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
          <span className="product-card-price" style={{ color: '#0f172a', fontSize: 15, fontWeight: 800 }}>
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span style={{ color: '#c4c4c4', fontSize: 11, textDecoration: 'line-through' }}>
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Cart button */}
        <button
          onClick={handleAddToCart}
          className="product-card-btn"
          style={{
            width: '100%',
            padding: '11px 0',
            background: added ? '#C9A84C' : inCart ? '#f0fdf4' : '#0f172a',
            color: added ? '#0f172a' : inCart ? '#16a34a' : '#fff',
            border: inCart && !added ? '1.5px solid #bbf7d0' : 'none',
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.2s, color 0.2s', cursor: 'pointer',
            minHeight: 40,
          }}
        >
          {added
            ? <><Check size={13} /> Added!</>
            : inCart
              ? <><Check size={13} /> In Cart</>
              : <><ShoppingCart size={13} /> Add to Cart</>
          }
        </button>
      </div>

      <style>{`
        @media (hover: hover) {
          .wishlist-btn { opacity: 0; transition: opacity 0.2s; }
          div:hover .wishlist-btn { opacity: 1; }
        }
        @media (hover: none) {
          .wishlist-btn { opacity: 1 !important; }
        }
      `}</style>
    </div>
  )
}

export default ProductCard
