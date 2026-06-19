import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home cartCount={cartCount} setCartCount={setCartCount} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App