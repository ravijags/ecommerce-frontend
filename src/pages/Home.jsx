import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard'

function Home({ cartCount, setCartCount }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("https://ecommerce-v2-y8jy.onrender.com/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.products))
  }, [])

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
            onAddToCart={() => setCartCount(cartCount + 1)}
          />
        ))}
      </div>
    </main>
  )
}

export default Home