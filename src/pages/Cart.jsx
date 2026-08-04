import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowLeft, Tag, ChevronRight, Package, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate()

  const removeFromCart = async (index) => {
    const token = localStorage.getItem('token')
    const item = cartItems[index]
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${item._id}`, {
          method: 'DELETE', headers: { authorization: token }
        })
      } catch { toast.error('Failed to remove'); return }
    }
    setCartItems(cartItems.filter((_, i) => i !== index))
    toast.success('Item removed')
  }

  const totalPrice = cartItems.reduce((t, i) => t + i.price, 0)
  const totalOriginal = cartItems.reduce((t, i) => t + (i.originalPrice || i.price), 0)
  const saved = totalOriginal - totalPrice
  const delivery = totalPrice >= 999 ? 0 : 99

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    if (!token) { toast.error('Please sign in to checkout'); navigate('/login'); return }
    try {
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({
          items: cartItems.map(i => ({ product: i._id, quantity: 1, price: i.price })),
          totalAmount: totalPrice + delivery,
          shippingAddress: 'Default Address',
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) { toast.error('Failed to create order'); return }

      const payRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ orderId: orderData.order._id }),
      })
      const payData = await payRes.json()
      if (!payRes.ok) { toast.error('Payment setup failed'); return }

      const rzp = new window.Razorpay({
        key: payData.keyId,
        amount: payData.amount,
        currency: payData.currency,
        name: 'PREMIA',
        order_id: payData.razorpayOrderId,
        handler: async (response) => {
          const vRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authorization: token },
            body: JSON.stringify({ ...response, orderId: orderData.order._id }),
          })
          const vData = await vRes.json()
          if (vData.success) {
            if (token) await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, { method: 'DELETE', headers: { authorization: token } })
            toast.success('Order placed! 🎉')
            setCartItems([])
            navigate('/orders')
          } else toast.error('Payment verification failed')
        },
        theme: { color: '#0f172a' },
      })
      rzp.open()
    } catch { toast.error('Something went wrong') }
  }

  // ── EMPTY STATE ──
  if (cartItems.length === 0) {
    return (
      <main style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: '#f1f5f9', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <ShoppingCart size={40} color="#cbd5e1" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Your cart is empty</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 32px', lineHeight: 1.6 }}>
            Looks like you haven't added anything yet.<br />Start browsing our premium collection.
          </p>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 12,
            background: '#0f172a', color: '#fff',
            fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  // ── CART WITH ITEMS ──
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', width: '100%' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Cart</h1>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#f1f5f9', color: '#64748b' }}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, alignItems: 'start' }}>
        <style>{`
          @media (min-width: 768px) { .cart-grid { grid-template-columns: 1fr 340px !important; } }
        `}</style>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cartItems.map((item, index) => (
            <div key={`${item._id}-${index}`} style={{
              display: 'flex', gap: 16, padding: 20,
              background: '#fff', borderRadius: 16,
              border: '1px solid #e2e8f0',
            }}>
              <Link to={`/products/${item._id}`}>
                <div style={{ width: 88, height: 88, borderRadius: 12, background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image?.startsWith('http') ? item.image : 'https://placehold.co/88x88'} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                </div>
              </Link>

              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                </Link>
                {item.brand && <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.brand}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>₹{item.price?.toLocaleString()}</span>
                  {item.originalPrice > item.price && (
                    <span style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'line-through' }}>₹{item.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                  <Package size={12} color="#22c55e" />
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Free delivery</span>
                </div>
              </div>

              <button onClick={() => removeFromCart(index)} style={{
                alignSelf: 'flex-start', padding: 8, borderRadius: 8,
                border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #e2e8f0', padding: '20px 16px',
          position: 'sticky', top: 24,
          width: '100%', boxSizing: 'border-box',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>Order Summary</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span style={{ fontWeight: 500, color: '#0f172a' }}>₹{totalOriginal.toLocaleString()}</span>
            </div>
            {saved > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>Discount</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>− ₹{saved.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#64748b' }}>Delivery</span>
              <span style={{ fontWeight: 600, color: delivery === 0 ? '#22c55e' : '#0f172a' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>₹{(totalPrice + delivery).toLocaleString()}</span>
          </div>
          {saved > 0 && <p style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', margin: '-12px 0 16px', textAlign: 'right' }}>You save ₹{saved.toLocaleString()}</p>}

          <button onClick={handleCheckout} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            Proceed to Checkout <ChevronRight size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 12 }}>
            <Tag size={11} color="#94a3b8" />
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Safe &amp; Secure Payments</span>
          </div>

          {totalPrice < 999 && (
            <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: '#fefce8', border: '1px solid #fde68a', textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: '#92400e', fontWeight: 500 }}>
                Add <strong>₹{(999 - totalPrice).toLocaleString()}</strong> more for free delivery
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
