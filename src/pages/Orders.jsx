import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      headers: {
        'authorization': token,
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.order)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-gray-500">Loading orders...</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <p className="text-gray-500">No orders yet!</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">

              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID:</p>
                  <p className="text-xs text-gray-400">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700 text-sm">
                      {item.product ? item.product.name : 'Product'} x{item.quantity}
                    </span>
                    <span className="text-gray-700 text-sm">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="font-bold text-gray-800">${order.totalAmount}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Orders