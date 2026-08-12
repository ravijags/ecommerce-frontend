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

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

// ── Product image ─────────────────────────────────────────────────────────
function HeroImage({ active, cur, glow, size }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <AnimatePresence mode="sync">
        <motion.div key={`halo-${active}`}
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{ position: 'absolute', inset: '-30%', borderRadius: '50%',
            background: `radial-gradient(circle, ${glow}45 0%, ${glow}12 40%, transparent 65%)`,
            filter: 'blur(28px)', pointerEvents: 'none' }}
        />
      </AnimatePresence>
      <AnimatePresence mode="sync">
        <motion.div key={`sh-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', bottom: '-5%', left: '10%', right: '10%', height: 32,
            background: `radial-gradient(ellipse, ${glow}70 0%, transparent 70%)`,
            filter: 'blur(16px)', borderRadius: '50%' }}
        />
      </AnimatePresence>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -14, borderRadius: '50%',
          border: `1.5px solid ${glow}35`, borderTopColor: `${glow}70` }} />
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -5, borderRadius: '50%',
          border: `1px dashed ${glow}25` }} />
      <AnimatePresence mode="wait">
        <motion.img key={`img-${active}`} src={cur.img} alt={cur.name}
          initial={{ opacity: 0, scale: 0.78, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1,    y: 0,  filter: 'blur(0px)' }}
          exit={{   opacity: 0, scale: 1.12,  y: -24, filter: 'blur(10px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8%',
            filter: `drop-shadow(0 28px 56px ${glow}65)`, position: 'relative', zIndex: 2 }}
          onError={e => { e.target.style.opacity = 0 }}
        />
      </AnimatePresence>
    </div>
  )
}

// ── LUXURY HERO ───────────────────────────────────────────────────────────
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
    countersFired.current = true; s1(); s2(); s3()
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

  useEffect(() => { const t = setTimeout(fireCounters, 800); return () => clearTimeout(t) }, [])

  if (!items.length) return null
  const cur     = items[active]
  const glow    = cur.glow
  const catName = CATEGORIES.find(c => c.slug === cur.category)?.name || 'Collection'

  // ── Shared desktop text ──
  const desktopText = (
    <div>
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
        <motion.span animate={{ scale:[1,1.5,1] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
        <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
          Curated for the Discerning
        </span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ margin: '0 0 16px', fontSize: 'clamp(42px, 5.5vw, 80px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-3px' }}>
        <span style={{ color: '#fff', display: 'block' }}>The New</span>
        <span style={{ color: '#fff', display: 'block' }}>Standard</span>
        <span style={{ display: 'block' }}>
          <span style={{ color: '#fff' }}>of </span>
          <motion.span animate={{ backgroundPosition: ['0% 50%','100% 50%','0% 50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'linear-gradient(90deg,#C9A84C,#f5d78e,#C9A84C,#e8a020)', backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Shopping.
          </motion.span>
        </span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
        style={{ color: '#64748b', fontSize: 15, lineHeight: 1.75, maxWidth: 380, margin: '0 0 28px' }}>
        194+ premium products from the world's finest brands. Every item handpicked. Every price unbeatable.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.45 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
        {/* Primary CTA */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 20px 48px rgba(201,168,76,0.55)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore}
          style={{
            background: 'linear-gradient(135deg,#C9A84C 0%,#e8b84b 100%)',
            color: '#0f172a', border: 'none', borderRadius: 14,
            padding: '14px 36px', fontSize: 13, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(201,168,76,0.4), 0 0 0 1px rgba(201,168,76,0.2)',
            transition: 'all 0.2s',
          }}>
          Explore Now →
        </motion.button>

        {/* Dynamic secondary CTA */}
        <AnimatePresence mode="wait">
          <motion.button key={cur.category}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.04, borderColor: '#C9A84C', color: '#C9A84C' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick(cur.category)}
            style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
              padding: '14px 28px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}>
            Shop {catName} →
          </motion.button>
        </AnimatePresence>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }}
        style={{ display: 'flex', gap: 0 }}>
        {[{v:c1,s:'+',l:'Products'},{v:c2,s:'K+',l:'Customers'},{v:c3,s:'★',l:'Rating'}].map(({v,s,l},i) => (
          <div key={l} style={{
            flex: 1,
            paddingRight: i < 2 ? 24 : 0,
            paddingLeft: i > 0 ? 24 : 0,
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>{v}{s}</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#05080f' }}>

      {/* Color-shifting bg */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: isMobile
              ? `radial-gradient(ellipse 90% 50% at 50% 0%, ${glow}22 0%, transparent 65%)`
              : `radial-gradient(ellipse 60% 90% at 72% 50%, ${glow}28 0%, transparent 65%),
                 radial-gradient(ellipse 40% 60% at 20% 30%, ${glow}08 0%, transparent 60%)` }}
        />
      </AnimatePresence>

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
        backgroundSize: '40px 40px' }} />

      {isMobile ? (
        /* ── MOBILE: compact side-by-side ── */
        <div style={{ position: 'relative', zIndex: 2, padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 100, padding: '3px 10px', marginBottom: 10 }}>
              <motion.span animate={{ scale:[1,1.5,1] }} transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
              <span style={{ color: '#C9A84C', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Premium</span>
            </div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ margin: '0 0 6px', fontSize: 'clamp(24px, 6.5vw, 34px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-1.5px' }}>
              <span style={{ color: '#fff' }}>New Standard</span><br />
              <motion.span animate={{ backgroundPosition: ['0% 50%','100% 50%','0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ background: 'linear-gradient(90deg,#C9A84C,#f5d78e,#C9A84C)', backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                of Shopping.
              </motion.span>
            </motion.h1>
            <AnimatePresence mode="wait">
              <motion.p key={`mn-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, margin: '0 0 12px',
                  fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cur.name}
              </motion.p>
            </AnimatePresence>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onExplore}
              style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)', color: '#0f172a', border: 'none',
                borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(201,168,76,0.4)' }}>
              Explore Now →
            </motion.button>
          </div>
          <div style={{ flexShrink: 0 }}>
            <HeroImage active={active} cur={cur} glow={glow} size={175} />
          </div>
        </div>
      ) : (
        /* ── DESKTOP: magazine split ── */
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center',
          minHeight: 620, padding: '0 64px', gap: 48, position: 'relative', zIndex: 2 }}>
          <div style={{ flex: '0 0 50%' }}>{desktopText}</div>
          <div style={{ flex: '0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
            <HeroImage active={active} cur={cur} glow={glow} size={420} />
          </div>
        </div>
      )}

      {/* Desktop bottom strip: dots + category pills */}
      {!isMobile && (
        <div style={{ position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 64px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {items.map((_, i) => (
              <motion.button key={i} onClick={() => go(i)}
                animate={{ width: i === active ? 24 : 6, background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.3 }}
                style={{ height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8 }}>
            {QUICK_CATS.map(cat => (
              <motion.button key={cat.slug}
                whileHover={{ background: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(cat.slug)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#64748b', borderRadius: 100, padding: '7px 18px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Fade to page */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
        background: 'linear-gradient(to top, #fff, transparent)', pointerEvents: 'none', zIndex: 3 }} />
    </div>
  )
}

// ── SORT DROPDOWN — custom styled ────────────────────────────────────────
function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const current = SORT_OPTIONS.find(o => o.value === value)
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
          fontSize: 12, fontWeight: 600, color: '#0f172a', cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        {current?.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff',
                border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', zIndex: 11,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)', minWidth: 180 }}>
              {SORT_OPTIONS.map(o => (
                <button key={o.value} onClick={() => { onChange(o.value); setOpen(false) }}
                  style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none',
                    background: o.value === value ? '#f8fafc' : '#fff', fontSize: 13,
                    color: o.value === value ? '#C9A84C' : '#0f172a', fontWeight: o.value === value ? 700 : 500,
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = '#fff' }}>
                  {o.value === value && '✓ '}{o.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home({ addToCart, addToWishlist, removeFromWishlist, cartItemIds, wishlistIds, searchQuery }) {
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
    <div style={{ background: '#fff', minHeight: '100vh', padding: '20px 12px' }}>
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
    <div style={{ background: '#fff', minHeight: '100vh' }} className="mobile-page-padding">

      {!searchQuery && !category && (
        <LuxuryHero items={heroItems} onCategoryClick={handleCategoryClick}
          onExplore={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} />
      )}

      {/* ── PRODUCTS SECTION ── */}
      <div id="products-section" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 16px 40px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
          <div>
            <h2 style={{ color: '#0f172a', fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', margin: 0, lineHeight: 1 }}>
              {searchQuery ? `"${searchQuery}"` : activeLabel}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, margin: '4px 0 0' }}>
              {sorted.length} products
            </p>
          </div>

          {/* Custom sort dropdown */}
          <SortSelect value={sort} onChange={setSort} />
        </div>

        {/* Active category chip */}
        {category && (
          <div style={{ marginBottom: 16 }}>
            <button onClick={() => setCategory('')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20,
                fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {activeLabel} <span style={{ fontSize: 14, opacity: 0.7 }}>×</span>
            </button>
          </div>
        )}

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <p style={{ color: '#0f172a', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No products found</p>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 28 }}>Try a different search or category</p>
            <button onClick={() => setCategory('')}
              style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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
                  <ProductCard
                    id={product._id} name={product.name} price={product.price}
                    image={product.image || product.thumbnail || (product.images && product.images[0])}
                    rating={product.rating} discount={product.discount}
                    originalPrice={product.originalPrice} brand={product.brand}
                    onAddToCart={() => addToCart(product)}
                    onAddToWishlist={() => addToWishlist && addToWishlist(product)}
                    onRemoveFromWishlist={removeFromWishlist}
                    isInCart={cartItemIds?.has(product._id) || false}
                    isWishlisted={wishlistIds?.has(product._id) || false}
                  />
                </motion.div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(15,23,42,0.15)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPage(p => p + 1)}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 14,
                    padding: '14px 40px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(15,23,42,0.1)',
                    display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  Load More
                  <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '2px 10px', fontSize: 11 }}>
                    {sorted.length - paginated.length} left
                  </span>
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* Recently Viewed */}
        {!searchQuery && !category && (() => {
          const recent = getRecentlyViewed()
          if (!recent.length) return null
          return (
            <div style={{ marginTop: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
                <h2 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0, whiteSpace: 'nowrap' }}>
                  Recently Viewed
                </h2>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
              </div>
              <div className="product-grid">
                {recent.map(p => (
                  <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
                    image={p.image} rating={p.rating} discount={p.discount}
                    originalPrice={p.originalPrice} brand={p.brand}
                    onAddToCart={() => addToCart(p)}
                    onAddToWishlist={() => addToWishlist && addToWishlist(p)}
                    onRemoveFromWishlist={removeFromWishlist}
                    isInCart={cartItemIds?.has(p._id) || false}
                    isWishlisted={wishlistIds?.has(p._id) || false}
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
