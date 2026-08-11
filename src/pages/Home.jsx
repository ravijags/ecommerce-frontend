import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../ProductCard'
import { getRecentlyViewed } from '../recentlyViewed'
import SkeletonCard from '../components/SkeletonCard'

const CATEGORIES = [
  { slug: 'smartphones',       name: 'Smartphones' },
  { slug: 'laptops',           name: 'Laptops' },
  { slug: 'mobile-accessories',name: 'Audio' },
  { slug: 'mens-shirts',       name: 'Fashion' },
  { slug: 'mens-shoes',        name: 'Footwear' },
  { slug: 'beauty',            name: 'Beauty' },
  { slug: 'skin-care',         name: 'Skin Care' },
  { slug: 'fragrances',        name: 'Fragrances' },
  { slug: 'mens-watches',      name: 'Watches' },
  { slug: 'furniture',         name: 'Furniture' },
  { slug: 'groceries',         name: 'Groceries' },
  { slug: 'sports-accessories',name: 'Sports' },
  { slug: 'sunglasses',        name: 'Sunglasses' },
  { slug: 'tablets',           name: 'Tablets' },
  { slug: 'kitchen-accessories',name: 'Kitchen' },
]

const QUICK_CATS = [
  { slug: 'mens-watches', label: 'Watches' },
  { slug: 'smartphones',  label: 'Phones' },
  { slug: 'fragrances',   label: 'Fragrances' },
  { slug: 'laptops',      label: 'Laptops' },
  { slug: 'sunglasses',   label: 'Sunglasses' },
  { slug: 'mens-shoes',   label: 'Footwear' },
]

const GLOW_MAP = {
  'mens-watches':   '#d4a847',
  'smartphones':    '#4f8ef7',
  'laptops':        '#a78bfa',
  'fragrances':     '#f472b6',
  'sunglasses':     '#34d399',
  'tablets':        '#22d3ee',
  'mens-shoes':     '#fb923c',
  'beauty':         '#fb7185',
  'default':        '#d4a847',
}

const SORT_OPTIONS = [
  { value: 'default',    label: 'Recommended' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'discount',   label: 'Best Discount' },
]

const PER_PAGE = 20

function useCounter(target, duration = 1400, decimal = false) {
  const [val, setVal]       = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let cur = 0
    const steps = 50
    const inc = target / steps
    const iv = setInterval(() => {
      cur += inc
      if (cur >= target) { setVal(target); clearInterval(iv) }
      else setVal(decimal ? parseFloat(cur.toFixed(1)) : Math.floor(cur))
    }, duration / steps)
    return () => clearInterval(iv)
  }, [started])
  return [val, () => setStarted(true)]
}

