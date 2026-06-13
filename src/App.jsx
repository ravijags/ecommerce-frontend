import { useState, useEffect } from 'react'
import Header from './Header'
import ProductCard from './ProductCard'

function App() {
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("https://ecommerce-v2-y8jy.onrender.com/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.products))
  }, [])
  
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Header cartCount={cartCount} />
      <main className='max-w-6xl mx-auto px-6 py-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Products</h2>
        <div className='flex flex-wrap gap-6'>
          {products.map(product => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image}
              onAddToCart={() => setCartCount(cartCount + 1)} 
            />
          ))}

        </div>

      
      </main>
    </div>
  )
}

export default App