import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate()

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index)
    setCartItems(newCart)
    toast.success('Item removed from cart!')
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0)

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: item._id,
            quantity: 1,
            price: item.price,
          })),
          totalAmount: totalPrice,
          shippingAddress: 'Default Address, Delhi',
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        toast.error('Failed to create order!')
        return
      }

      const paymentResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token,
        },
        body: JSON.stringify({ orderId: orderData.order._id }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        toast.error('Failed to create payment!')
        return
      }

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Ecommerce Store',
        description: 'Order Payment',
        order_id: paymentData.razorpayOrderId,
        handler: async (response) => {
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': token,
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.order._id,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            toast.success('Payment successful! 🎉')
            setCartItems([])
            navigate('/')
          } else {
            toast.error('Payment verification failed!')
          }
        },
        prefill: {
          email: 'test@example.com',
        },
        theme: {
          color: '#3b82f6',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      console.error(err)
      toast.error('Something went wrong!')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-4">Your cart is empty!</p>
          <Link to="/" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-4 shadow-sm">
              <img
                src={(item.image && item.image.startsWith("http")) ? item.image : "https://picsum.photos/80/80"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-green-500 font-bold">${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-green-500">${totalPrice}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Cart