// ── MAGAZINE SPLIT HERO ───────────────────────────────────────────────────
function LuxuryHero({ items, onCategoryClick, onExplore }) {
  const [active, setActive] = useState(0)
  const timerRef            = useRef(null)
  const [c1, s1] = useCounter(194)
  const [c2, s2] = useCounter(50)
  const [c3, s3] = useCounter(4.8, 1400, true)
  const started  = useRef(false)

  const startCounters = () => {
    if (started.current) return
    started.current = true
    s1(); s2(); s3()
  }

  const go = (idx) => {
    setActive(idx)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(a => (a + 1) % items.length), 3200)
  }

  useEffect(() => {
    if (items.length < 2) return
    timerRef.current = setInterval(() => setActive(a => (a + 1) % items.length), 3200)
    return () => clearInterval(timerRef.current)
  }, [items.length])

  if (!items.length) return null
  const cur  = items[active]
  const glow = cur.glow
  const catName = CATEGORIES.find(c => c.slug === cur.category)?.name || 'Collection'

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#05080f' }}>

      {/* Full-bleed animated glow — shifts color per product */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 65% 80% at 75% 50%, ${glow}28 0%, transparent 65%),
              radial-gradient(ellipse 50% 60% at 20% 30%, ${glow}10 0%, transparent 60%)
            `,
          }}
        />
      </AnimatePresence>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
        backgroundSize: '36px 36px',
      }} />

      {/* ── MAGAZINE SPLIT — left text, right image ── */}
      <div style={{
        maxWidth: 1300, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        minHeight: 'clamp(520px, 85vh, 760px)',
        padding: '0 clamp(20px, 5vw, 64px)',
        gap: 'clamp(24px, 4vw, 64px)',
        position: 'relative', zIndex: 2,
        flexWrap: 'wrap',                   // stacks on mobile
      }}>

        {/* ══ LEFT: All text content ══ */}
        <div style={{ flex: '1 1 340px', minWidth: 280, padding: 'clamp(40px,6vw,80px) 0' }}>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: 100, padding: '5px 14px',
              marginBottom: 'clamp(16px,3vw,24px)',
            }}
          >
            <motion.span
              animate={{ scale: [1,1.5,1], opacity: [1,0.4,1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }}
            />
            <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              Curated for the Discerning
            </span>
          </motion.div>

          {/* MASSIVE headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: '0 0 clamp(16px,3vw,28px)',
              fontSize: 'clamp(42px, 7vw, 96px)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: 'clamp(-2px,-0.03em,-4px)',
            }}
          >
            <span style={{ color: '#fff', display: 'block' }}>The New</span>
            <span style={{ color: '#fff', display: 'block' }}>Standard</span>
            <span style={{ display: 'block' }}>
              <span style={{ color: '#fff' }}>of </span>
              <motion.span
                animate={{ backgroundPosition: ['0% 50%','100% 50%','0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, #C9A84C, #f5d78e, #C9A84C, #e8a020)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                Shopping.
              </motion.span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              color: '#475569',
              fontSize: 'clamp(13px,1.6vw,15px)',
              lineHeight: 1.75,
              maxWidth: 380,
              margin: '0 0 clamp(24px,4vw,40px)',
            }}
          >
            194+ premium products from the world's finest brands.
            Every item handpicked. Every price unbeatable.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.45 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 'clamp(28px,4vw,48px)' }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 52px rgba(201,168,76,0.55)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onExplore}
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #e8b84b 100%)',
                color: '#0f172a', border: 'none', borderRadius: 14,
                padding: 'clamp(12px,2vw,15px) clamp(24px,3.5vw,40px)',
                fontSize: 'clamp(12px,1.4vw,14px)', fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', boxShadow: '0 8px 28px rgba(201,168,76,0.3)',
                transition: 'all 0.2s',
              }}
            >
              Explore Now →
            </motion.button>

            {/* Smart button — reads current product's category */}
            <AnimatePresence mode="wait">
              <motion.button
                key={cur.category}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, borderColor: '#C9A84C', color: '#C9A84C' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(cur.category)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  padding: 'clamp(12px,2vw,15px) clamp(20px,3vw,32px)',
                  fontSize: 'clamp(12px,1.4vw,14px)', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
                }}
              >
                Shop {catName} →
              </motion.button>
            </AnimatePresence>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            onViewportEnter={startCounters}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ display: 'flex', gap: 'clamp(20px,3vw,40px)' }}
          >
            {[
              { val: c1, suffix: '+', label: 'Products' },
              { val: c2, suffix: 'K+', label: 'Customers' },
              { val: c3, suffix: '★', label: 'Rating' },
            ].map(({ val, suffix, label }, i) => (
              <div key={label}>
                <div style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>
                  {val}{suffix}
                </div>
                <div style={{ fontSize: 10, color: '#334155', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ RIGHT: Full-height product image ══ */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            flex: '1 1 300px',
            minWidth: 260,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            padding: 'clamp(32px,5vw,60px) 0',
          }}
        >
          {/* Giant glow behind image */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`halo-${active}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                position: 'absolute',
                width: '130%', height: '130%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glow}45 0%, ${glow}15 35%, transparent 65%)`,
                filter: 'blur(32px)',
                pointerEvents: 'none',
              }}
            />
          </AnimatePresence>

          {/* Floor shadow */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`shadow-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute',
                bottom: '8%', left: '15%', right: '15%', height: 40,
                background: `radial-gradient(ellipse, ${glow}80 0%, transparent 70%)`,
                filter: 'blur(20px)',
                borderRadius: '50%',
              }}
            />
          </AnimatePresence>

          {/* Slow outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: 'clamp(280px,42vw,480px)',
              height: 'clamp(280px,42vw,480px)',
              borderRadius: '50%',
              border: `1px solid ${glow}35`,
              borderTopColor: `${glow}70`,
            }}
          />
          {/* Dashed inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: 'clamp(220px,34vw,390px)',
              height: 'clamp(220px,34vw,390px)',
              borderRadius: '50%',
              border: `1px dashed ${glow}22`,
            }}
          />

          {/* THE PRODUCT — big and proud */}
          <div style={{
            position: 'relative', zIndex: 2,
            width: 'clamp(220px,38vw,440px)',
            height: 'clamp(220px,38vw,440px)',
          }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={`img-${active}`}
                src={cur.img}
                alt={cur.name}
                initial={{ opacity: 0, scale: 0.75, y: 32, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1,    y: 0,  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }}
                exit={{   opacity: 0, scale: 1.15,  y: -32, filter: 'blur(12px)',
                  transition: { duration: 0.45, ease: 'easeIn' }
                }}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  filter: `drop-shadow(0 32px 64px ${glow}70)`,
                  padding: '5%',
                }}
                onError={e => { e.target.style.opacity = 0 }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom strip: dots + category pills ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(16px,2.5vw,24px) clamp(20px,5vw,64px)',
        display: 'flex', alignItems: 'center',
        gap: 'clamp(16px,3vw,32px)',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>
          {items.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => go(i)}
              animate={{
                width: i === active ? 26 : 7,
                background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.2)',
              }}
              transition={{ duration: 0.3 }}
              style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {QUICK_CATS.map(cat => (
            <motion.button
              key={cat.slug}
              whileHover={{ scale: 1.07, background: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.45)', color: '#C9A84C' }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onCategoryClick(cat.slug)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#64748b', borderRadius: 100,
                padding: 'clamp(6px,1.2vw,9px) clamp(14px,2vw,22px)',
                fontSize: 'clamp(10px,1.3vw,12px)', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fade into page */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to top, #f8fafc, transparent)',
        pointerEvents: 'none', zIndex: 3,
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
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
        const preferred = ['mens-watches','smartphones','laptops','fragrances','sunglasses','tablets','mens-shoes','beauty']
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
    if (sort === 'price-low')  return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'rating')     return (b.rating || 0) - (a.rating || 0)
    if (sort === 'discount')   return (b.discount || 0) - (a.discount || 0)
    return 0
  })

  const paginated   = sorted.slice(0, page * PER_PAGE)
  const hasMore     = paginated.length < sorted.length
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
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', fontSize: 12, padding: '8px 10px', borderRadius: 10, cursor: 'pointer', outline: 'none', flexShrink: 0 }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {category && (
          <div style={{ marginBottom: 14 }}>
            <button onClick={() => setCategory('')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {activeLabel} <span style={{ fontSize: 13 }}>×</span>
            </button>
          </div>
        )}

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
            <p style={{ color: '#0f172a', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No products found</p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Try a different search or category</p>
            <button onClick={() => setCategory('')}
              style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {paginated.map((product, i) => (
                <motion.div key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: Math.min((i % 6) * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}>
                  <div style={{ width: '100%' }}>
                    <ProductCard
                      id={product._id} name={product.name} price={product.price}
                      image={product.image || product.thumbnail || (product.images && product.images[0])}
                      rating={product.rating} discount={product.discount}
                      originalPrice={product.originalPrice} brand={product.brand}
                      onAddToCart={() => addToCart(product)}
                      onAddToWishlist={() => addToWishlist && addToWishlist(product)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <button onClick={() => setPage(p => p + 1)}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>
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
