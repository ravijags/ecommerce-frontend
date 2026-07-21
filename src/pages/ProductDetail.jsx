import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function ProductDetail({ addToCart }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Product not found!')
        navigate('/')
      })
  }, [id])

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return null

  const imageUrl = (product.image && product.image.startsWith('http'))
    ? product.image
    : 'https://picsum.photos/400/300'

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <Link to="/" className="text-blue-500 hover:underline text-sm mb-6 block">
        ← Back to Products
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex gap-8">

          {/* Image */}
          <div className="w-80 flex-shrink-0">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>

            <p className="text-4xl font-bold text-green-500 mt-4">${product.price}</p>

            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="mt-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            <button
              onClick={() => {
                addToCart(product)
              }}
              disabled={product.stock === 0}
              className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 cursor-pointer transition-all duration-200 disabled:opacity-50 font-medium"
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}

export default ProductDetail