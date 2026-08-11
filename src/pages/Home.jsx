import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../ProductCard'
import { getRecentlyViewed } from '../recentlyViewed'
import SkeletonCard from '../components/SkeletonCard'

const CATEGORIES = [
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'mobile-accessories', name: 'Audio' },
  { slug: 'mens-shirts', name: 'Fashion' },
  { slug: 'mens-shoes', name: 'Footwear' },
  { slug: 'beauty', name: 'Beauty' },
  { slug: 'skin-care', name: 'Skin Care' },
  { slug: 'fragrances', name: 'Fragrances' },
  { slug: 'mens-watches', name: 'Watches' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'groceries', name: 'Groceries' },
  { slug: 'sports-accessories', name: 'Sports' },
  { slug: 'sunglasses', name: 'Sunglasses' },
  { slug: 'tablets', name: 'Tablets' },
  { slug: 'kitchen-accessories', name: 'Kitchen' },
]

const QUICK_CATS = [
  { slug: 'mens-watches', label: '⌚ Watches' },
  { slug: 'smartphones', label: '📱 Phones' },
  { slug: 'fragrances', label: '✨ Fragrances' },
  { slug: 'laptops', label: '💻 Laptops' },
  { slug: 'sunglasses', label: '🕶 Sunglasses' },
  { slug: 'mens-shoes', label: '👟 Footwear' },
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

const PER_PAGE = 20

// ── Animated counter ──────────────────────────────────────────────────────
function useCounter(target, duration = 1600, decimal = false) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let current = 0
    const steps = 50
    const increment = target / steps
    const iv = setInterval(() => {
      current += increment
      if (current >= target) { setVal(target); clearInterval(iv) }
      else setVal(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
    }, duration / steps)
    return () => clearInterval(iv)
  }, [started])
  return [val, () => setStarted(true)]
}

