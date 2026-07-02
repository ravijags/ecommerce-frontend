import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import NotFound from './pages/NotFound'

function App() {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster position="top-right"/>
      <Header cartCount={cartItems.length} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App