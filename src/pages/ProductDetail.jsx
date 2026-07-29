import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, ChevronLeft, Shield, Truck, RotateCcw, Plus, Minus, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function ProductDetail({ addToCart }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product)
    setAddedToCart(true)
    toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!product) return null

  const images = product.images?.length > 0 ? product.images : [product.image || 'https://dummyjson.com/image/400x300']
  const hasDiscount = product.originalPrice > product.price
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-sm">
        <Link to="/" className="flex items-center gap-1 font-medium transition-colors" style={{ color: '#64748b' }}>
          <ChevronLeft size={15} />
          Back
        </Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span className="capitalize" style={{ color: '#64748b' }}>{product.category}</span>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span className="font-medium truncate max-w-48" style={{ color: '#0f172a' }}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Images */}
        <div className="flex gap-3">

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2">
              {images.slice(0, 5).map((img, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(i)}
                  className="w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0"
                  style={{
                    borderColor: selectedImage === i ? '#C9A84C' : '#e2e8f0',
                    background: '#f8fafc',
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Main image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 rounded-2xl overflow-hidden flex items-center justify-center aspect-square"
              style={{ background: '#f8fafc' }}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="flex flex-col">

          {/* Brand + share */}
          <div className="flex items-start justify-between mb-2">
            {product.brand && (
              <span className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded-lg" style={{ background: '#f1f5f9', color: '#64748b' }}>
                {product.brand}
              </span>
            )}
            <button className="ml-auto p-2 rounded-xl transition-all" style={{ color: '#94a3b8' }}>
              <Share2 size={16} />
            </button>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black leading-tight mb-3" style={{ color: '#0f172a' }}>
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#0f172a' }}>
                <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>{product.rating.toFixed(1)}</span>
                <Star size={10} fill="#C9A84C" color="#C9A84C" />
              </div>
              <span className="text-sm" style={{ color: '#64748b' }}>
                {(product.reviewCount || 2345).toLocaleString()} reviews
              </span>
              <span style={{ color: '#e2e8f0' }}>|</span>
              <span className="text-sm font-medium" style={{ color: product.stock > 0 ? '#22c55e' : '#ef4444' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-black" style={{ color: '#0f172a' }}>
                ₹{product.price?.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg line-through" style={{ color: '#94a3b8' }}>
                    ₹{product.originalPrice?.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold px-2 py-0.5 rounded-lg" style={{ background: '#C9A84C22', color: '#92740a' }}>
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs font-medium" style={{ color: '#22c55e' }}>Inclusive of all taxes · Free delivery above ₹999</p>
          </div>

          {/* Highlights */}
          {product.highlights?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold mb-2" style={{ color: '#0f172a' }}>Highlights</p>
              <ul className="space-y-1.5">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#475569' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#C9A84C' }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>Qty</span>
            <div className="flex items-center gap-0 rounded-xl overflow-hidden border-2" style={{ borderColor: '#e2e8f0' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 transition-colors"
                style={{ color: '#0f172a' }}
              >
                <Minus size={14} />
              </button>
              <span className="px-4 py-2 font-bold text-sm min-w-8 text-center" style={{ color: '#0f172a' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="px-3 py-2 transition-colors"
                style={{ color: '#0f172a' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: addedToCart ? '#22c55e' : '#0f172a',
                color: '#fff',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1,
              }}
            >
              <ShoppingCart size={17} />
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setWishlisted(!wishlisted)}
              className="px-4 rounded-xl border-2 transition-all"
              style={{
                borderColor: wishlisted ? '#ef4444' : '#e2e8f0',
                background: wishlisted ? '#fef2f2' : '#fff',
                color: wishlisted ? '#ef4444' : '#94a3b8',
              }}
            >
              <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} />
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Truck, title: 'Free Delivery', desc: 'Above ₹999' },
              { Icon: RotateCcw, title: '7-Day Return', desc: 'Easy returns' },
              { Icon: Shield, title: 'Secure Pay', desc: '100% safe' },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-3 rounded-xl"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <Icon size={18} style={{ color: '#C9A84C' }} className="mb-1" />
                <p className="text-xs font-bold" style={{ color: '#0f172a' }}>{title}</p>
                <p className="text-xs" style={{ color: '#94a3b8' }}>{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #e2e8f0' }}>
          <h2 className="text-lg font-black mb-3" style={{ color: '#0f172a' }}>Product Description</h2>
          <p className="leading-relaxed" style={{ color: '#475569' }}>{product.description}</p>
        </div>
      )}

    </main>
  )
}

export default ProductDetail