// ── Full-width Luxury Hero ────────────────────────────────────────────────
function LuxuryHero({ items, onCategoryClick, onExplore }) {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const timerRef = useRef(null)

  const go = (idx) => {
    setDir(idx > active ? 1 : -1)
    setActive(idx)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 3200)
  }

  const next = () => {
    setDir(1)
    setActive(a => (a + 1) % items.length)
  }

  useEffect(() => {
    if (items.length < 2) return
    timerRef.current = setInterval(next, 3200)
    return () => clearInterval(timerRef.current)
  }, [items.length])

  const [c1, s1] = useCounter(194)
  const [c2, s2] = useCounter(50)
  const [c3, s3] = useCounter(4.8, 1600, true)

  if (!items.length) return null
  const cur = items[active]

  return (
    <div style={{
      position: 'relative', width: '100%', overflow: 'hidden',
      background: '#080c18',
      minHeight: 'clamp(520px, 80vh, 780px)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Animated background that changes color per product ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${cur.glow}22 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #080c18, transparent)', pointerEvents: 'none', zIndex: 3 }} />

      {/* ── Main content ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', position: 'relative', zIndex: 2,
        padding: 'clamp(32px, 5vw, 60px) clamp(20px, 5vw, 48px) clamp(24px, 4vw, 48px)',
        textAlign: 'center',
      }}>

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 'clamp(16px, 3vw, 28px)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }}
          />
          <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Everything Premium. Delivered.
          </span>
        </motion.div>

        {/* ── BIG Product Image with spotlight ── */}
        <div style={{
          position: 'relative',
          width: 'clamp(180px, 38vw, 340px)',
          height: 'clamp(180px, 38vw, 340px)',
          marginBottom: 'clamp(20px, 4vw, 36px)',
        }}>
          {/* Spotlight glow behind image */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`glow-${active}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'absolute',
                inset: '-30%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${cur.glow}55 0%, ${cur.glow}11 40%, transparent 70%)`,
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
          </AnimatePresence>

          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -12,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: 'rgba(201,168,76,0.4)',
              borderRightColor: 'rgba(201,168,76,0.15)',
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -6,
              borderRadius: '50%',
              border: '1px dashed rgba(201,168,76,0.2)',
            }}
          />

          {/* Product image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={`img-${active}`}
              src={cur.img}
              alt={cur.name}
              initial={{ opacity: 0, scale: 0.82, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))',
                position: 'relative', zIndex: 2,
              }}
              onError={e => { e.target.style.opacity = 0 }}
            />
          </AnimatePresence>
        </div>

        {/* Product name */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`name-${active}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
              margin: '0 0 clamp(12px, 2vw, 20px)',
            }}
          >
            {cur.name}
          </motion.p>
        </AnimatePresence>

        {/* Big headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            fontWeight: 900, margin: '0 0 clamp(10px, 2vw, 18px)',
            fontSize: 'clamp(30px, 6vw, 72px)',
            lineHeight: 1.05, letterSpacing: 'clamp(-1px, -0.025em, -2px)',
            maxWidth: 700,
          }}
        >
          <span style={{ color: '#fff' }}>The New Standard of </span>
          <motion.span
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'linear-gradient(90deg, #C9A84C, #f5d78e, #e8a020, #C9A84C)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Shopping.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            color: '#475569', fontSize: 'clamp(13px, 1.8vw, 15px)',
            lineHeight: 1.7, maxWidth: 420,
            margin: '0 0 clamp(20px, 4vw, 36px)',
          }}
        >
          194+ premium products from the world's finest brands.
          Every item handpicked. Every price unbeatable.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'clamp(24px, 4vw, 44px)' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 48px rgba(201,168,76,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onExplore}
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #e8b84b 100%)',
              color: '#0f172a', border: 'none', borderRadius: 14,
              padding: 'clamp(12px, 2vw, 15px) clamp(24px, 4vw, 40px)',
              fontSize: 'clamp(12px, 1.5vw, 14px)', fontWeight: 800,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', boxShadow: '0 8px 28px rgba(201,168,76,0.35)',
              transition: 'all 0.2s',
            }}
          >
            Explore Now →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#C9A84C', color: '#C9A84C' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCategoryClick('mens-watches')}
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: 'clamp(12px, 2vw, 15px) clamp(20px, 3vw, 32px)',
              fontSize: 'clamp(12px, 1.5vw, 14px)', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
            }}
          >
            Shop Collection
          </motion.button>
        </motion.div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 'clamp(20px, 4vw, 40px)' }}>
          {items.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => go(i)}
              animate={{
                width: i === active ? 28 : 7,
                background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.18)',
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          style={{
            display: 'flex', gap: 0,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, overflow: 'hidden',
            width: '100%', maxWidth: 380,
          }}
        >
          {[
            { val: c1, suffix: '+', label: 'Products', start: s1 },
            { val: c2, suffix: 'K+', label: 'Customers', start: s2 },
            { val: c3, suffix: '★', label: 'Rating', start: s3 },
          ].map(({ val, suffix, label, start }, i) => (
            <motion.div
              key={label}
              onViewportEnter={start}
              style={{
                flex: 1, padding: 'clamp(12px, 2vw, 18px) 8px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>
                {val}{suffix}
              </div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Quick category pills ── */}
      <div style={{
        position: 'relative', zIndex: 4,
        display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
        padding: 'clamp(12px, 2vw, 20px) clamp(16px, 4vw, 32px) clamp(20px, 3vw, 32px)',
      }}>
        {QUICK_CATS.map(cat => (
          <motion.button
            key={cat.slug}
            whileHover={{ scale: 1.07, background: 'rgba(201,168,76,0.15)', borderColor: '#C9A84C', color: '#C9A84C' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick(cat.slug)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', borderRadius: 100,
              padding: 'clamp(7px, 1.2vw, 9px) clamp(14px, 2vw, 20px)',
              fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Glow colors per product category — makes each slide feel unique
const GLOW_MAP = {
  'mens-watches':      '#C9A84C',
  'smartphones':       '#3b82f6',
  'laptops':           '#8b5cf6',
  'fragrances':        '#ec4899',
  'sunglasses':        '#10b981',
  'tablets':           '#06b6d4',
  'mens-shoes':        '#f97316',
  'beauty':            '#f43f5e',
  'default':           '#C9A84C',
}

export default function Home({ addToCart, addToWishlist, searchQuery }) {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [category, setCategory]   = useState('')
  const [sort, setSort]           = useState('default')
  const [page, setPage]           = useState(1)
  const [heroItems, setHeroItems] = useState([])
  const [searchParams]            = useSearchParams()
  const shuffleRef                = useRef(null)

  useEffect(() => {
    const cat = searchParams.get('category') || ''
    setCategory(cat)
    if (cat) setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [searchParams])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
      .then(r => r.json())
      .then(d => {
        const all = d.products || []
        setProducts(all)
        setLoading(false)

        const preferred = ['mens-watches', 'smartphones', 'laptops', 'fragrances', 'sunglasses', 'tablets', 'mens-shoes', 'beauty']
        const pool = all.filter(p => {
          const img = p.image || p.thumbnail || (p.images && p.images[0])
          return img && img.startsWith('http') && preferred.includes(p.category)
        })
        const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 6)
        setHeroItems(picked.map(p => ({
          img: p.image || p.thumbnail || p.images?.[0],
          name: p.name,
          category: p.category,
          glow: GLOW_MAP[p.category] || GLOW_MAP.default,
        })))
      })
      .catch(() => setLoading(false))
  }, [])

  if (products.length > 0 && !shuffleRef.current) {
    shuffleRef.current = [...products].sort(() => Math.random() - 0.5)
  }
  const base = shuffleRef.current || products

  useEffect(() => { setPage(1) }, [category, searchQuery, sort])

  const filtered = base.filter(p => {
    const q = searchQuery?.toLowerCase() || ''
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
    const matchCat = !category || p.category === category
    return matchSearch && matchCat
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sort === 'discount') return (b.discount || 0) - (a.discount || 0)
    return 0
  })

  const paginated = sorted.slice(0, page * PER_PAGE)
  const hasMore = paginated.length < sorted.length
  const activeLabel = CATEGORIES.find(c => c.slug === category)?.name || 'All Products'

  const handleCategoryClick = (slug) => {
    setCategory(slug)
    setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  if (loading) return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px 12px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ width: 140, height: 24, borderRadius: 8, background: '#e2e8f0', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
          <div style={{ width: 120, height: 32, borderRadius: 8, background: '#e2e8f0', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
        </div>
        <div className="product-grid">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }} className="mobile-page-padding">

      {!searchQuery && !category && (
        <LuxuryHero
          items={heroItems}
          onCategoryClick={handleCategoryClick}
          onExplore={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
        />
      )}

      {/* ── PRODUCTS SECTION ── */}
      <div id="products-section" style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 12px 32px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <h2 style={{ color: '#0f172a', fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
            {searchQuery ? `"${searchQuery}"` : activeLabel}
            <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 400, marginLeft: 8 }}>({sorted.length})</span>
          </h2>
          <select
            value={sort} onChange={e => setSort(e.target.value)}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', fontSize: 12, padding: '8px 10px', borderRadius: 10, cursor: 'pointer', outline: 'none', flexShrink: 0 }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {category && (
          <div style={{ marginBottom: 14 }}>
            <button onClick={() => setCategory('')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {activeLabel} <span style={{ fontSize: 13 }}>×</span>
            </button>
          </div>
        )}

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
            <p style={{ color: '#0f172a', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No products found</p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Try a different search or category</p>
            <button onClick={() => setCategory('')} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {paginated.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: Math.min((i % 6) * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
                >
                  <div style={{ width: '100%' }}>
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image || product.thumbnail || (product.images && product.images[0])}
                      rating={product.rating}
                      discount={product.discount}
                      originalPrice={product.originalPrice}
                      brand={product.brand}
                      onAddToCart={() => addToCart(product)}
                      onAddToWishlist={() => addToWishlist && addToWishlist(product)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <button onClick={() => setPage(p => p + 1)} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>
                  Load More · {sorted.length - paginated.length} remaining
                </button>
              </div>
            )}
          </>
        )}

        {!searchQuery && !category && (() => {
          const recent = getRecentlyViewed()
          if (!recent.length) return null
          return (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Recently Viewed</h2>
              <div className="product-grid">
                {recent.map(p => (
                  <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                    image={p.image} rating={p.rating} discount={p.discount}
                    originalPrice={p.originalPrice} brand={p.brand}
                    onAddToCart={() => addToCart(p)}
                    onAddToWishlist={() => addToWishlist && addToWishlist(p)}
                  />
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
