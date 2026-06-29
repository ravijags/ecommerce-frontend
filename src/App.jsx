import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'

function App() {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header cartCount={cartItems.length} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  )
}

export default App