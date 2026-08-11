import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
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

// Categories shown in the dynamic button — feels curated
const FEATURED_CATS = [
  { slug: 'mens-watches', label: 'Shop Watches' },
  { slug: 'fragrances', label: 'Shop Fragrances' },
  { slug: 'laptops', label: 'Shop Laptops' },
  { slug: 'sunglasses', label: 'Shop Sunglasses' },
  { slug: 'smartphones', label: 'Shop Phones' },
  { slug: 'mens-shoes', label: 'Shop Footwear' },
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
function useCounter(target, duration = 1800, decimal = false) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let current = 0
    const steps = 60
    const increment = target / steps
    const interval = setInterval(() => {
      current += increment
      if (current >= target) { setVal(target); clearInterval(interval) }
      else setVal(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
    }, duration / steps)
    return () => clearInterval(interval)
  }, [started, target, duration, decimal])
  return [val, () => setStarted(true)]
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────
function TiltCard({ children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 })
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    x.set((clientX - rect.left) / rect.width - 0.5)
    y.set((clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800, position: 'relative' }}
    >
      {children}
      {/* Dynamic glare overlay */}
      <motion.div style={{
        position: 'absolute', inset: 0, borderRadius: 28, pointerEvents: 'none', zIndex: 10,
        background: useTransform([glareX, glareY], ([gx, gy]) =>
          `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12) 0%, transparent 60%)`
        ),
      }} />
    </motion.div>
  )
}

