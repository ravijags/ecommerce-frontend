import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate()

  const removeFromCart = async (index) => {
    const token = localStorage.getItem('token')
    const item = cartItems[index]

    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item._id}`, {
          method: 'DELETE',
          headers: { authorization: token }
        })
      } catch (error) {
        toast.error('Failed to remove item!')
        return
      }
    }

    const newCart = cartItems.filter((_, i) => i !== index)
    setCartItems(newCart)
    toast.success('Item removed!')
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0)
  const totalOriginal = cartItems.reduce((total, item) => total + (item.originalPrice || item.price), 0)
  const totalDiscount = totalOriginal - totalPrice
  const deliveryCharge = totalPrice > 999 ? 0 : 99

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Please login to checkout!')
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
          totalAmount: totalPrice + deliveryCharge,
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
        name: 'ShopX',
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
            if (token) {
              await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
                method: 'DELETE',
                headers: { authorization: token }
              })
            }
            toast.success('Order placed successfully! 🎉')
            setCartItems([])
            navigate('/orders')
          } else {
            toast.error('Payment verification failed!')
          }
        },
        prefill: { email: 'test@example.com' },
        theme: { color: '#111111' },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      console.error(err)
      toast.error('Something went wrong!')
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-8">Add items to your cart to continue shopping</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">
        My Cart <span className="text-gray-400 font-normal text-lg">({cartItems.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">

              {/* Image */}
              <Link to={`/products/${item._id}`} className="flex-shrink-0">
                <img
                  src={(item.image && item.image.startsWith('http')) ? item.image : 'https://dummyjson.com/image/100x100'}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded-xl bg-gray-50 p-2"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                {item.brand && (
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{item.brand}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-black text-gray-900">₹{item.price?.toLocaleString()}</span>
                  {item.originalPrice > item.price && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{item.originalPrice?.toLocaleString()}</span>
                      <span className="text-xs font-bold text-green-600">{item.discount}% off</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-green-600 mt-1">Free delivery</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(index)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={18} />
              </button>

            </div>
          ))}
        </div>

        {/* Price summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-4">
              Price Details
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price ({cartItems.length} items)</span>
                <span className="font-medium">₹{totalOriginal.toLocaleString()}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">− ₹{totalDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-black text-xl text-gray-900">
                  ₹{(totalPrice + deliveryCharge).toLocaleString()}
                </span>
              </div>
              {totalDiscount > 0 && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  You save ₹{totalDiscount.toLocaleString()} on this order!
                </p>
              )}
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <Tag size={12} />
              <span>Safe and Secure Payments</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Cart