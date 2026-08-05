import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ProductCard from '../ProductCard'

export default function Wishlist({ wishlistItems, setWishlistItems, addToCart }) {
  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(p => p._id !== id))
    toast.success('Removed from wishlist')
  }

  const moveToCart = (product) => {
    addToCart(product)
    removeFromWishlist(product._id)
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
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 12,
            background: '#0f172a', color: '#fff',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> Browse Products
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Wishlist</h1>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#fef2f2', color: '#ef4444' }}>
          {wishlistItems.length} items
        </span>
      </div>

      <div className="product-grid">
        <AnimatePresence>
          {wishlistItems.map(product => (
            <motion.div key={product._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'relative' }}>
              {/* Remove button */}
              <button onClick={() => removeFromWishlist(product._id)} style={{
                position: 'absolute', top: 8, right: 8, zIndex: 10,
                width: 28, height: 28, borderRadius: '50%',
                background: '#fff', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}>
                <Heart size={13} fill="#ef4444" color="#ef4444" />
              </button>
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image || product.thumbnail}
                rating={product.rating}
                discount={product.discount}
                originalPrice={product.originalPrice}
                brand={product.brand}
                onAddToCart={() => moveToCart(product)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  )
}
