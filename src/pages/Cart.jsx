import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowLeft, Tag, ChevronRight, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
      } catch {
        toast.error('Failed to remove item!')
        return
      }
    }
    setCartItems(cartItems.filter((_, i) => i !== index))
    toast.success('Item removed')
  }

  const totalPrice = cartItems.reduce((t, i) => t + i.price, 0)
  const totalOriginal = cartItems.reduce((t, i) => t + (i.originalPrice || i.price), 0)
  const totalDiscount = totalOriginal - totalPrice
  const deliveryCharge = totalPrice > 999 ? 0 : 99

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please sign in to checkout')
      navigate('/login')
      return
    }
    try {
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({
          items: cartItems.map(item => ({ product: item._id, quantity: 1, price: item.price })),
          totalAmount: totalPrice + deliveryCharge,
          shippingAddress: 'Default Address, Delhi',
        }),
      })
      const orderData = await orderResponse.json()
      if (!orderResponse.ok) { toast.error('Failed to create order!'); return }

      const paymentResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ orderId: orderData.order._id }),
      })
      const paymentData = await paymentResponse.json()
      if (!paymentResponse.ok) { toast.error('Failed to create payment!'); return }

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'PREMIA',
        description: 'Order Payment',
        order_id: paymentData.razorpayOrderId,
        handler: async (response) => {
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authorization: token },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.order._id,
            }),
          })
          const verifyData = await verifyResponse.json()
          if (verifyData.success) {
            if (token) await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, { method: 'DELETE', headers: { authorization: token } })
            toast.success('Order placed! 🎉')
            setCartItems([])
            navigate('/orders')
          } else {
            toast.error('Payment verification failed!')
          }
        },
        prefill: { email: 'test@example.com' },
        theme: { color: '#0f172a' },
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
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-16"
          style={{ background: '#fff', border: '1px solid #e2e8f0' }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#f1f5f9' }}>
            <ShoppingBag size={36} style={{ color: '#cbd5e1' }} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#0f172a' }}>Your cart is empty</h2>
          <p className="mb-8" style={{ color: '#64748b' }}>Looks like you haven't added anything yet.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all"
            style={{ background: '#0f172a', color: '#fff' }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-black" style={{ color: '#0f172a' }}>My Cart</h1>
        <span className="text-sm px-2.5 py-0.5 rounded-full font-semibold" style={{ background: '#f1f5f9', color: '#64748b' }}>
          {cartItems.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item._id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 p-4 rounded-2xl"
                style={{ background: '#fff', border: '1px solid #e2e8f0' }}
              >
                {/* Image */}
                <Link to={`/products/${item._id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden" style={{ background: '#f8fafc' }}>
                    <img
                      src={(item.image?.startsWith('http')) ? item.image : 'https://dummyjson.com/image/100x100'}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`}>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:underline" style={{ color: '#0f172a' }}>
                      {item.name}
                    </h3>
                  </Link>
                  {item.brand && (
                    <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: '#94a3b8' }}>{item.brand}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-black" style={{ color: '#0f172a' }}>₹{item.price?.toLocaleString()}</span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="text-sm line-through" style={{ color: '#94a3b8' }}>₹{item.originalPrice?.toLocaleString()}</span>
                        <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{item.discount}% off</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Package size={12} style={{ color: '#22c55e' }} />
                    <span className="text-xs font-medium" style={{ color: '#22c55e' }}>Free delivery</span>
                  </div>
                </div>

                {/* Remove */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromCart(index)}
                  className="flex-shrink-0 p-2 rounded-xl transition-all self-start"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div>
          <div className="rounded-2xl p-5 sticky top-24" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>

            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>
              Order Summary
            </h2>

            <div className="space-y-3 mb-4 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#64748b' }}>Subtotal ({cartItems.length} items)</span>
                <span className="font-medium" style={{ color: '#0f172a' }}>₹{totalOriginal.toLocaleString()}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#64748b' }}>Discount</span>
                  <span className="font-medium" style={{ color: '#22c55e' }}>− ₹{totalDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span style={{ color: '#64748b' }}>Delivery</span>
                <span className={`font-medium`} style={{ color: deliveryCharge === 0 ? '#22c55e' : '#0f172a' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="font-bold" style={{ color: '#0f172a' }}>Total</span>
              <span className="text-xl font-black" style={{ color: '#0f172a' }}>
                ₹{(totalPrice + deliveryCharge).toLocaleString()}
              </span>
            </div>
            {totalDiscount > 0 && (
              <p className="text-xs font-semibold mb-4" style={{ color: '#22c55e' }}>
                You save ₹{totalDiscount.toLocaleString()} on this order
              </p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-4 transition-all"
              style={{ background: '#0f172a', color: '#fff', cursor: 'pointer' }}
            >
              Proceed to Checkout
              <ChevronRight size={16} />
            </motion.button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs" style={{ color: '#94a3b8' }}>
              <Tag size={11} />
              <span>Safe &amp; Secure Payments</span>
            </div>

            {/* Gold promo hint */}
            {totalPrice < 999 && (
              <div className="mt-4 p-3 rounded-xl text-xs text-center" style={{ background: '#C9A84C15', border: '1px solid #C9A84C40', color: '#92740a' }}>
                Add ₹{(999 - totalPrice).toLocaleString()} more for <strong>free delivery</strong>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  )
}

export default Cart
