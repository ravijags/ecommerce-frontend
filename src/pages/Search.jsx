import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductCard from '../ProductCard'
import SkeletonCard from '../components/SkeletonCard'

const SEARCH_SORT_OPTIONS = [
  { value: 'default',    label: 'Relevance' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'discount',   label: 'Best Discount' },
]

export default function Search({ addToCart, addToWishlist, removeFromWishlist, cartItemIds, wishlistIds }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [sort, setSort]         = useState('default')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
      .then(r => r.json())
      .then(data => {
        const q = query.toLowerCase()
        const filtered = (data.products || []).filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        )
        setProducts(filtered)
        setLoading(false)
        document.title = `"${query}" — Search — PREMIA`
      })
      .catch(() => setLoading(false))
  }, [query])

  const sorted = [...products]
    .filter(p => {
      if (priceRange.min && p.price < Number(priceRange.min)) return false
      if (priceRange.max && p.price > Number(priceRange.max)) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-low')  return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      if (sort === 'rating')     return (b.rating || 0) - (a.rating || 0)
      if (sort === 'discount')   return (b.discount || 0) - (a.discount || 0)
      return 0
    })

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 80px', fontFamily: 'Inter, sans-serif' }}>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <SearchIcon size={18} color="#94a3b8" />
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Results for "{query}"
          </h1>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          {loading ? 'Searching...' : `${sorted.length} products found`}
        </p>
      </div>

      {/* Filters + Sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setShowFilters(!showFilters)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
          borderRadius: 10, border: '1px solid #e2e8f0',
          background: showFilters ? '#0f172a' : '#fff',
          color: showFilters ? '#fff' : '#0f172a',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <SlidersHorizontal size={14} /> Filters
        </button>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{
          padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
          fontSize: 13, color: '#0f172a', background: '#fff', cursor: 'pointer', outline: 'none',
        }}>
          {SEARCH_SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {(priceRange.min || priceRange.max) && (
          <button onClick={() => setPriceRange({ min: '', max: '' })} style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '9px 14px',
            borderRadius: 10, border: '1px solid #C9A84C', background: '#fef9ec',
            color: '#92400e', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            ₹{priceRange.min || '0'} – ₹{priceRange.max || '∞'} <X size={12} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Price (₹)</label>
            <input type="number" placeholder="0" value={priceRange.min}
              onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, width: 120, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Price (₹)</label>
            <input type="number" placeholder="Any" value={priceRange.max}
              onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
              style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, width: 120, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <button onClick={() => setShowFilters(false)} style={{ padding: '9px 16px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Apply
          </button>
        </motion.div>
      )}

      {/* Results */}
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No results for "{query}"</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Try different keywords or browse our categories</p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {sorted.map((product, i) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <ProductCard
                id={product._id} name={product.name} price={product.price}
                image={product.image || product.thumbnail || product.images?.[0]}
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
      )}
    </main>
  )
}
