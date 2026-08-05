import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/Footer'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const API = import.meta.env.VITE_API_URL

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [rawSearch, setRawSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(rawSearch), 300)
    return () => clearTimeout(timer)
  }, [rawSearch])

  // Load cart from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/cart`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(data => {
        if (data.cart?.items) {
          setCartItems(data.cart.items.filter(i => i.product).map(i => ({
            _id: i.product._id,
            name: i.product.name,
            price: i.product.price,
            originalPrice: i.product.originalPrice,
            discount: i.product.discount,
            brand: i.product.brand,
            image: i.product.image || i.product.thumbnail,
            description: i.product.description,
            quantity: i.quantity,
          })))
        }
      })
      .catch(() => {})
  }, [])

  // Load wishlist from backend on mount — synced across devices
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/wishlist`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(data => {
        if (data.wishlist?.items) {
          setWishlistItems(data.wishlist.items.filter(i => i.product).map(i => ({
            _id: i.product._id,
            name: i.product.name,
            price: i.product.price,
            originalPrice: i.product.originalPrice,
            discount: i.product.discount,
            brand: i.product.brand,
            image: i.product.image || i.product.thumbnail,
            rating: i.product.rating,
            category: i.product.category,
          })))
        }
      })
      .catch(() => {})
  }, [])

  // Add to cart — instant UI + background sync
  const addToCart = useCallback(async (product) => {
    const token = localStorage.getItem('token')
    setCartItems(prev => {
      const exists = prev.find(item => item._id === product._id)
      const cartProduct = { ...product, image: product.image || product.thumbnail || product.images?.[0], quantity: 1 }
      if (exists) return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, cartProduct]
    })
    toast.success(`${product.name} added to cart!`)
    if (token) {
      try {
        await fetch(`${API}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: token },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        })
      } catch {}
    }
  }, [])

  // Add to wishlist — instant UI + backend sync
  const addToWishlist = useCallback(async (product) => {
    const token = localStorage.getItem('token')

    // Check already in wishlist
    setWishlistItems(prev => {
      if (prev.find(p => p._id === product._id)) {
        toast('Already in wishlist', { icon: '❤️' })
        return prev
      }
      toast.success('Added to wishlist!')
      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        brand: product.brand,
        image: product.image || product.thumbnail || product.images?.[0],
        rating: product.rating,
        category: product.category,
      }]
    })

    // Sync to backend
    if (token) {
      try {
        await fetch(`${API}/api/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: token },
          body: JSON.stringify({ productId: product._id }),
        })
      } catch {}
    }
  }, [])

  // Remove from wishlist — instant UI + backend sync
  const removeFromWishlist = useCallback(async (productId) => {
    const token = localStorage.getItem('token')
    setWishlistItems(prev => prev.filter(p => p._id !== productId))
    if (token) {
      try {
        await fetch(`${API}/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { authorization: token },
        })
      } catch {}
    }
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: 13 } }} />
      {!isAdmin && !isAuthPage && (
        <Header cartCount={cartItems.length} wishlistCount={wishlistItems.length} onSearch={setRawSearch} />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home addToCart={addToCart} addToWishlist={addToWishlist} searchQuery={searchQuery} /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><Cart cartItems={cartItems} setCartItems={setCartItems} /></PageWrapper>} />
          <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
          <Route path="/wishlist" element={<PageWrapper><Wishlist wishlistItems={wishlistItems} removeFromWishlist={removeFromWishlist} addToCart={addToCart} /></PageWrapper>} />
          <Route path="/account" element={<PageWrapper><Account /></PageWrapper>} />
          <Route path="/products/:id" element={<PageWrapper><ProductDetail addToCart={addToCart} addToWishlist={addToWishlist} /></PageWrapper>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && !isAuthPage && <Footer />}
    </div>
  )
}

export default App
