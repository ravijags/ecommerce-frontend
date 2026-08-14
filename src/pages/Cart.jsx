import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, Shield, Truck, RotateCcw, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

export default function Cart({ cartItems, setCartItems }) {
  const navigate  = useNavigate()
  const token     = localStorage.getItem('token')
  const [coupon, setCoupon]           = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading]         = useState(false)
  const [removingId, setRemovingId]   = useState(null)

  const subtotal    = cartItems.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0)
  const discount    = cartItems.reduce((sum, i) => {
    const orig = i.originalPrice || i.price
    return sum + (orig - i.price) * (i.quantity || 1)
  }, 0)
  const couponAmt   = couponApplied ? Math.round(subtotal * couponDiscount / 100) : 0
  const delivery    = subtotal > 999 ? 0 : 99
  const total       = subtotal - couponAmt + delivery

  const updateQty = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta
    if (newQty < 1) return
    setCartItems(prev => prev.map(i => i._id === item._id ? { ...i, quantity: newQty } : i))
    if (token) {
      fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ productId: item._id, quantity: delta }),
      }).catch(() => {})
    }
  }

  const removeItem = async (item) => {
    setRemovingId(item._id)
    setTimeout(() => {
      setCartItems(prev => prev.filter(i => i._id !== item._id))
      setRemovingId(null)
      toast.success('Item removed')
    }, 300)
    if (token) {
      fetch(`${API}/api/cart/${item._id}`, {
        method: 'DELETE', headers: { authorization: token },
      }).catch(() => {})
    }
  }

  const applyCoupon = () => {
    setCouponError('')
    if (!coupon.trim()) return setCouponError('Enter a coupon code')
    if (coupon.toUpperCase() === 'PREMIA10') {
      setCouponApplied(true); setCouponDiscount(10)
      toast.success('Coupon applied! 10% off 🎉')
    } else if (coupon.toUpperCase() === 'SAVE20') {
      setCouponApplied(true); setCouponDiscount(20)
      toast.success('Coupon applied! 20% off 🎉')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handleCheckout = async () => {
    if (!token) { toast.error('Please login to checkout'); navigate('/login'); return }
    if (cartItems.length === 0) return
    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/orders/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({
          items: cartItems.map(i => ({ product: i._id, quantity: i.quantity || 1, price: i.price })),
          totalAmount: total,
          couponCode: couponApplied ? coupon : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.message || 'Checkout failed'); setLoading(false); return }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: 'INR',
        name: 'PREMIA',
        description: 'Everything Premium. Delivered.',
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await fetch(`${API}/api/orders/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authorization: token },
            body: JSON.stringify({ ...response, items: cartItems, totalAmount: total }),
          })
          const verifyData = await verifyRes.json()
          if (verifyRes.ok) {
            toast.success('Order placed successfully! 🎉')
            setCartItems([])
            navigate('/orders')
          } else {
            toast.error(verifyData.message || 'Payment verification failed')
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#C9A84C' },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Empty cart ────────────────────────────────────────────────────────
  if (cartItems.length === 0) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafafa' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', maxWidth: 400 }}>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 72, marginBottom: 20 }}>🛒</motion.div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.5px' }}>
          Your cart is empty
        </h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          Looks like you haven't added anything yet. Explore our premium collection and find something you'll love.
        </p>
        <Link to="/">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a',
              border: 'none', borderRadius: 14, padding: '14px 36px',
              fontSize: 14, fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(201,168,76,0.35)' }}>
            Explore Products →
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', padding: 'clamp(16px,3vw,32px) clamp(12px,4vw,24px) 64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 900, color: '#0f172a',
            margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            My Cart
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {/* Main grid */}
        <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: Cart items ── */}
          <div className="cart-items-col" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div key={item._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: removingId === item._id ? 0 : 1, x: removingId === item._id ? 40 : 0, y: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ background: '#fff', borderRadius: 16, padding: 'clamp(12px,2vw,20px)',
                    border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    display: 'flex', gap: 'clamp(12px,2vw,20px)', alignItems: 'flex-start' }}>

                  {/* Product image */}
                  <Link to={`/products/${item._id}`} style={{ flexShrink: 0 }}>
                    <div style={{ width: 'clamp(90px,20vw,110px)', height: 'clamp(90px,20vw,110px)',
                      borderRadius: 12, background: '#f4f6f8', overflow: 'hidden',
                      border: '1px solid #e8ecf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image || item.thumbnail}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                        onError={e => { e.target.src = 'https://placehold.co/110x110/f4f6f8/94a3b8?text=?' }} />
                    </div>
                  </Link>

                  {/* Item details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {item.brand && (
                      <p style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                        {item.brand}
                      </p>
                    )}
                    <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ color: '#0f172a', fontSize: 'clamp(13px,1.8vw,15px)', fontWeight: 600,
                        lineHeight: 1.4, margin: '0 0 8px',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </h3>
                    </Link>

                    {/* Price row */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 'clamp(15px,2vw,18px)', fontWeight: 800, color: '#0f172a' }}>
                        ₹{item.price?.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <span style={{ fontSize: 12, color: '#c4c4c4', textDecoration: 'line-through' }}>
                          ₹{item.originalPrice?.toLocaleString('en-IN')}
                        </span>
                      )}
                      {item.originalPrice > item.price && (
                        <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>
                          {Math.round((item.originalPrice - item.price) / item.originalPrice * 100)}% off
                        </span>
                      )}
                    </div>

                    {/* Qty + Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center',
                        border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                        <button onClick={() => updateQty(item, -1)}
                          style={{ width: 34, height: 34, border: 'none', background: '#f8fafc',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#0f172a', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                          <Minus size={13} />
                        </button>
                        <span style={{ width: 36, textAlign: 'center', fontWeight: 800,
                          fontSize: 14, color: '#0f172a', borderLeft: '1px solid #e2e8f0',
                          borderRight: '1px solid #e2e8f0', lineHeight: '34px' }}>
                          {item.quantity || 1}
                        </span>
                        <button onClick={() => updateQty(item, 1)}
                          style={{ width: 34, height: 34, border: 'none', background: '#f8fafc',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#0f172a', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <button onClick={() => removeItem(item)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                          border: '1px solid #fee2e2', borderRadius: 8, background: '#fff',
                          color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Item total — desktop */}
                  <div className="cart-item-total" style={{ flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                    </p>
                    {(item.quantity || 1) > 1 && (
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0' }}>
                        ₹{item.price?.toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#0f172a', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              padding: '10px 0', transition: 'color 0.15s',
              display: 'inline-flex', alignItems: 'center', gap: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              ← Continue Shopping
            </Link>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="cart-summary-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Coupon */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20,
              border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Tag size={14} color="#C9A84C" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Apply Coupon</span>
              </div>
              {couponApplied ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                    borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎉</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', margin: 0 }}>
                        {coupon.toUpperCase()} applied!
                      </p>
                      <p style={{ fontSize: 11, color: '#16a34a', margin: 0 }}>
                        You save ₹{couponAmt.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCoupon('') }}
                    style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}>
                    ×
                  </button>
                </motion.div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="PREMIA10 or SAVE20"
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 10,
                        border: `1.5px solid ${couponError ? '#fca5a5' : '#e2e8f0'}`,
                        fontSize: 12, color: '#0f172a', outline: 'none',
                        background: '#fafafa', fontFamily: 'Inter, system-ui' }}
                      onFocus={e => e.target.style.borderColor = '#C9A84C'}
                      onBlur={e => e.target.style.borderColor = couponError ? '#fca5a5' : '#e2e8f0'}
                    />
                    <button onClick={applyCoupon}
                      style={{ padding: '10px 16px', borderRadius: 10, border: 'none',
                        background: '#0f172a', color: '#fff', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p style={{ color: '#ef4444', fontSize: 11, margin: '6px 0 0', fontWeight: 500 }}>
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Price summary */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20,
              border: '1px solid #ebebeb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px',
                textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Price Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {[
                  { label: `Price (${cartItems.length} item${cartItems.length !== 1 ? 's' : ''})`, value: `₹${subtotal.toLocaleString('en-IN')}`, color: '#0f172a' },
                  discount > 0 && { label: 'Discount', value: `-₹${discount.toLocaleString('en-IN')}`, color: '#16a34a' },
                  couponApplied && { label: `Coupon (${coupon.toUpperCase()})`, value: `-₹${couponAmt.toLocaleString('en-IN')}`, color: '#16a34a' },
                  { label: 'Delivery', value: delivery === 0 ? 'FREE' : `₹${delivery}`, color: delivery === 0 ? '#16a34a' : '#0f172a' },
                ].filter(Boolean).map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 14px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {discount + couponAmt > 0 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
                  padding: '8px 12px', marginBottom: 16, textAlign: 'center' }}>
                  <p style={{ color: '#16a34a', fontSize: 12, fontWeight: 700, margin: 0 }}>
                    🎉 You save ₹{(discount + couponAmt).toLocaleString('en-IN')} on this order!
                  </p>
                </div>
              )}

              {/* ── CHECKOUT BUTTON — gold, prominent ── */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(201,168,76,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: '100%', padding: '16px',
                  background: loading ? '#92702a' : 'linear-gradient(135deg, #C9A84C 0%, #e8b84b 100%)',
                  color: '#0f172a', border: 'none', borderRadius: 14,
                  fontSize: 15, fontWeight: 800, letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(201,168,76,0.35)',
                  transition: 'all 0.2s',
                }}>
                {loading
                  ? <><div style={{ width: 18, height: 18, border: '2.5px solid #0f172a40', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Processing...</>
                  : <><ShoppingBag size={17} /> Proceed to Checkout</>
                }
              </motion.button>

              {/* Secure badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, marginTop: 12 }}>
                <Shield size={12} color="#16a34a" />
                <span style={{ fontSize: 11, color: '#64748b' }}>Secured by Razorpay · 100% safe</span>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '14px 18px',
              border: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: Truck,     text: 'Free delivery on orders above ₹999' },
                { Icon: RotateCcw, text: '7-day hassle-free returns' },
                { Icon: Shield,    text: '100% authentic products guaranteed' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={14} color="#C9A84C" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#64748b' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-item-total { display: none !important; }
          .cart-items-col { order: 1; }
          .cart-summary-col { order: 2; }
        }
      `}</style>
    </div>
  )
}
