// Dead simple wishlist store — works without React, without backend
// Everything goes through here so localStorage is always in sync

const WISHLIST_KEY = 'premia_wishlist'

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save wishlist:', e)
  }
}

export function addToWishlistStore(product) {
  const current = getWishlist()
  if (current.some(p => p._id === product._id)) return { added: false, items: current }
  const item = {
    _id: product._id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    brand: product.brand,
    image: product.image || product.thumbnail || product.images?.[0],
    rating: product.rating,
    category: product.category,
  }
  const updated = [...current, item]
  saveWishlist(updated)
  return { added: true, items: updated }
}

export function removeFromWishlistStore(productId) {
  const current = getWishlist()
  const updated = current.filter(p => p._id !== productId)
  saveWishlist(updated)
  return updated
}
