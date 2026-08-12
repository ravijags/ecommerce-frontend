import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ProgressBar from './components/ProgressBar'
import ScrollToTop from './components/ScrollToTop'
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

  useEffect(() => {
    const TITLES = {
      '/': 'PREMIA — Everything Premium. Delivered.',
      '/login': 'Sign In — PREMIA',
      '/register': 'Create Account — PREMIA',
      '/forgot-password': 'Forgot Password — PREMIA',
      '/cart': 'My Cart — PREMIA',
      '/orders': 'My Orders — PREMIA',
      '/wishlist': 'My Wishlist — PREMIA',
      '/account': 'My Account — PREMIA',
      '/search': 'Search — PREMIA',
      '/admin/orders': 'Orders — PREMIA Admin',
      '/admin/products': 'Products — PREMIA Admin',
      '/admin/users': 'Users — PREMIA Admin',
    }
    document.title = TITLES[location.pathname] || 'PREMIA — Everything Premium. Delivered.'
  }, [location.pathname])

  const isAdmin    = location.pathname.startsWith('/admin')
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password')

  const [cartItems, setCartItems]         = useState([])
  const [wishlistItems, setWishlistItems] = useState(getWishlist)
  const [rawSearch, setRawSearch]         = useState('')
  const [searchQuery, setSearchQuery]     = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(rawSearch), 300)
    return () => clearTimeout(timer)
  }, [rawSearch])

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

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/wishlist`, { headers: { authorization: token } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.wishlist) return
        const serverItems = (data.wishlist.items || []).filter(i => i.product).map(i => ({
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
        setWishlistItems(serverItems)
        import('./wishlistStore').then(m => m.saveWishlist(serverItems))
      })
      .catch(() => {})
  }, [])

  const addToCart = useCallback(async (product) => {
    const token = localStorage.getItem('token')
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      const item = { ...product, image: product.image || product.thumbnail || product.images?.[0], quantity: 1 }
      if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, item]
    })
    if (!product._suppressToast) toast.success(`${product.name} added to cart!`)
    if (token) {
      fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      }).catch(() => {})
    }
  }, [])

  const addToWishlist = useCallback((product) => {
    const { added, items } = addToWishlistStore(product)
    if (!added) { toast('Already in wishlist ❤️', { duration: 1500 }); return }
    setWishlistItems(items)
    toast.success('Added to wishlist!')
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ productId: product._id }),
      }).catch(() => {})
    }
  }, [])

  const removeFromWishlist = useCallback((productId, silent = false) => {
    const updated = removeFromWishlistStore(productId)
    setWishlistItems(updated)
    if (!silent) toast.success('Removed from wishlist')
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { authorization: token },
      }).catch(() => {})
    }
  }, [])

  // Sets for O(1) lookup — passed to pages so ProductCard knows state
  const cartItemIds    = new Set(cartItems.map(i => i._id))
  const wishlistIds    = new Set(wishlistItems.map(i => i._id))

  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollToTop />
      <ProgressBar />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
            background: '#0f172a', color: '#fff', borderRadius: 12,
            padding: '12px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.24)', maxWidth: 320,
          },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#0f172a' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
        }}
      />
      {!isAdmin && !isAuthPage && (
        <Header
          cartCount={cartItems.reduce((t, i) => t + (i.quantity || 1), 0)}
          wishlistCount={wishlistItems.length}
          onSearch={setRawSearch}
        />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper>
              <Home
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                cartItemIds={cartItemIds}
                wishlistIds={wishlistIds}
                wishlistIds={wishlistIds}
                searchQuery={searchQuery}
              />
            </PageWrapper>
          } />
          <Route path="/login"                 element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register"              element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/forgot-password"       element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />
          <Route path="/cart"                  element={<PageWrapper><Cart cartItems={cartItems} setCartItems={setCartItems} /></PageWrapper>} />
          <Route path="/orders"                element={<PageWrapper><Orders /></PageWrapper>} />
          <Route path="/search"                element={
            <PageWrapper>
              <Search
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                cartItemIds={cartItemIds}
                wishlistIds={wishlistIds}
              />
            </PageWrapper>
          } />
          <Route path="/wishlist"              element={<PageWrapper><Wishlist wishlistItems={wishlistItems} removeFromWishlist={removeFromWishlist} addToCart={addToCart} /></PageWrapper>} />
          <Route path="/account"              element={<PageWrapper><Account /></PageWrapper>} />
          <Route path="/products/:id"          element={<PageWrapper><ProductDetail addToCart={addToCart} addToWishlist={addToWishlist} removeFromWishlist={removeFromWishlist} cartItemIds={cartItemIds} wishlistIds={wishlistIds} /></PageWrapper>} />
          <Route path="/admin"                 element={<AdminDashboard />} />
          <Route path="/admin/orders"          element={<AdminOrders />} />
          <Route path="/admin/products"        element={<AdminProducts />} />
          <Route path="/admin/users"           element={<AdminUsers />} />
          <Route path="*"                      element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && !isAuthPage && <Footer />}
      <BackToTop />
    </div>
  )
}

export default App
