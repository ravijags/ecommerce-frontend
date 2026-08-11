import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../ProductCard'
import { getRecentlyViewed } from '../recentlyViewed'
import SkeletonCard from '../components/SkeletonCard'

const CATEGORIES = [
  { slug: 'smartphones',        name: 'Smartphones' },
  { slug: 'laptops',            name: 'Laptops' },
  { slug: 'mobile-accessories', name: 'Audio' },
  { slug: 'mens-shirts',        name: 'Fashion' },
  { slug: 'mens-shoes',         name: 'Footwear' },
  { slug: 'beauty',             name: 'Beauty' },
  { slug: 'skin-care',          name: 'Skin Care' },
  { slug: 'fragrances',         name: 'Fragrances' },
  { slug: 'mens-watches',       name: 'Watches' },
  { slug: 'furniture',          name: 'Furniture' },
  { slug: 'groceries',          name: 'Groceries' },
  { slug: 'sports-accessories', name: 'Sports' },
  { slug: 'sunglasses',         name: 'Sunglasses' },
  { slug: 'tablets',            name: 'Tablets' },
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
  'mens-watches': '#d4a847', 'smartphones': '#4f8ef7',
  'laptops': '#a78bfa',      'fragrances': '#f472b6',
  'sunglasses': '#34d399',   'tablets': '#22d3ee',
  'mens-shoes': '#fb923c',   'beauty': '#fb7185',
  'default': '#d4a847',
}

const SORT_OPTIONS = [
  { value: 'default',    label: 'Recommended' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'discount',   label: 'Best Discount' },
]

const PER_PAGE = 20

// ── useIsMobile hook — JS-based, never fails ──────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 720)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 720)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

function useCounter(target, duration = 1400, decimal = false) {
  const [val, setVal]         = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let cur = 0
    const steps = 50, inc = target / steps
    const iv = setInterval(() => {
      cur += inc
      if (cur >= target) { setVal(target); clearInterval(iv) }
      else setVal(decimal ? parseFloat(cur.toFixed(1)) : Math.floor(cur))
    }, duration / steps)
    return () => clearInterval(iv)
  }, [started])
  return [val, () => setStarted(true)]
}

