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
  { slug: 'mens-watches', label: 'Watches' },
  { slug: 'smartphones', label: 'Phones' },
  { slug: 'fragrances', label: 'Fragrances' },
  { slug: 'laptops', label: 'Laptops' },
  { slug: 'sunglasses', label: 'Sunglasses' },
  { slug: 'mens-shoes', label: 'Footwear' },
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

// ── Animated counter ──────────────────────────────────────────────────────
function useCounter(target, duration = 1400, decimal = false) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let current = 0
    const steps = 50
    const inc = target / steps
    const iv = setInterval(() => {
      current += inc
      if (current >= target) { setVal(target); clearInterval(iv) }
      else setVal(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
    }, duration / steps)
    return () => clearInterval(iv)
  }, [started])
  return [val, () => setStarted(true)]
}

// ── LUXURY HERO ───────────────────────────────────────────────────────────
function LuxuryHero({ items, onCategoryClick, onExplore }) {
  const [active, setActive]   = useState(0)
  const timerRef              = useRef(null)
  const [c1, s1] = useCounter(194)
  const [c2, s2] = useCounter(50)
  const [c3, s3] = useCounter(4.8, 1400, true)

  const go = (idx) => {
    setActive(idx)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(a => (a + 1) % items.length), 3000)
  }

  useEffect(() => {
    if (items.length < 2) return
    timerRef.current = setInterval(() => setActive(a => (a + 1) % items.length), 3000)
    return () => clearInterval(timerRef.current)
  }, [items.length])

  if (!items.length) return null
  const cur = items[active]
  const glow = cur.glow

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#05080f' }}>

      {/* ── Full-bleed animated glow — strong and dramatic ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`glow-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 80% 55% at 50% 0%,   ${glow}30 0%, transparent 60%),
              radial-gradient(ellipse 50% 70% at 80% 50%,  ${glow}14 0%, transparent 55%),
              radial-gradient(ellipse 50% 70% at 20% 50%,  ${glow}14 0%, transparent 55%)
            `,
          }}
        />
      </AnimatePresence>

      {/* Subtle dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
        backgroundSize: '36px 36px' }} />

      {/* ── HEADLINE — massive, above everything ── */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 'clamp(40px,6vw,72px) clamp(16px,5vw,48px) 0' }}>

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.22)',
            borderRadius: 100, padding: '5px 16px', marginBottom: 'clamp(18px,3vw,28px)',
          }}
        >
          <motion.span
            animate={{ scale: [1,1.5,1], opacity: [1,0.5,1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }}
          />
          <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
            Curated for the Discerning
          </span>
        </motion.div>

        {/* MASSIVE headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: '0 auto clamp(10px,2vw,20px)',
            fontSize: 'clamp(44px, 9vw, 110px)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: 'clamp(-2px, -0.03em, -4px)',
            maxWidth: 900,
          }}
        >
          <span style={{ color: '#fff' }}>The New<br />Standard of </span>
          <motion.span
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'linear-gradient(90deg, #C9A84C, #f5d78e, #C9A84C, #e8a020)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'inline',
            }}
          >
            Shopping.
          </motion.span>
        </motion.h1>

        {/* Inline stats — minimal, elegant */}
        <motion.div
          onViewportEnter={() => { s1(); s2(); s3() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, flexWrap: 'wrap',
            color: '#475569', fontSize: 'clamp(11px,1.5vw,13px)',
            marginBottom: 'clamp(28px,5vw,52px)',
          }}
        >
          <span style={{ color: '#C9A84C', fontWeight: 800 }}>{c1}+ Products</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: '#C9A84C', fontWeight: 800 }}>{c2}K+ Customers</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: '#C9A84C', fontWeight: 800 }}>{c3}★ Rating</span>
        </motion.div>
      </div>

      {/* ── BIG PRODUCT SHOWCASE ── */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', padding: '0 clamp(16px,5vw,48px)' }}>
        <div style={{ position: 'relative', width: 'clamp(200px, 45vw, 420px)', height: 'clamp(200px, 45vw, 420px)' }}>

          {/* Strong spotlight under product */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`spot-${active}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '-10%', left: '10%', right: '10%', height: '60%',
                borderRadius: '50%',
                background: `radial-gradient(ellipse, ${glow}70 0%, ${glow}22 40%, transparent 70%)`,
                filter: 'blur(28px)',
                pointerEvents: 'none',
              }}
            />
          </AnimatePresence>

          {/* Top glow halo */}
          <AnimatePresence mode="sync">
            <motion.div
              key={`halo-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                position: 'absolute',
                inset: '-25%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glow}28 0%, transparent 65%)`,
                pointerEvents: 'none',
              }}
            />
          </AnimatePresence>

          {/* Slow rotating outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -16, borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: `${glow}60`,
              borderRightColor: `${glow}20`,
            }}
          />

          {/* Dashed counter-rotate */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              border: `1px dashed ${glow}25`,
            }}
          />

          {/* Product image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={`img-${active}`}
              src={cur.img}
              alt={cur.name}
              initial={{ opacity: 0, scale: 0.78, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1,    y: 0,  filter: 'blur(0px)' }}
              exit={{   opacity: 0, scale: 1.12,  y: -28, filter: 'blur(10px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                filter: `drop-shadow(0 28px 56px ${glow}60) drop-shadow(0 0 0 transparent)`,
                position: 'relative', zIndex: 2,
                padding: '8%',
              }}
              onError={e => { e.target.style.opacity = 0 }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Product name */}
      <div style={{ textAlign: 'center', padding: 'clamp(10px,2vw,18px) 16px 0', position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={`name-${active}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(10px,1.4vw,12px)',
              fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0,
            }}
          >
            {cur.name}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, padding: 'clamp(14px,2vw,22px) 0 0', position: 'relative', zIndex: 2 }}>
        {items.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => go(i)}
            animate={{ width: i === active ? 28 : 7, background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.2)' }}
            transition={{ duration: 0.3 }}
            style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>

      {/* ── CTA Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45 }}
        style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          padding: 'clamp(20px,4vw,36px) clamp(16px,5vw,48px) 0',
          position: 'relative', zIndex: 2,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 20px 52px rgba(201,168,76,0.55)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          style={{
            background: 'linear-gradient(135deg, #C9A84C 0%, #e8b84b 100%)',
            color: '#0f172a', border: 'none', borderRadius: 14,
            padding: 'clamp(13px,2vw,16px) clamp(28px,4vw,44px)',
            fontSize: 'clamp(12px,1.5vw,14px)', fontWeight: 800,
            letterSpacing: '0.09em', textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: '0 8px 28px rgba(201,168,76,0.3)',
            transition: 'all 0.2s',
          }}
        >
          Explore Now →
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.06, borderColor: '#C9A84C', color: '#C9A84C' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryClick(cur.category)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            padding: 'clamp(13px,2vw,16px) clamp(22px,3vw,36px)',
            fontSize: 'clamp(12px,1.5vw,14px)', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
          }}
        >
          Shop {CATEGORIES.find(c => c.slug === cur.category)?.name || 'Collection'} →
        </motion.button>
      </motion.div>

      {/* ── Category pills ── */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
        padding: 'clamp(20px,3vw,32px) clamp(16px,5vw,48px) clamp(32px,5vw,56px)',
        position: 'relative', zIndex: 2,
      }}>
        {QUICK_CATS.map(cat => (
          <motion.button
            key={cat.slug}
            whileHover={{ scale: 1.08, background: 'rgba(201,168,76,0.14)', borderColor: 'rgba(201,168,76,0.5)', color: '#C9A84C' }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onCategoryClick(cat.slug)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#64748b', borderRadius: 100,
              padding: 'clamp(8px,1.5vw,11px) clamp(18px,2.5vw,26px)',
              fontSize: 'clamp(11px,1.4vw,13px)', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Bottom edge fade into page */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to top, #f8fafc, transparent)', pointerEvents: 'none', zIndex: 3 }} />
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

  const paginated  = sorted.slice(0, page * PER_PAGE)
  const hasMore    = paginated.length < sorted.length
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
