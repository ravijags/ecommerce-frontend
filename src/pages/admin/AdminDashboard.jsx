import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Fetch orders and users for stats
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
        headers: { authorization: token }
      }).then(res => res.json()),

      fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { authorization: token }
      }).then(res => res.json()),
    ]).then(([ordersData, usersData]) => {
      const totalRevenue = ordersData.orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0)

      setStats({
        totalOrders: ordersData.orders.length,
        totalUsers: usersData.users.length,
        totalRevenue,
      })
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="flex gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 text-center">
          <p className="text-gray-500 text-sm mb-2">Total Orders</p>
          <p className="text-4xl font-bold text-blue-500">{stats.totalOrders}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 text-center">
          <p className="text-gray-500 text-sm mb-2">Total Users</p>
          <p className="text-4xl font-bold text-green-500">{stats.totalUsers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 text-center">
          <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-purple-500">${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-6">
        <Link
          to="/admin/orders"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          Manage Orders
        </Link>
        <Link
          to="/admin/products"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-200"
        >
          Manage Products
        </Link>
      </div>
    </main>
  )
}

export default AdminDashboard