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

const API = import.meta.env.VITE_API_URL
const WISHLIST_KEY = 'premia_wishlist'

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

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  const [cartItems, setCartItems] = useState([])
  const [rawSearch, setRawSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // ── WISHLIST ── localStorage is single source of truth for persistence
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Every time wishlistItems changes, save to localStorage
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(rawSearch), 300)
    return () => clearTimeout(timer)
  }, [rawSearch])

  // Load cart from backend
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/cart`, { headers: { authorization: token } })
      .then(r => r.json())
      .then(data => {
        if (data.cart?.items?.length) {
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

  // Load wishlist from backend — ONLY merge, never wipe localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/wishlist`, { headers: { authorization: token } })
      .then(r => { if (!r.ok) throw new Error('no wishlist route') ; return r.json() })
      .then(data => {
        if (!data.wishlist?.items?.length) return // backend empty — keep localStorage
        const serverItems = data.wishlist.items.filter(i => i.product).map(i => ({
          _id: i.product._id,
          name: i.product.name,
          price: i.product.price,
          originalPrice: i.product.originalPrice,
          discount: i.product.discount,
          brand: i.product.brand,
          image: i.product.image || i.product.thumbnail,
          rating: i.product.rating,
          category: i.product.category,
        }))
        // Merge: server items + any local-only items not yet synced
        setWishlistItems(prev => {
          const serverIds = new Set(serverItems.map(i => i._id))
          const localOnly = prev.filter(i => !serverIds.has(i._id))
          return [...serverItems, ...localOnly]
        })
      })
      .catch(() => {}) // backend down — localStorage already showing
  }, [])

  // ── ADD TO CART ──
  const addToCart = useCallback(async (product) => {
    const token = localStorage.getItem('token')
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      const item = { ...product, image: product.image || product.thumbnail || product.images?.[0], quantity: 1 }
      if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, item]
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

  // ── ADD TO WISHLIST ──
  const addToWishlist = (product) => {
    const token = localStorage.getItem('token')
    const item = {
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      brand: product.brand,
      image: product.image || product.thumbnail || product.images?.[0],
      rating: product.rating,
      category: product.category,
    }

    setWishlistItems(prev => {
      if (prev.some(p => p._id === item._id)) {
        toast('Already in wishlist ❤️', { duration: 1500 })
        return prev
      }
      toast.success('Added to wishlist!')
      const updated = [...prev, item]
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated)) } catch (err) { console.error('LS write failed:', err) }
      return updated
    })

    if (token) {
      fetch(`${API}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ productId: product._id }),
      }).catch(() => {})
    }
  }

  // ── REMOVE FROM WISHLIST ──
  const removeFromWishlist = (productId) => {
    const token = localStorage.getItem('token')
    setWishlistItems(prev => {
      const updated = prev.filter(p => p._id !== productId)
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
    toast.success('Removed from wishlist')
    if (token) {
      fetch(`${API}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { authorization: token },
      }).catch(() => {})
    }
  }

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
