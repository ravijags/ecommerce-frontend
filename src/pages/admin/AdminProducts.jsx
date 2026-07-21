import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      headers: { authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setLoading(false)
      })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('stock', formData.stock)
      data.append('category', formData.category)
      if (imageFile) {
        data.append('image', imageFile)
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        method: 'POST',
        headers: { authorization: token },
        body: data,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Product created!')
        setShowForm(false)
        setFormData({ name: '', description: '', price: '', stock: '', category: '' })
        setImageFile(null)
        fetchProducts()
      } else {
        toast.error(result.error || 'Failed to create product!')
      }
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('token')
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { authorization: token }
      })

      if (response.ok) {
        toast.success('Product deleted!')
        setProducts(products.filter(p => p._id !== productId))
      } else {
        toast.error('Failed to delete product!')
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer transition-all duration-200"
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Product</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name:</label>
              <input
                type="text"
                placeholder="Product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Category:</label>
              <input
                type="text"
                placeholder="Electronics, Clothing..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Price:</label>
              <input
                type="number"
                placeholder="999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Stock:</label>
              <input
                type="number"
                placeholder="100"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Description:</label>
              <textarea
                placeholder="Product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                rows="3"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50 transition-all duration-200"
          >
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Image</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={(product.image && product.image.startsWith('http'))
                      ? product.image
                      : 'https://picsum.photos/50/50'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">${product.price}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.stock}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 cursor-pointer transition-all duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminProducts