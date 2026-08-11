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

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

const PER_PAGE = 20

// ── Premium Hero Showcase ──────────────────────────────────────────────────
function HeroShowcase({ images, names }) {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(null)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    setPrev(active)
    setActive(idx)
  }

  useEffect(() => {
    if (images.length < 2) return
    timerRef.current = setInterval(() => {
      setActive(a => {
        setPrev(a)
        return (a + 1) % images.length
      })
    }, 2800)
    return () => clearInterval(timerRef.current)
  }, [images.length])

  if (!images.length) return null

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 340, margin: '0 auto' }}>

      {/* Outer glow ring */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -24,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main card */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: 32,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(201,168,76,0.2)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>

        {/* Gold corner accents */}
        {['topLeft','topRight','bottomLeft','bottomRight'].map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            width: 20, height: 20,
            borderColor: 'rgba(201,168,76,0.5)',
            borderStyle: 'solid',
            borderWidth: 0,
            ...(pos === 'topLeft'     && { top: 12, left: 12,  borderTopWidth: 2, borderLeftWidth: 2,  borderRadius: '4px 0 0 0' }),
            ...(pos === 'topRight'    && { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2, borderRadius: '0 4px 0 0' }),
            ...(pos === 'bottomLeft'  && { bottom: 12, left: 12,  borderBottomWidth: 2, borderLeftWidth: 2,  borderRadius: '0 0 0 4px' }),
            ...(pos === 'bottomRight' && { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2, borderRadius: '0 0 4px 0' }),
          }} />
        ))}

        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
            pointerEvents: 'none', zIndex: 3,
          }}
        />

        {/* Image crossfade */}
        <AnimatePresence mode="sync">
          <motion.img
            key={active}
            src={images[active]}
            alt=""
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain',
              padding: 32,
              zIndex: 1,
            }}
          />
        </AnimatePresence>

        {/* Bottom gradient + product name */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 100%)',
          padding: '32px 20px 16px',
          zIndex: 2,
        }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              style={{
                color: '#fff', fontSize: 13, fontWeight: 600,
                margin: 0, letterSpacing: '0.02em',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {names[active]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {images.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{ width: i === active ? 20 : 6, background: i === active ? '#C9A84C' : 'rgba(255,255,255,0.25)' }}
            transition={{ duration: 0.3 }}
            style={{ height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>

      {/* Side mini previews */}
      <div style={{ position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10 }} className="hero-side-previews">
        {images.map((img, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            animate={{ opacity: i === active ? 1 : 0.4, scale: i === active ? 1.1 : 1, borderColor: i === active ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.3 }}
            style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid', padding: 4, cursor: 'pointer' }}
          >
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home({ addToCart, addToWishlist, searchQuery }) {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [category, setCategory]     = useState('')
  const [sort, setSort]             = useState('default')
  const [page, setPage]             = useState(1)
  const [heroImages, setHeroImages] = useState([])
  const [heroNames, setHeroNames]   = useState([])
  const [searchParams]              = useSearchParams()
  const shuffleRef                  = useRef(null)

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

        // Pick 5 premium-looking products for showcase
        const preferred = ['mens-watches', 'smartphones', 'laptops', 'fragrances', 'sunglasses', 'tablets', 'mens-shoes']
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Background grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.05) 1px, transparent 0)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

          {/* Ambient glows */}
          <div style={{ position: 'absolute', top: '-10%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>

            {/* ── Left: Text ── */}
            <div style={{ flex: '1 1 400px', minWidth: 280 }}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}
              >
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
                <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Curated for the Discerning</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 18, fontSize: 'clamp(36px, 5.5vw, 68px)', maxWidth: 580 }}
              >
                <span style={{ color: '#fff' }}>The New Standard<br />of </span>
                <motion.span
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{ background: 'linear-gradient(90deg, #C9A84C, #f5d78e, #e8a020, #C9A84C)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  Shopping.
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                style={{ color: '#64748b', fontSize: 15, lineHeight: 1.75, maxWidth: 380, marginBottom: 36 }}
              >
                194+ premium products from the world's finest brands. Every item handpicked. Every price unbeatable.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.45 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(201,168,76,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: '#C9A84C', color: '#0f172a', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 8px 24px rgba(201,168,76,0.25)', transition: 'all 0.2s' }}
                >
                  Explore Now →
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, borderColor: '#C9A84C', color: '#C9A84C' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategory('smartphones')}
                  style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '14px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Shop Electronics
                </motion.button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                style={{ display: 'flex', gap: 0 }}
              >
                {[
                  { value: '194+', label: 'Products' },
                  { value: '50K+', label: 'Customers' },
                  { value: '4.8★', label: 'Rating' },
                ].map(({ value, label }, i) => (
                  <div key={label} style={{ flex: 1, paddingRight: 24, borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                    <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#C9A84C', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Product Showcase ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ flex: '0 0 auto', width: 'clamp(240px, 35vw, 340px)', paddingRight: 64, position: 'relative' }}
              className="hero-showcase-wrap"
            >
              <HeroShowcase images={heroImages} names={heroNames} />
            </motion.div>
          </div>

          <style>{`
            @media (max-width: 700px) {
              .hero-showcase-wrap { width: clamp(200px, 70vw, 280px) !important; padding-right: 0 !important; margin: 0 auto; }
              .hero-side-previews { display: none !important; }
            }
          `}</style>
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

        {/* Recently Viewed */}
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
