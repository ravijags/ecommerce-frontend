import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'

function Home({ addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => { setProducts(data.products)
                      setLoading(false)})
  }, [])
  
  if(loading) {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>
      <div className="flex flex-wrap gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            description={product.description}
            image={product.image}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </main>
  )
}

export default Home