// ── Hero Showcase ─────────────────────────────────────────────────────────
function HeroShowcase({ images, names, onCategoryClick }) {
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)

  const goTo = (idx) => setActive(idx)

  useEffect(() => {
    if (images.length < 2) return
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % images.length)
    }, 2800)
    return () => clearInterval(timerRef.current)
  }, [images.length])

  if (!images.length) return (
    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 28, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)' }} />
  )

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* Outer pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <TiltCard>
        {/* Main glass card */}
        <div style={{
          width: '100%', aspectRatio: '1/1', borderRadius: 28,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(201,168,76,0.25)',
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.1) inset',
          position: 'relative',
        }}>

          {/* Gold corner brackets */}
          {[
            { top: 14, left: 14, borderTop: 2, borderLeft: 2, borderRadius: '6px 0 0 0' },
            { top: 14, right: 14, borderTop: 2, borderRight: 2, borderRadius: '0 6px 0 0' },
            { bottom: 14, left: 14, borderBottom: 2, borderLeft: 2, borderRadius: '0 0 0 6px' },
            { bottom: 14, right: 14, borderBottom: 2, borderRight: 2, borderRadius: '0 0 6px 0' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 22, height: 22, borderColor: 'rgba(201,168,76,0.6)', borderStyle: 'solid', borderWidth: 0, ...s }} />
          ))}

          {/* PREMIA watermark */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 11, fontWeight: 900, letterSpacing: '0.4em',
            color: 'rgba(201,168,76,0.06)', pointerEvents: 'none', zIndex: 0,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>PREMIA</div>

          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
              background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%)',
            }}
          />

          {/* Image crossfade */}
          <AnimatePresence mode="sync">
            <motion.img
              key={active}
              src={images[active]}
              alt=""
              initial={{ opacity: 0, scale: 1.08, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.94, filter: 'blur(4px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'contain', padding: '14%',
                zIndex: 1,
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
              }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </AnimatePresence>

          {/* Bottom gradient + name */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
            background: 'linear-gradient(to top, rgba(10,16,32,0.92) 0%, rgba(10,16,32,0.4) 60%, transparent 100%)',
            padding: '40px 18px 16px',
          }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.02em' }}
              >
                {names[active]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </TiltCard>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{
              width: i === active ? 22 : 6,
              background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.2)',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home({ addToCart, addToWishlist, searchQuery }) {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [category, setCategory]       = useState('')
  const [sort, setSort]               = useState('default')
  const [page, setPage]               = useState(1)
  const [heroImages, setHeroImages]   = useState([])
  const [heroNames, setHeroNames]     = useState([])
  const [searchParams]                = useSearchParams()
  const shuffleRef                    = useRef(null)

  // Pick a random featured category once on mount
  const featuredCat = useRef(FEATURED_CATS[Math.floor(Math.random() * FEATURED_CATS.length)])

  // Animated counters
  const [count1, start1] = useCounter(194)
  const [count2, start2] = useCounter(50)
  const [count3, start3] = useCounter(4.8, 1800, true)

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
        const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 5)
        setHeroImages(picked.map(p => p.image || p.thumbnail || p.images?.[0]))
        setHeroNames(picked.map(p => p.name))
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

      {/* ── HERO ── */}
      {!searchQuery && !category && (
        <div style={{
          background: 'linear-gradient(135deg, #080e1f 0%, #0f172a 40%, #111827 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.05) 1px, transparent 0)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

          {/* Ambient glows */}
          <div style={{ position: 'absolute', top: '-10%', left: '15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* ── Main flex row — stacks on mobile ── */}
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: 'clamp(40px, 6vw, 72px) clamp(20px, 4vw, 48px)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(32px, 5vw, 64px)',
            flexWrap: 'wrap',
          }}>

            {/* ── LEFT: Text ── */}
            <div style={{ flex: '1 1 300px', minWidth: 260 }}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 100, padding: '6px 14px', marginBottom: 22,
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', display: 'inline-block', flexShrink: 0 }}
                />
                <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                  Curated for the Discerning
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontWeight: 900, lineHeight: 1.05,
                  letterSpacing: 'clamp(-1px, -0.03em, -2px)',
                  marginBottom: 16,
                  fontSize: 'clamp(32px, 5.5vw, 68px)',
                }}
              >
                <span style={{ color: '#fff' }}>The New Standard<br />of </span>
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
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                style={{ color: '#64748b', fontSize: 'clamp(13px, 2vw, 15px)', lineHeight: 1.75, maxWidth: 360, marginBottom: 32 }}
              >
                194+ premium products from the world's finest brands. Every item handpicked. Every price unbeatable.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.45 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(201,168,76,0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C, #e8b84b)',
                    color: '#0f172a', border: 'none', borderRadius: 14,
                    padding: 'clamp(11px, 2vw, 14px) clamp(20px, 3vw, 32px)',
                    fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  Explore Now →
                </motion.button>

                {/* Dynamic category button — changes every load */}
                <motion.button
                  whileHover={{ scale: 1.04, borderColor: '#C9A84C', color: '#C9A84C' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setCategory(featuredCat.current.slug)
                    setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
                  }}
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14,
                    padding: 'clamp(11px, 2vw, 14px) clamp(16px, 2.5vw, 24px)',
                    fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {featuredCat.current.label} →
                </motion.button>
              </motion.div>

              {/* ── Animated Stats ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                style={{ display: 'flex', gap: 0 }}
              >
                {[
                  { value: count1, suffix: '+', label: 'Products', onView: start1 },
                  { value: count2, suffix: 'K+', label: 'Customers', onView: start2 },
                  { value: count3, suffix: '★', label: 'Rating', onView: start3 },
                ].map(({ value, suffix, label, onView }, i) => (
                  <motion.div
                    key={label}
                    onViewportEnter={onView}
                    style={{
                      flex: 1,
                      paddingRight: i < 2 ? 'clamp(12px, 2vw, 24px)' : 0,
                      paddingLeft: i > 0 ? 'clamp(12px, 2vw, 24px)' : 0,
                      borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>
                      {value}{suffix}
                    </div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: 3D Showcase — always visible, responsive size ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: '0 0 auto',
                width: 'clamp(220px, 38vw, 320px)',
                margin: '0 auto',
              }}
            >
              <HeroShowcase images={heroImages} names={heroNames} />
            </motion.div>

          </div>
        </div>
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
