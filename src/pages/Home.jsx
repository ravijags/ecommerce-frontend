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
    if (cat) { setCategory(cat); window.scrollTo(0, 400) }
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

  useEffect(() => {
    setPage(1)
  }, [category, searchQuery, sort])

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
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-white gap-3">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
        />
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#C9A84C' }}>
          Loading PREMIA...
        </p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* HERO */}
      {!searchQuery && !category && (
        <section style={{ backgroundColor: '#0f172a' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="font-bold tracking-[0.3em] uppercase mb-4"
                style={{ color: '#C9A84C', fontSize: 11 }}
              >
                Curated for the Discerning
              </p>
              <h1
                className="font-black text-white mb-5"
                style={{
                  fontSize: 'clamp(34px, 5vw, 62px)',
                  letterSpacing: '-2px',
                  lineHeight: 1.02
                }}
              >
                The New Standard<br />
                <span style={{ color: '#C9A84C' }}>of Shopping.</span>
              </h1>
              <p
                className="mb-8 leading-relaxed"
                style={{ color: '#475569', fontSize: 15, maxWidth: 420 }}
              >
                194+ premium products from top brands worldwide.
                Every item handpicked. Every price unbeatable.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3 rounded-xl font-bold uppercase cursor-pointer"
                  style={{ backgroundColor: '#C9A84C', color: '#0f172a', fontSize: 12, letterSpacing: '0.08em', border: 'none' }}
                  whileHover={{ opacity: 0.88 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Now
                </motion.button>
                <motion.button
                  onClick={() => setCategory('smartphones')}
                  className="px-7 py-3 rounded-xl font-semibold cursor-pointer"
                  style={{ border: '1px solid #1e293b', color: '#64748b', fontSize: 12, backgroundColor: 'transparent' }}
                  whileHover={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Shop Electronics
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CATEGORY STRIP */}
      <div
        className="bg-white sticky z-40"
        style={{ top: '130px', borderBottom: '1px solid #f1f5f9' }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setCategory(cat.slug)}
                className="flex-shrink-0 px-4 py-3.5 font-medium transition-all cursor-pointer whitespace-nowrap"
                style={{
                  fontSize: 12,
                  color: category === cat.slug ? '#0f172a' : '#94a3b8',
                  fontWeight: category === cat.slug ? 700 : 500,
                  borderBottom: category === cat.slug ? '2px solid #C9A84C' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: category === cat.slug ? '2px solid #C9A84C' : '2px solid transparent',
                  outline: 'none'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black" style={{ color: '#0f172a', fontSize: 18, letterSpacing: '-0.3px' }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : category
                  ? categories.find(c => c.slug === category)?.name || category
                  : 'All Products'
              }
              <span className="font-normal ml-2" style={{ color: '#94a3b8', fontSize: 14 }}>
                ({sorted.length})
              </span>
            </h2>
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="cursor-pointer focus:outline-none"
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: 12,
              padding: '8px 12px',
              borderRadius: 10
            }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Empty state */}
        {sorted.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontSize: 48 }} className="mb-4">🔍</p>
            <p className="font-bold mb-2" style={{ color: '#0f172a', fontSize: 18 }}>
              No products found
            </p>
            <p className="mb-6" style={{ color: '#94a3b8', fontSize: 14 }}>
              Try a different search or category
            </p>
            <button
              onClick={() => setCategory('')}
              className="px-6 py-3 rounded-xl font-semibold text-white cursor-pointer"
              style={{ backgroundColor: '#0f172a', border: 'none', fontSize: 13 }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {paginated.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className="flex"
                >
                  <div className="w-full">
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      description={product.description}
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
              <div className="text-center mt-10">
                <motion.button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 rounded-xl font-bold cursor-pointer"
                  style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: 13, border: 'none' }}
                  whileHover={{ backgroundColor: '#C9A84C', color: '#0f172a' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Load More · {sorted.length - paginated.length} remaining
                </motion.button>
              </div>
            )}
          </>
        )}

      </section>

    </div>
  )
}

export default Home