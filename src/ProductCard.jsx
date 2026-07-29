import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'

function ProductCard({ name, price, description, image, onAddToCart, id, rating, discount, originalPrice, brand }) {
  const imageUrl = (image && image.startsWith('http'))
    ? image
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden group"
      style={{ border: '1px solid #f1f5f9' }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Image */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden">
        <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
          <motion.img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            loading="lazy"
          />
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div
            className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: '#ef4444' }}
          >
            {Math.round(discount)}% OFF
          </div>
        )}

        {/* Wishlist */}
        <motion.button
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => e.preventDefault()}
        >
          <Heart size={15} style={{ color: '#94a3b8' }} />
        </motion.button>
      </Link>

      {/* Info */}
      <div className="p-4">

        {/* Brand */}
        {brand && (
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#C9A84C' }}>
            {brand}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`}>
          <h3
            className="text-sm font-semibold leading-snug mb-2 hover:opacity-70 transition-opacity"
            style={{
              color: '#0f172a',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="flex items-center gap-1 text-white text-xs px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: '#16a34a', fontSize: 10 }}
            >
              <span className="font-bold">{rating.toFixed(1)}</span>
              <Star size={9} fill="white" stroke="none" />
            </div>
            <span className="text-xs" style={{ color: '#94a3b8' }}>(2.3k)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-black" style={{ color: '#0f172a' }}>
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span className="text-xs line-through" style={{ color: '#cbd5e1' }}>
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <motion.button
  onClick={onAddToCart}
  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer"
  style={{ backgroundColor: '#0f172a', color: '#fff' }}
  whileHover={{
    backgroundColor: '#C9A84C',
    color: '#0f172a',
  }}
  whileTap={{ scale: 0.97 }}
>
  <ShoppingCart size={14} />
  Add to Cart
</motion.button>

      </div>
    </motion.div>
  )
}

export default ProductCard