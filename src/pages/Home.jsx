import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'

function Home({ addToCart, searchQuery }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  useEffect(() => {
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
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-yellow-400 font-semibold text-sm tracking-widest uppercase mb-3">
              New Arrivals 2026
            </p>
            <h1 className="text-5xl font-black leading-tight mb-4">
              Shop The Latest<br />
              <span className="text-red-400">Trends & Deals</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              Discover 194+ products across all categories. 
              Free shipping above ₹999.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                Shop Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-colors cursor-pointer">
                View Deals
              </button>
            </div>
          </div>

          {/* Hero stats */}
          <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { number: '194+', label: 'Products' },
              { number: '20+', label: 'Categories' },
              { number: '4.5★', label: 'Avg Rating' },
              { number: '100%', label: 'Secure' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 text-center border border-white/20 min-w-28">
                <p className="text-2xl font-black text-yellow-400">{stat.number}</p>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            ))}
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
    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
      category === cat.slug
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
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