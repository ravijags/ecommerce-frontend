import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState } from 'react'

function ProductCard({ name, price, image, onAddToCart, id, rating, discount, originalPrice, brand }) {
  const [wishlist, setWishlist] = useState(false)
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const imageUrl = (image && image.startsWith('http'))
    ? image
    : 'https://dummyjson.com/image/400x300'

  const handleAddToCart = (e) => {
    e.preventDefault()
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Image */}
      <Link
        to={`/products/${id}`}
        style={{ display: 'block', position: 'relative', flexShrink: 0 }}
      >
        <div style={{
          height: 200,
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          position: 'relative'
        }}>
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s',
              transform: hovered ? 'scale(1.06)' : 'scale(1)'
            }}
          />
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
          }}>
            {Math.round(discount)}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWishlist(!wishlist) }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          <Heart
            size={13}
            fill={wishlist ? '#ef4444' : 'none'}
            stroke={wishlist ? '#ef4444' : '#94a3b8'}
          />
        </button>
      </Link>

      {/* Info */}
      <div style={{
        padding: '12px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>

        {/* Brand */}
        {brand && (
          <p style={{
            color: '#C9A84C',
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 5,
          }}>
            {brand}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            color: '#0f172a',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}>
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{
              backgroundColor: '#16a34a',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}>
              {rating.toFixed(1)}
              <Star size={7} fill="#fff" stroke="none" />
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <span style={{ color: '#0f172a', fontSize: 15, fontWeight: 800 }}>
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span style={{ color: '#cbd5e1', fontSize: 11, textDecoration: 'line-through' }}>
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            backgroundColor: added ? '#C9A84C' : '#0f172a',
            color: added ? '#0f172a' : '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 0',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background-color 0.2s, color 0.2s',
            flexShrink: 0,
          }}
        >
          <ShoppingCart size={12} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>

      </div>
    </div>
  )
}

export default ProductCard