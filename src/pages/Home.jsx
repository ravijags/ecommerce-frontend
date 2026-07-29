import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'

function Home({ addToCart, searchQuery }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  useEffect(() => {
  window.scrollTo(0, 0)
  fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=500`)
    .then(res => res.json())
    .then(data => {
      setProducts(data.products)
      setLoading(false)
    })
}, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !category ||
      product.category === category
    return matchesSearch && matchesCategory
  })

  if (loading) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white">
      <div
        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }}
      />
    </div>
  )
}

  return (
    <>
      {/* Hero Section */}
<section style={{ backgroundColor: '#0f172a' }} className="text-white">
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="max-w-2xl">
      <p style={{ color: '#C9A84C' }} className="text-xs font-bold tracking-[0.3em] uppercase mb-4">
        Curated for the Discerning
      </p>
      <h1 className="text-5xl lg:text-6xl font-black leading-none mb-6 text-white" style={{ letterSpacing: '-1.5px' }}>
        The New Standard<br />
        <span style={{ color: '#C9A84C' }}>of Shopping.</span>
      </h1>
      <p className="text-lg mb-10 leading-relaxed" style={{ color: '#64748b', maxWidth: '480px' }}>
        348+ premium products from the world's finest brands.
        Every item handpicked. Every price unbeatable.
      </p>
      <div className="flex gap-4">
        <button
          style={{ backgroundColor: '#C9A84C', color: '#0f172a' }}
          className="px-10 py-4 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-opacity cursor-pointer uppercase"
        >
          Explore Now
        </button>
        <button
          style={{ border: '1px solid #1e293b', color: '#64748b' }}
          className="px-10 py-4 rounded-xl font-semibold text-sm hover:border-gray-600 transition-colors cursor-pointer"
        >
          View Deals
        </button>
      </div>
    </div>
  </div>
</section>

      {/* Category pills */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
  { slug: '', name: 'All' },
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'tablets', name: 'Tablets' },
  { slug: 'beauty', name: 'Beauty' },
  { slug: 'skin-care', name: 'Skin Care' },
  { slug: 'fragrances', name: 'Fragrances' },
  { slug: 'mens-shirts', name: 'Mens Shirts' },
  { slug: 'mens-shoes', name: 'Mens Shoes' },
  { slug: 'mens-watches', name: 'Mens Watches' },
  { slug: 'womens-dresses', name: 'Womens Dresses' },
  { slug: 'womens-shoes', name: 'Womens Shoes' },
  { slug: 'womens-watches', name: 'Womens Watches' },
  { slug: 'womens-bags', name: 'Womens Bags' },
  { slug: 'womens-jewellery', name: 'Womens Jewellery' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'home-decoration', name: 'Home Decoration' },
  { slug: 'kitchen-accessories', name: 'Kitchen Accessories' },
  { slug: 'groceries', name: 'Groceries' },
  { slug: 'sports-accessories', name: 'Sports Accessories' },
  { slug: 'sunglasses', name: 'Sunglasses' },
  { slug: 'tops', name: 'Tops' },
  { slug: 'mobile-accessories', name: 'Mobile Accessories' },
  { slug: 'motorcycle', name: 'Motorcycle' },
  { slug: 'vehicle', name: 'Vehicle' },
].map((cat, i) => (
  <button
  key={i}
  onClick={() => setCategory(cat.slug)}
  className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0"
  style={{
    backgroundColor: category === cat.slug ? '#0f172a' : '#f1f5f9',
    color: category === cat.slug ? '#ffffff' : '#64748b',
    border: category === cat.slug ? '2px solid #C9A84C' : '2px solid transparent',
  }}
>
  {cat.name}
</button>
))}
          </div>
        </div>
      </section>

      {/* Products */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
            <span className="text-base font-normal text-gray-400 ml-2">
              ({filteredProducts.length} items)
            </span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No products found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
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
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Home