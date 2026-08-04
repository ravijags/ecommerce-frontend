import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import ProductDetail from './pages/ProductDetail'
import Footer from './components/Footer'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load cart from MongoDB on app start
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
      headers: { authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.cart && data.cart.items) {
          const items = data.cart.items
            .filter(item => item.product)
            .map(item => ({
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              originalPrice: item.product.originalPrice,
              discount: item.product.discount,
              brand: item.product.brand,
              image: item.product.image || item.product.thumbnail,
              description: item.product.description,
              quantity: item.quantity,
            }))
          setCartItems(items)
        }
      })
      .catch(() => {})
  }, [])

  const addToCart = async (product) => {
    const token = localStorage.getItem('token')

    // Always update UI immediately
    setCartItems(prev => {
      const exists = prev.find(item => item._id === product._id)
      const cartProduct = {
        ...product,
        image: product.image || product.thumbnail || product.images?.[0],
        quantity: 1
      }
      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, cartProduct]
    })
    toast.success(`${product.name} added to cart!`)

    // Sync to backend in background if logged in
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: token },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        })
      } catch (error) {
        console.log('Cart sync failed:', error)
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      {!isAdmin && !isAuthPage && <Header cartCount={cartItems.length} onSearch={setSearchQuery} />}
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} searchQuery={searchQuery} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && !isAuthPage && <Footer />}
    </div>
  )
}

export default App