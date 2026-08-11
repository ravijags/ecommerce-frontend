import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import ProductCard from '../ProductCard'
import { getRecentlyViewed } from '../recentlyViewed'
import SkeletonCard from '../components/SkeletonCard'

// Animated counter hook
function useCounter(target, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => {
      let start = 0
      const step = target / (duration / 16)
      const interval = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(interval) }
        else setCount(Math.floor(start))
      }, 16)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [started, target, duration, delay])
  return [count, () => setStarted(true)]
}

// Fixed positions for hero floating cards
const FLOAT_POSITIONS = [
  { x: '75%', y: '8%',  size: 110, delay: 0,   rotate: 8  },
  { x: '82%', y: '52%', size: 90,  delay: 0.4, rotate: -6 },
  { x: '67%', y: '68%', size: 80,  delay: 0.8, rotate: 5  },
]

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

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

const PER_PAGE = 20

export default function Home({ addToCart, addToWishlist, searchQuery }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const [heroImages, setHeroImages] = useState([])   // ← images for floating cards
  const [searchParams] = useSearchParams()
  const shuffleRef = useRef(null)

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('category') || ''
    setCategory(cat)
    if (cat) setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [searchParams])

  // Fetch all products once — then pick 3 with good images for hero
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
      .then(r => r.json())
      .then(d => {
        const all = d.products || []
        setProducts(all)
        setLoading(false)

        // Pick 3 products that have real image URLs for the hero floating cards
        // Prefer premium-looking categories
        const preferred = ['mens-watches', 'smartphones', 'laptops', 'fragrances', 'sunglasses', 'tablets']
        const pool = all.filter(p => {
          const img = p.image || p.thumbnail || (p.images && p.images[0])
          return img && img.startsWith('http') && preferred.includes(p.category)
        })
        // Shuffle pool, take first 3
        const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
        setHeroImages(picked.map(p => p.image || p.thumbnail || p.images?.[0]))
      })
      .catch(() => setLoading(false))
  }, [])

  // Shuffle once
  if (products.length > 0 && !shuffleRef.current) {
    shuffleRef.current = [...products].sort(() => Math.random() - 0.5)
  }
  const base = shuffleRef.current || products

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [category, searchQuery, sort])

  // Filter + sort
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

  // Loading screen
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

      {/* ── HERO ── only when browsing all */}
      {!searchQuery && !category && (
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)', position: 'relative', overflow: 'hidden', minHeight: 420 }}>

          {/* Animated background grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.06) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

          {/* Glowing orb */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '20%', right: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}
          />

          {/* ── Floating product images — desktop only, uses real backend images ── */}
          {heroImages.length > 0 && FLOAT_POSITIONS.map((pos, i) => {
            const imgSrc = heroImages[i]
            if (!imgSrc) return null
            return (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.8, rotate: pos.rotate }}
                animate={{ opacity: 1, scale: 1, rotate: pos.rotate, y: [0, -12, 0] }}
                transition={{
                  opacity: { delay: pos.delay + 0.5, duration: 0.6 },
                  scale:   { delay: pos.delay + 0.5, duration: 0.6 },
                  y:       { delay: pos.delay + 1, duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  width: pos.size,
                  height: pos.size,
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: 10,
                  display: 'none',           // hidden on mobile
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
                className="hero-float"
              >
                <img
                  src={imgSrc}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }}
                  onError={e => { e.target.parentElement.style.display = 'none' }}  // hide card if img still fails
                />
              </motion.div>
            )
          })}

          {/* Text content */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 72px', position: 'relative', zIndex: 2 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
                <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  Curated for the Discerning
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 20, fontSize: 'clamp(32px, 6vw, 72px)', maxWidth: 640 }}>
                <span style={{ color: '#fff' }}>The New Standard<br />of </span>
                <motion.span
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: 'linear-gradient(90deg, #C9A84C, #f5d78e, #C9A84C, #e8a020)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  Shopping.
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
                194+ premium products from the world's finest brands. Every item handpicked. Every price unbeatable.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: '#C9A84C', color: '#0f172a', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 24px rgba(201,168,76,0.3)' }}>
                  Explore Now →
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, borderColor: '#C9A84C', color: '#C9A84C' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategory('smartphones')}
                  style={{ background: 'transparent', color: '#64748b', border: '1px solid #334155', borderRadius: 14, padding: '14px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  Shop Electronics
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { value: '194+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '4.8★', label: 'Rating' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </motion.div>

            </motion.div>
          </div>

          <style>{`
            @media (min-width: 900px) { .hero-float { display: block !important; } }
          `}</style>
        </div>
      )}

      {/* ── PRODUCTS SECTION ── */}
      <div id="products-section" style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 12px 32px' }}>

        {/* Row: title + sort */}
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

        {/* Active category chip */}
        {category && (
          <div style={{ marginBottom: 14 }}>
            <button
              onClick={() => setCategory('')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
            >
              {activeLabel} <span style={{ fontSize: 13 }}>×</span>
            </button>
          </div>
        )}

        {/* Empty state */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
            <p style={{ color: '#0f172a', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No products found</p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>Try a different search or category</p>
            <button onClick={() => { setCategory('') }} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
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
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  Load More · {sorted.length - paginated.length} remaining
                </button>
              </div>
            )}
          </>
        )}

        {/* Recently Viewed */}
        {!searchQuery && !category && (() => {
          const recent = getRecentlyViewed()
          if (!recent.length) return null
          return (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recently Viewed</h2>
              </div>
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
