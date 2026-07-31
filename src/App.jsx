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
import ProductDetail from './pages/ProductDetail'
import Footer from './components/Footer'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${import.meta.env.VITE_API_URL}/api/cart`, { headers: { authorization: token } })
      .then(res => res.json())
      .then(data => {
        if (data.cart?.items) {
          setCartItems(data.cart.items.filter(i => i.product).map(i => ({
            _id: i.product._id, name: i.product.name, price: i.product.price,
            image: i.product.image, description: i.product.description, quantity: i.quantity,
          })))
        }
      })
  }, [])

  const addToCart = async (product) => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: token },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        })
        if (res.ok) {
          setCartItems(prev => {
            const exists = prev.find(i => i._id === product._id)
            if (exists) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
            return [...prev, { ...product, quantity: 1 }]
          })
          toast.success(`${product.name} added to cart!`)
        }
      } catch { toast.error('Failed to add to cart!') }
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }])
      toast.success(`${product.name} added to cart!`)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: 13 } }} />
      {!isAdmin && <Header cartCount={cartItems.length} onSearch={setSearchQuery} />}
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default App
