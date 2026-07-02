function ProductCard({ name, price, description, image, onAddToCart }) {
  const imageUrl = (image && image.startsWith("http"))
    ? image
    : "https://picsum.photos/200/150"

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-64 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-gray-800 mt-3">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
      <p className="text-green-500 font-bold text-xl mt-2">${price}</p>
      <button
        onClick={onAddToCart}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mt-3 hover:bg-blue-600 active:scale-95 transition-all duration-200 cursor-pointer font-medium"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard