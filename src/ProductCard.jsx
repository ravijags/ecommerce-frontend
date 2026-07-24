import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'

function ProductCard({ name, price, description, image, onAddToCart, id, rating, discount, originalPrice, brand }) {
  const imageUrl = (image && image.startsWith('http'))
    ? image
    : 'https://dummyjson.com/image/400x300'

  return (
    <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">

      {/* Image container */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {Math.round(discount)}% OFF
          </div>
        )}

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer">
          <Heart size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </Link>

      {/* Product info */}
      <div className="p-4">

        {/* Brand */}
        {brand && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{brand}</p>
        )}

        {/* Name */}
        <Link to={`/products/${id}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors leading-snug mb-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center bg-green-500 text-white text-xs px-1.5 py-0.5 rounded gap-0.5">
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <Star size={10} fill="white" />
            </div>
            <span className="text-xs text-gray-400">(2.3k)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
          {originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>

      </div>
    </div>
  )
}

export default ProductCard