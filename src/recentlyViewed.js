const KEY = 'premia_recently_viewed'
const MAX = 6

export function addRecentlyViewed(product) {
  try {
    const current = getRecentlyViewed()
    const filtered = current.filter(p => p._id !== product._id)
    const updated = [{ _id: product._id, name: product.name, price: product.price, image: product.image || product.thumbnail, brand: product.brand, rating: product.rating, discount: product.discount, originalPrice: product.originalPrice }, ...filtered].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {}
}

export function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
