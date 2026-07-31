import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

function ProductCard({ name, price, image, onAddToCart, id, rating, discount, originalPrice, brand }) {
  const [wishlist, setWishlist] = useState(false)
  const [added, setAdded] = useState(false)

  const imageUrl = (image && image.startsWith('http'))
    ? image
    : `https://placehold.co/400x400/f8fafc/94a3b8?text=${encodeURIComponent(name?.slice(0,10) || 'Product')}`

  const handleAddToCart = () => {
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col h-full group"
      style={{ border: '1px solid #f1f5f9', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <Link to={`/products/${id}`} className="block relative flex-shrink-0" style={{ height: '200px' }}>
        <div className="w-full h-full overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain p-2"
            style={{ transition: 'transform 0.4s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            loading="lazy"
          />
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div
            className="absolute top-2.5 left-2.5 text-white font-bold rounded-lg px-2 py-0.5"
            style={{ backgroundColor: '#ef4444', fontSize: 10 }}
          >
            {Math.round(discount)}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-2.5 right-2.5 bg-white rounded-full p-1.5 shadow-sm cursor-pointer"
          style={{
            opacity: wishlist ? 1 : 0,
            transition: 'opacity 0.2s',
            border: 'none'
          }}
          onClick={e => {
            e.preventDefault()
            setWishlist(!wishlist)
          }}
          onMouseEnter={e => e.currentTarget.parentElement.parentElement.querySelector('.wishlist-btn') && null}
        >
          <Heart
            size={13}
            style={{ color: wishlist ? '#ef4444' : '#94a3b8' }}
            fill={wishlist ? '#ef4444' : 'none'}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">

        {/* Brand */}
        {brand && (
          <p
            className="font-bold uppercase mb-1"
            style={{ color: '#C9A84C', fontSize: 9, letterSpacing: '0.12em' }}
          >
            {brand}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`} className="flex-shrink-0">
          <h3
            className="font-semibold leading-snug mb-2"
            style={{
              color: '#0f172a',
              fontSize: 13,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.4rem'
            }}
          >
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="flex items-center gap-0.5 text-white px-1.5 py-0.5 rounded"
              style={{ backgroundColor: '#16a34a', fontSize: 9 }}
            >
              <span className="font-bold">{rating.toFixed(1)}</span>
              <Star size={7} fill="white" stroke="none" />
            </div>
          </div>
        )}

        {/* Push to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="font-black" style={{ color: '#0f172a', fontSize: 14 }}>
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span className="line-through" style={{ color: '#cbd5e1', fontSize: 11 }}>
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold uppercase cursor-pointer flex-shrink-0 transition-all duration-200"
          style={{
            backgroundColor: added ? '#C9A84C' : '#0f172a',
            color: added ? '#0f172a' : '#fff',
            fontSize: 11,
            letterSpacing: '0.05em',
            border: 'none'
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