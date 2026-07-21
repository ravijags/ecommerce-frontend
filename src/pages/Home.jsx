import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'

function Home({ addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setLoading(false)
      })
  }, [])

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === '' || product.category === category
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm cursor-pointer focus:outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Products
        {search && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({filteredProducts.length} results for "{search}")
          </span>
        )}
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found!</p>
          <button
            onClick={() => { setSearch(''); setCategory('') }}
            className="mt-4 text-blue-500 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default Home