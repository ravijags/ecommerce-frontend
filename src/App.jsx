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
import { getWishlist, addToWishlistStore, removeFromWishlistStore } from './wishlistStore'

const API = import.meta.env.VITE_API_URL

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
  const [wishlistItems, setWishlistItems] = useState(getWishlist) // read from localStorage immediately
  const [rawSearch, setRawSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Debounce search 300ms
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

  // Load wishlist from backend and MERGE with localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/wishlist`, { headers: { authorization: token } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.wishlist?.items?.length) return
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
        // Merge server + local, server wins on duplicates
        const localItems = getWishlist()
        const serverIds = new Set(serverItems.map(i => i._id))
        const localOnly = localItems.filter(i => !serverIds.has(i._id))
        const merged = [...serverItems, ...localOnly]
        setWishlistItems(merged)
        // Save merged back to localStorage
        import('./wishlistStore').then(m => m.saveWishlist(merged))
      })
      .catch(() => {})
  }, [])

  // ADD TO CART
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
      fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      }).catch(() => {})
    }
  }, [])

  // ADD TO WISHLIST — uses external store, no React state race conditions
  const addToWishlist = useCallback((product) => {
    const { added, items } = addToWishlistStore(product)
    if (!added) {
      toast('Already in wishlist ❤️', { duration: 1500 })
      return
    }
    setWishlistItems(items)
    toast.success('Added to wishlist!')
    // Background backend sync
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ productId: product._id }),
      }).catch(() => {})
    }
  }, [])

  // REMOVE FROM WISHLIST
  const removeFromWishlist = useCallback((productId) => {
    const updated = removeFromWishlistStore(productId)
    setWishlistItems(updated)
    toast.success('Removed from wishlist')
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { authorization: token },
      }).catch(() => {})
    }
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: 13 } }} />
      {!isAdmin && !isAuthPage && (
        <Header cartCount={cartItems.reduce((t, i) => t + (i.quantity || 1), 0)} wishlistCount={wishlistItems.length} onSearch={setRawSearch} />
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
