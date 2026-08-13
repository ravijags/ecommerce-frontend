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

// ── Hero Image ────────────────────────────────────────────────────────────
function HeroImage({ active, cur, glow, size }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Strong outer halo */}
      <AnimatePresence mode="sync">
        <motion.div key={`halo-${active}`}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', inset: '-40%', borderRadius: '50%',
            background: `radial-gradient(circle, ${glow}60 0%, ${glow}22 35%, transparent 65%)`,
            filter: 'blur(30px)', pointerEvents: 'none' }}
        />
      </AnimatePresence>
      {/* Floor shadow */}
      <AnimatePresence mode="sync">
        <motion.div key={`sh-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', bottom: '-8%', left: '5%', right: '5%', height: 36,
            background: `radial-gradient(ellipse, ${glow}85 0%, transparent 70%)`,
            filter: 'blur(18px)', borderRadius: '50%' }}
        />
      </AnimatePresence>
      {/* Outer ring — clearly visible */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -14, borderRadius: '50%',
          border: `2px solid transparent`,
          borderTopColor: `${glow}90`,
          borderRightColor: `${glow}40`,
          borderBottomColor: `${glow}15`,
          borderLeftColor: `${glow}40`,
        }} />
      {/* Inner dashed ring */}
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -4, borderRadius: '50%',
          border: `1px dashed ${glow}40` }} />
      {/* Product image */}
      <AnimatePresence mode="wait">
        <motion.img key={`img-${active}`} src={cur.img} alt={cur.name}
          initial={{ opacity: 0, scale: 0.78, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1,    y: 0,  filter: 'blur(0px)' }}
          exit={{   opacity: 0, scale: 1.12,  y: -24, filter: 'blur(10px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5%',
            filter: `drop-shadow(0 28px 56px ${glow}80)`, position: 'relative', zIndex: 2 }}
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

  useEffect(() => { const t = setTimeout(fireCounters, 600); return () => clearTimeout(t) }, [])

  if (!items.length) return null
  const cur     = items[active]
  const glow    = cur.glow
  const catName = CATEGORIES.find(c => c.slug === cur.category)?.name || 'Collection'

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#04060f' }}>

      {/* Strong multi-layer color-shifting background */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${active}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.6 }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: isMobile
              ? `radial-gradient(ellipse 130% 70% at 70% 0%, ${glow}35 0%, transparent 60%),
                 radial-gradient(ellipse 80% 50% at 20% 80%, ${glow}10 0%, transparent 55%)`
              : `radial-gradient(ellipse 55% 100% at 78% 50%, ${glow}40 0%, transparent 58%),
                 radial-gradient(ellipse 35% 55% at 15% 25%, ${glow}14 0%, transparent 55%),
                 radial-gradient(ellipse 60% 40% at 50% 100%, ${glow}10 0%, transparent 60%)`
          }}
        />
      </AnimatePresence>

      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.018) 1px, transparent 0)',
        backgroundSize: '32px 32px' }} />

      {isMobile ? (
        /* ── MOBILE: balanced side-by-side ── */
        <div style={{ position: 'relative', zIndex: 2, padding: '22px 18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

            {/* Left: text — takes 55% */}
            <div style={{ flex: '0 0 55%', minWidth: 0 }}>
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 100, padding: '3px 10px', marginBottom: 10 }}>
                <motion.span animate={{ scale:[1,1.5,1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
                <span style={{ color: '#C9A84C', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Premium</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{ margin: '0 0 6px', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-1.5px',
                  fontSize: 'clamp(22px, 6.5vw, 32px)' }}>
                <span style={{ color: '#fff' }}>New Standard<br />of </span>
                <motion.span animate={{ backgroundPosition: ['0% 50%','100% 50%','0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ background: 'linear-gradient(90deg,#C9A84C,#f5d78e,#e8a020,#C9A84C)',
                    backgroundSize: '200% auto', WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Shopping.
                </motion.span>
              </motion.h1>

              <AnimatePresence mode="wait">
                <motion.p key={`mn-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, margin: '0 0 14px',
                    fontWeight: 500, letterSpacing: '0.04em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cur.name}
                </motion.p>
              </AnimatePresence>

              <motion.button whileTap={{ scale: 0.95 }} onClick={onExplore}
                style={{ background: 'linear-gradient(135deg,#C9A84C,#e8b84b)',
                  color: '#0f172a', border: 'none', borderRadius: 10,
                  padding: '10px 20px', fontSize: 12, fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.5)', whiteSpace: 'nowrap' }}>
                Explore →
              </motion.button>
            </div>

            {/* Right: image — takes 45% */}
            <div style={{ flex: '0 0 45%', display: 'flex', justifyContent: 'center' }}>
              <HeroImage active={active} cur={cur} glow={glow} size={Math.min(window.innerWidth * 0.4, 170)} />
            </div>
          </div>

          {/* Dots — bigger tap targets */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, paddingLeft: 2 }}>
            {items.map((_, i) => (
              <motion.button key={i} onClick={() => go(i)}
                animate={{ width: i === active ? 22 : 7, background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.25)' }}
                transition={{ duration: 0.3 }}
                style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
                  minWidth: 7 }} />
            ))}
          </div>
        </div>
      ) : (
        /* ── DESKTOP: magazine split ── */
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center',
          minHeight: 580, padding: '0 80px', gap: 0, position: 'relative', zIndex: 2 }}>

          {/* LEFT: Text — 50% */}
          <div style={{ flex: '0 0 50%', paddingRight: 48 }}>
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.22)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
              <motion.span animate={{ scale:[1,1.5,1] }} transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
              <span style={{ color: '#C9A84C', fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                Curated for the Discerning
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ margin: '0 0 20px', fontWeight: 900, lineHeight: 0.92,
                letterSpacing: '-3px', fontSize: 'clamp(48px, 5.5vw, 84px)' }}>
              <span style={{ color: '#fff', display: 'block' }}>The New</span>
              <span style={{ color: '#fff', display: 'block' }}>Standard of</span>
              <motion.span
                animate={{ backgroundPosition: ['0% 50%','100% 50%','0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'block',
                  background: 'linear-gradient(90deg,#C9A84C,#f5d78e,#e8a020,#C9A84C)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Shopping.
              </motion.span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
              style={{ color: '#64748b', fontSize: 15, lineHeight: 1.75, maxWidth: 400, margin: '0 0 32px' }}>
              194+ premium products from the world's finest brands.
              Every item handpicked. Every price unbeatable.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.45 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 24px 56px rgba(201,168,76,0.65)' }}
                whileTap={{ scale: 0.95 }} onClick={onExplore}
                style={{ background: 'linear-gradient(135deg,#C9A84C 0%,#e8b84b 100%)',
                  color: '#0f172a', border: 'none', borderRadius: 14,
                  padding: '15px 40px', fontSize: 13, fontWeight: 800,
                  letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(201,168,76,0.5), 0 0 0 1px rgba(201,168,76,0.25)',
                  transition: 'all 0.2s' }}>
                Explore Now →
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.button key={cur.category}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.04, borderColor: '#C9A84C', color: '#C9A84C' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryClick(cur.category)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
                    padding: '15px 30px', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}>
                  Shop {catName} →
                </motion.button>
              </AnimatePresence>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }}
              style={{ display: 'flex', gap: 0 }}>
              {[{v:c1,s:'+',l:'Products'},{v:c2,s:'K+',l:'Customers'},{v:c3,s:'★',l:'Rating'}].map(({v,s,l},i) => (
                <div key={l} style={{ flex: 1,
                  paddingRight: i < 2 ? 28 : 0, paddingLeft: i > 0 ? 28 : 0,
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <div style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>{v}{s}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Image — 50%, perfectly centered */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: '0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
            <HeroImage active={active} cur={cur} glow={glow} size={460} />
          </motion.div>
        </div>
      )}

      {/* Desktop bottom strip */}
      {!isMobile && (
        <div style={{ position: 'relative', zIndex: 2,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '14px 80px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {items.map((_, i) => (
              <motion.button key={i} onClick={() => go(i)}
                animate={{ width: i === active ? 24 : 7, background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.22)' }}
                transition={{ duration: 0.3 }}
                style={{ height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {QUICK_CATS.map(cat => (
              <motion.button key={cat.slug}
                whileHover={{ background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.5)', color: '#C9A84C', scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(cat.slug)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                  color: '#94a3b8', borderRadius: 100, padding: '7px 18px',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s' }}>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Fade to page */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
        background: 'linear-gradient(to top, #fafafa, transparent)', pointerEvents: 'none', zIndex: 3 }} />
    </div>
  )
}

// ── Custom sort dropdown ───────────────────────────────────────────────────
function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const current = SORT_OPTIONS.find(o => o.value === value)
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8,
          padding: 'clamp(8px,1.5vw,10px) clamp(12px,2vw,16px)',
          background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10,
          fontSize: 'clamp(11px,1.5vw,13px)', fontWeight: 600, color: '#0f172a', cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'border-color 0.2s',
          minHeight: 40 }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
        {current?.label}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
              style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff',
                border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', zIndex: 11,
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)', minWidth: 190 }}>
              {SORT_OPTIONS.map(o => (
                <button key={o.value} onClick={() => { onChange(o.value); setOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                    padding: '12px 18px', border: 'none',
                    background: o.value === value ? '#fef9ec' : '#fff',
                    fontSize: 13, color: o.value === value ? '#C9A84C' : '#0f172a',
                    fontWeight: o.value === value ? 700 : 500, cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = '#fff' }}>
                  {o.value === value
                    ? <span style={{ color: '#C9A84C', fontSize: 12 }}>✓</span>
                    : <span style={{ width: 12, display: 'inline-block' }} />}
                  {o.label}
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
    <div style={{ background: '#fafafa', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ width: 160, height: 28, borderRadius: 8, background: '#e2e8f0', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
          <div style={{ width: 130, height: 40, borderRadius: 10, background: '#e2e8f0', animation: 'skeletonPulse 1.4s ease-in-out infinite' }} />
        </div>
        <div className="product-grid">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }} className="mobile-page-padding">

      {!searchQuery && !category && (
        <LuxuryHero items={heroItems} onCategoryClick={handleCategoryClick}
          onExplore={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} />
      )}

      {/* ── PRODUCTS SECTION ── */}
      <div id="products-section" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 16px 56px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, gap: 12 }}>
          <div>
            <h2 style={{ color: '#0f172a', fontWeight: 900, letterSpacing: '-0.5px', margin: 0, lineHeight: 1,
              fontSize: 'clamp(17px, 3.5vw, 22px)' }}>
              {searchQuery ? `"${searchQuery}"` : activeLabel}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, margin: '5px 0 0' }}>
              {sorted.length} products available
            </p>
          </div>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        {category && (
          <div style={{ marginBottom: 18 }}>
            <button onClick={() => setCategory('')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20,
                fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {activeLabel} <span style={{ opacity: 0.6, fontSize: 15 }}>×</span>
            </button>
          </div>
        )}

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ fontSize: 52, marginBottom: 16 }}>🔍</p>
            <p style={{ color: '#0f172a', fontSize: 20, fontWeight: 900, marginBottom: 8 }}>No products found</p>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32 }}>Try a different search or browse categories</p>
            <button onClick={() => setCategory('')}
              style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12,
                padding: '13px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 64 }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(15,23,42,0.18)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPage(p => p + 1)}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 14,
                    padding: '14px 44px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(15,23,42,0.12)',
                    display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  Load More
                  <span style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20,
                    padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
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
            <div style={{ marginTop: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #e2e8f0)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                    Recently Viewed
                  </span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C' }} />
                </div>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #e2e8f0)' }} />
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