// ── Product image component ───────────────────────────────────────────────
function HeroImage({ active, cur, glow, size }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <AnimatePresence mode="sync">
        <motion.div key={`halo-${active}`}
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{ position: 'absolute', inset: '-25%', borderRadius: '50%',
            background: `radial-gradient(circle, ${glow}40 0%, ${glow}10 40%, transparent 65%)`,
            filter: 'blur(24px)', pointerEvents: 'none' }}
        />
      </AnimatePresence>
      <AnimatePresence mode="sync">
        <motion.div key={`sh-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', bottom: '-4%', left: '15%', right: '15%', height: 24,
            background: `radial-gradient(ellipse, ${glow}65 0%, transparent 70%)`,
            filter: 'blur(12px)', borderRadius: '50%' }}
        />
      </AnimatePresence>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -10, borderRadius: '50%',
          border: `1px solid ${glow}25`, borderTopColor: `${glow}60` }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1px dashed ${glow}18` }} />
      <AnimatePresence mode="wait">
        <motion.img key={`img-${active}`} src={cur.img} alt={cur.name}
          initial={{ opacity: 0, scale: 0.78, y: 20, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1,    y: 0,  filter: 'blur(0px)' }}
          exit={{   opacity: 0, scale: 1.12,  y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8%',
            filter: `drop-shadow(0 24px 48px ${glow}60)`, position: 'relative', zIndex: 2 }}
          onError={e => { e.target.style.opacity = 0 }}
        />
      </AnimatePresence>
    </div>
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────
function LuxuryHero({ items, onCategoryClick, onExplore }) {
  const isMobile            = useIsMobile()
  const [active, setActive] = useState(0)
  const timerRef            = useRef(null)
  const [c1, s1] = useCounter(194)
  const [c2, s2] = useCounter(50)
  const [c3, s3] = useCounter(4.8, 1400, true)
  const countersFired = useRef(false)

  const fireCounters = () => {
    if (countersFired.current) return
    countersFired.current = true
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

  // Fire counters after mount (they're always in view on load)
  useEffect(() => { const t = setTimeout(fireCounters, 800); return () => clearTimeout(t) }, [])

  if (!items.length) return null
  const cur     = items[active]
  const glow    = cur.glow
  const catName = CATEGORIES.find(c => c.slug === cur.category)?.name || 'Collection'

  // ── Shared text content ──
  const textContent = (
    <div>
      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 100, padding: '5px 14px', marginBottom: isMobile ? 14 : 20 }}>
        <motion.span animate={{ scale:[1,1.5,1] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
        <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
          Curated for the Discerning
        </span>
      </div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ margin: `0 0 ${isMobile ? 12 : 20}px`,
          fontSize: isMobile ? 'clamp(34px, 9vw, 48px)' : 'clamp(48px, 5.5vw, 88px)',
          fontWeight: 900, lineHeight: 0.95, letterSpacing: '-2px' }}
      >
        <span style={{ color: '#fff', display: 'block' }}>The New</span>
        <span style={{ color: '#fff', display: 'block' }}>Standard</span>
        <span style={{ display: 'block' }}>
          <span style={{ color: '#fff' }}>of </span>
          <motion.span
            animate={{ backgroundPosition: ['0% 50%','100% 50%','0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'linear-gradient(90deg,#C9A84C,#f5d78e,#C9A84C,#e8a020)',
              backgroundSize: '200% auto', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >Shopping.</motion.span>
        </span>
      </motion.h1>

      {/* Subtitle — desktop only */}
      {!isMobile && (
        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.75, maxWidth: 380, margin: '0 0 32px' }}>
          194+ premium products from the world's finest brands.
          Every item handpicked. Every price unbeatable.
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: isMobile ? 18 : 36 }}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 20px 48px rgba(201,168,76,0.5)' }}
          whileTap={{ scale: 0.95 }} onClick={onExplore}
          style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a',
            border: 'none', borderRadius: 12,
            padding: isMobile ? '11px 22px' : '14px 36px',
            fontSize: isMobile ? 12 : 13, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: '0 8px 28px rgba(201,168,76,0.3)' }}
        >Explore Now →</motion.button>

        <AnimatePresence mode="wait">
          <motion.button key={cur.category}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05, borderColor: '#C9A84C', color: '#C9A84C' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick(cur.category)}
            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
              padding: isMobile ? '11px 18px' : '14px 28px',
              fontSize: isMobile ? 12 : 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
          >Shop {catName} →</motion.button>
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: isMobile ? 22 : 36 }}>
        {[{v:c1,s:'+',l:'Products'},{v:c2,s:'K+',l:'Customers'},{v:c3,s:'★',l:'Rating'}].map(({v,s,l}) => (
          <div key={l}>
            <div style={{ fontSize: isMobile ? 20 : 30, fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>{v}{s}</div>
            <div style={{ fontSize: 9, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#05080f' }}>

      {/* Animated bg glow */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: isMobile
              ? `radial-gradient(ellipse 90% 50% at 50% 20%, ${glow}22 0%, transparent 65%)`
              : `radial-gradient(ellipse 65% 80% at 70% 50%, ${glow}25 0%, transparent 65%)` }}
        />
      </AnimatePresence>

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
        backgroundSize: '36px 36px' }} />

      {isMobile ? (
        /* ── MOBILE: text then image, everything centered ── */
        <div style={{ padding: '36px 24px 0', position: 'relative', zIndex: 2 }}>
          {textContent}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 8 }}>
            <HeroImage active={active} cur={cur} glow={glow} size={200} />
          </div>
        </div>
      ) : (
        /* ── DESKTOP: side by side ── */
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center',
          minHeight: 680, padding: '0 64px', gap: 48, position: 'relative', zIndex: 2 }}>
          <div style={{ flex: '0 0 50%' }}>
            {textContent}
          </div>
          <div style={{ flex: '0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
            <HeroImage active={active} cur={cur} glow={glow} size={400} />
          </div>
        </div>
      )}

      {/* Dots + Pills */}
      <div style={{ position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '14px 24px 20px', marginTop: isMobile ? 16 : 0 }}>
        <div style={{ display: 'flex', gap: 7, marginBottom: 12 }}>
          {items.map((_, i) => (
            <motion.button key={i} onClick={() => go(i)}
              animate={{ width: i === active ? 26 : 7, background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.2)' }}
              transition={{ duration: 0.3 }}
              style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
          {QUICK_CATS.map(cat => (
            <motion.button key={cat.slug}
              whileHover={{ background: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.45)', color: '#C9A84C' }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onCategoryClick(cat.slug)}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                color: '#94a3b8', borderRadius: 100, padding: '8px 18px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}
            >{cat.label}</motion.button>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
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
          name: p.name, category: p.category,
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
        <LuxuryHero items={heroItems} onCategoryClick={handleCategoryClick}
          onExplore={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} />
      )}

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
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: Math.min((i % 6) * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}>
                  <div style={{ width: '100%' }}>
                    <ProductCard id={product._id} name={product.name} price={product.price}
                      image={product.image || product.thumbnail || (product.images && product.images[0])}
                      rating={product.rating} discount={product.discount}
                      originalPrice={product.originalPrice} brand={product.brand}
                      onAddToCart={() => addToCart(product)}
                      onAddToWishlist={() => addToWishlist && addToWishlist(product)} />
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
                    onAddToWishlist={() => addToWishlist && addToWishlist(p)} />
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
