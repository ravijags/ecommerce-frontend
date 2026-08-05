import { useState as useStateCart } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowLeft, Tag, ChevronRight, Package, ShoppingCart, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const VALID_COUPONS = {
  'PREMIA10': 10,
  'SAVE20': 20,
  'FIRST15': 15,
}

function CouponSection({ onApply }) {
  const [code, setCode] = useStateCart('')
  const [applied, setApplied] = useStateCart(null)

  const handleApply = () => {
    const discount = VALID_COUPONS[code.toUpperCase()]
    if (discount) {
      setApplied({ code: code.toUpperCase(), discount })
      onApply(discount)
      toast.success(`Coupon applied! ${discount}% off`)
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    onApply(0)
    toast('Coupon removed')
  }

  return (
    <div style={{ marginBottom: 16, padding: '12px 0', borderTop: '1px solid #f1f5f9' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Promo Code</p>
      {applied ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={14} color="#16a34a" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{applied.code}</span>
            <span style={{ fontSize: 12, color: '#16a34a' }}>— {applied.discount}% off applied!</span>
          </div>
          <button onClick={handleRemove} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            id="coupon-code" name="coupon"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            placeholder="Enter coupon code"
            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#0f172a', outline: 'none', letterSpacing: '0.06em', fontWeight: 600, boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#C9A84C'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <button onClick={handleApply} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            Apply
          </button>
        </div>
      )}
      <p style={{ fontSize: 10, color: '#94a3b8', margin: '6px 0 0' }}>Try: PREMIA10, SAVE20, FIRST15</p>
    </div>
  )
}

export default function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate()
  const [couponDiscount, setCouponDiscount] = useStateCart(0)

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

  const totalPrice = cartItems.reduce((t, i) => t + (i.price * (i.quantity || 1)), 0)
  const totalOriginal = cartItems.reduce((t, i) => t + ((i.originalPrice || i.price) * (i.quantity || 1)), 0)
  const savedFromDiscount = totalOriginal - totalPrice
  const couponAmount = couponDiscount > 0 ? Math.round(totalPrice * couponDiscount / 100) : 0
  const saved = savedFromDiscount + couponAmount
  const finalPrice = totalPrice - couponAmount
  const delivery = finalPrice >= 999 ? 0 : 99

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    if (!token) { toast.error('Please sign in to checkout'); navigate('/login'); return }
    try {
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({
          items: cartItems.map(i => ({ product: i._id, quantity: 1, price: i.price })),
          totalAmount: finalPrice + delivery,
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
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Cart</h1>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#f1f5f9', color: '#64748b' }}>
          {cartItems.reduce((t, i) => t + (i.quantity || 1), 0)} {cartItems.reduce((t, i) => t + (i.quantity || 1), 0) === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, alignItems: 'start', width: '100%' }}>
        <style>{`
          .cart-grid { width: 100%; box-sizing: border-box; overflow: hidden; }
          .cart-grid > * { min-width: 0; max-width: 100%; box-sizing: border-box; }
          @media (min-width: 768px) { .cart-grid { grid-template-columns: 1fr 320px !important; gap: 24px !important; } }
          .cart-summary-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
          .cart-summary-row span:last-child { text-align: right; flex-shrink: 0; }
        `}</style>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cartItems.map((item, index) => (
            <div key={`${item._id}-${index}`} style={{
              display: 'flex', gap: 12, padding: '14px 12px',
              background: '#fff', borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxSizing: 'border-box', width: '100%',
              position: 'relative',
            }}>
              <Link to={`/products/${item._id}`}>
                <div style={{ width: 76, height: 76, borderRadius: 12, background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image?.startsWith('http') ? item.image : 'https://placehold.co/76x76'} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                </div>
              </Link>

              <div style={{ flex: 1, minWidth: 0, paddingRight: 32 }}>
                <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                </Link>
                {item.brand && <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.brand}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>₹{(item.price * (item.quantity || 1))?.toLocaleString('en-IN')}</span>
                  {item.quantity > 1 && (
                    <span style={{ fontSize: 11, color: '#64748b' }}>₹{item.price?.toLocaleString('en-IN')} × {item.quantity}</span>
                  )}
                  {item.originalPrice > item.price && (
                    <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{(item.originalPrice * (item.quantity || 1))?.toLocaleString('en-IN')}</span>
                  )}
                </div>
                {/* Quantity controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    <button
                      onClick={() => {
                        const qty = (item.quantity || 1) - 1
                        if (qty < 1) { removeFromCart(index); return }
                        setCartItems(prev => prev.map((ci, i) => i === index ? { ...ci, quantity: qty } : ci))
                        const token = localStorage.getItem('token')
                        if (token) fetch(`${import.meta.env.VITE_API_URL}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', authorization: token }, body: JSON.stringify({ productId: item._id, quantity: -1 }) }).catch(() => {})
                      }}
                      style={{ padding: '4px 10px', border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#0f172a' }}
                    >−</button>
                    <span style={{ padding: '4px 10px', fontSize: 13, fontWeight: 700, color: '#0f172a', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>{item.quantity || 1}</span>
                    <button
                      onClick={() => {
                        const qty = (item.quantity || 1) + 1
                        setCartItems(prev => prev.map((ci, i) => i === index ? { ...ci, quantity: qty } : ci))
                        const token = localStorage.getItem('token')
                        if (token) fetch(`${import.meta.env.VITE_API_URL}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', authorization: token }, body: JSON.stringify({ productId: item._id, quantity: 1 }) }).catch(() => {})
                      }}
                      style={{ padding: '4px 10px', border: 'none', background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#0f172a' }}
                    >+</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Package size={11} color="#22c55e" />
                    <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Free delivery</span>
                  </div>
                </div>
              </div>

              <button onClick={() => removeFromCart(index)} style={{
                position: 'absolute', top: 12, right: 12,
                padding: 6, borderRadius: 8,
                border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #e2e8f0', padding: '18px 14px',
          position: 'sticky', top: 24,
          boxSizing: 'border-box', width: '100%',
          minWidth: 0, overflow: 'hidden',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Order Summary</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', gap: 8 }}>
              <span style={{ flexShrink: 0 }}>Subtotal ({cartItems.reduce((t, i) => t + (i.quantity || 1), 0)} items)</span>
              <span style={{ fontWeight: 500, color: '#0f172a', textAlign: 'right' }}>₹{totalOriginal.toLocaleString('en-IN')}</span>
            </div>
            {savedFromDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
                <span style={{ color: '#64748b', flexShrink: 0 }}>Product Discount</span>
                <span style={{ fontWeight: 600, color: '#22c55e', textAlign: 'right' }}>− ₹{savedFromDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {couponAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
                <span style={{ color: '#64748b', flexShrink: 0 }}>Coupon ({couponDiscount}% off)</span>
                <span style={{ fontWeight: 700, color: '#16a34a', textAlign: 'right' }}>− ₹{couponAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 8 }}>
              <span style={{ color: '#64748b', flexShrink: 0 }}>Delivery</span>
              <span style={{ fontWeight: 600, color: delivery === 0 ? '#22c55e' : '#0f172a', textAlign: 'right' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', textAlign: 'right' }}>₹{(finalPrice + delivery).toLocaleString('en-IN')}</span>
          </div>
          {saved > 0 && <p style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', margin: '0 0 16px', textAlign: 'right' }}>You save ₹{saved.toLocaleString('en-IN')}</p>}

          {/* Coupon code */}
          <CouponSection onApply={(disc) => setCouponDiscount(disc)} />

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
