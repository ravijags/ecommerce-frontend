import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../ProductCard'

const categories = [
  { slug: '', name: 'All' },
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'mobile-accessories', name: 'Audio' },
  { slug: 'mens-shoes', name: "Men's Shoes" },
  { slug: 'womens-shoes', name: "Women's Shoes" },
  { slug: 'beauty', name: 'Beauty' },
  { slug: 'mens-watches', name: 'Watches' },
  { slug: 'fragrances', name: 'Fragrances' },
  { slug: 'skin-care', name: 'Skin Care' },
  { slug: 'groceries', name: 'Grocery' },
  { slug: 'sports-accessories', name: 'Sports' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'sunglasses', name: 'Sunglasses' },
  { slug: 'womens-dresses', name: 'Dresses' },
  { slug: 'mens-shirts', name: "Men's Fashion" },
  { slug: 'tablets', name: 'Tablets' },
  { slug: 'kitchen-accessories', name: 'Kitchen' },
]

const sortOptions = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
]

function Home({ addToCart, searchQuery }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState('')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) { setCategory(cat); setTimeout(() => window.scrollTo({ top: 380, behavior: 'smooth' }), 100) }
  }, [searchParams])
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const PER_PAGE = 20
  const shuffleRef = useRef(null)

  if (products.length > 0 && !shuffleRef.current) {
    shuffleRef.current = [...products].sort(() => Math.random() - 0.5)
  }

  const shuffledProducts = shuffleRef.current || products

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
  }, [])

  useEffect(() => { setPage(1) }, [category, searchQuery, sort])

  const filtered = shuffledProducts.filter(p => {
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', gap: 12
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #C9A84C',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Loading PREMIA...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* HERO */}
      {!searchQuery && !category && (
        <div style={{ backgroundColor: '#0f172a', padding: '64px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p style={{
                color: '#C9A84C', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16
              }}>
                Curated for the Discerning
              </p>
              <h1 style={{
                color: '#fff', fontWeight: 900, lineHeight: 1.02,
                letterSpacing: '-2px', marginBottom: 20,
                fontSize: 'clamp(32px, 5vw, 60px)'
              }}>
                The New Standard<br />
                <span style={{ color: '#C9A84C' }}>of Shopping.</span>
              </h1>
              <p style={{
                color: '#475569', fontSize: 15, lineHeight: 1.7,
                maxWidth: 400, marginBottom: 32
              }}>
                194+ premium products from top brands worldwide.
                Every item handpicked. Every price unbeatable.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    backgroundColor: '#C9A84C', color: '#0f172a',
                    border: 'none', borderRadius: 12, padding: '12px 28px',
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer'
                  }}
                >
                  Explore Now
                </button>
                <button
                  onClick={() => setCategory('smartphones')}
                  style={{
                    backgroundColor: 'transparent', color: '#64748b',
                    border: '1px solid #1e293b', borderRadius: 12,
                    padding: '12px 28px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Shop Electronics
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* CATEGORY STRIP */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky',
        top: 128,
        zIndex: 40,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setCategory(cat.slug)}
                style={{
                  flexShrink: 0,
                  padding: '14px 16px',
                  fontSize: 12,
                  fontWeight: category === cat.slug ? 700 : 500,
                  color: category === cat.slug ? '#0f172a' : '#94a3b8',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: category === cat.slug ? '2px solid #C9A84C' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div
        id="products-section"
        style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}
      >

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 24
        }}>
          <h2 style={{
            color: '#0f172a', fontSize: 18,
            fontWeight: 800, letterSpacing: '-0.3px'
          }}>
            {searchQuery
              ? `"${searchQuery}"`
              : category
                ? categories.find(c => c.slug === category)?.name
                : 'All Products'
            }
            <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              ({sorted.length})
            </span>
          </h2>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: 12,
              padding: '8px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Empty */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <p style={{ color: '#0f172a', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              No products found
            </p>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>
              Try a different search or category
            </p>
            <button
              onClick={() => setCategory('')}
              style={{
                backgroundColor: '#0f172a', color: '#fff',
                border: 'none', borderRadius: 12,
                padding: '12px 24px', fontSize: 13,
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {paginated.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.025, 0.25) }}
                  style={{ display: 'flex' }}
                >
                  <div style={{ width: '100%' }}>
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      rating={product.rating}
                      discount={product.discount}
                      originalPrice={product.originalPrice}
                      brand={product.brand}
                      onAddToCart={() => addToCart(product)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    backgroundColor: '#0f172a', color: '#fff',
                    border: 'none', borderRadius: 12,
                    padding: '12px 32px', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.05em'
                  }}
                >
                  Load More · {sorted.length - paginated.length} remaining
                </button>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  )
}

export default Home