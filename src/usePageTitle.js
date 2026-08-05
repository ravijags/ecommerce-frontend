import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/': 'PREMIA — Everything Premium. Delivered.',
  '/login': 'Sign In — PREMIA',
  '/register': 'Create Account — PREMIA',
  '/cart': 'My Cart — PREMIA',
  '/orders': 'My Orders — PREMIA',
  '/wishlist': 'My Wishlist — PREMIA',
  '/account': 'My Account — PREMIA',
  '/admin': 'Dashboard — PREMIA Admin',
  '/admin/orders': 'Orders — PREMIA Admin',
  '/admin/products': 'Products — PREMIA Admin',
  '/admin/users': 'Users — PREMIA Admin',
}

export function usePageTitle(customTitle) {
  const location = useLocation()
  useEffect(() => {
    const title = customTitle || TITLES[location.pathname] || 'PREMIA — Everything Premium. Delivered.'
    document.title = title
  }, [location.pathname, customTitle])
}
