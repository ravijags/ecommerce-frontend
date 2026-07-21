import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  const [cartItems, setCartItems] = useState([])

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
          // Convert MongoDB cart to our format
          const items = data.cart.items
            .filter(item => item.product)
            .map(item => ({
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              description: item.product.description,
              quantity: item.quantity,
            }))
          setCartItems(items)
        }
      })
  }, [])

  const addToCart = async (product) => {
    const token = localStorage.getItem('token')

    if (token) {
      // Save to MongoDB
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 }),
        })

        if (response.ok) {
          setCartItems(prev => {
            const exists = prev.find(item => item._id === product._id)
            if (exists) {
              return prev.map(item =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
            return [...prev, { ...product, quantity: 1 }]
          })
          toast.success(`${product.name} added to cart!`)
        }
      } catch (error) {
        toast.error('Failed to add to cart!')
      }
    } else {
      // Not logged in - use React state only
      setCartItems(prev => [...prev, { ...product, quantity: 1 }])
      toast.success(`${product.name} added to cart!`)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <Header cartCount={cartItems.length} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
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
    </div>
  )
}

export default App