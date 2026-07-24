import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

function ProductDetail({ addToCart }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Product not found!')
        navigate('/')
      })
  }, [id])

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return null

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || 'https://dummyjson.com/image/400x300']

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
          <ArrowLeft size={16} />
          Back
        </Link>
        <span>/</span>
        <span className="text-gray-400">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left - Images */}
        <div className="flex gap-4">

          {/* Thumbnail strip */}
          <div className="flex flex-col gap-2">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === i
                    ? 'border-gray-900'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-square">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain p-8"
            />
          </div>

        </div>

        {/* Right - Product info */}
        <div className="flex flex-col">

          {/* Brand */}
          {product.brand && (
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-lg">
                <span className="font-bold text-sm">{product.rating.toFixed(1)}</span>
                <Star size={12} fill="white" />
              </div>
              <span className="text-gray-500 text-sm">
                {product.reviewCount?.toLocaleString() || '2,345'} ratings
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 text-sm font-medium">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="border-t border-b border-gray-100 py-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.originalPrice?.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-green-600 text-sm mt-1">Inclusive of all taxes</p>
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Highlights</h3>
              <ul className="space-y-1">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer font-bold text-lg"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold min-w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) addToCart(product)
                toast.success(`${product.name} added to cart!`)
              }}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 text-lg"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="px-4 py-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer group">
              <Heart size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <Truck size={20} />, title: 'Free Delivery', desc: 'On orders above ₹999' },
              { icon: <RotateCcw size={20} />, title: '7 Day Return', desc: 'Easy return policy' },
              { icon: <Shield size={20} />, title: '100% Secure', desc: 'Safe payments' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-gray-600 mb-1">{badge.icon}</div>
                <p className="text-xs font-bold text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Description */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

    </main>
  )
}

export default ProductDetail