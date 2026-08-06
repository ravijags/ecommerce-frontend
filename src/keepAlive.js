// Keeps the Render backend awake by pinging every 14 minutes
// Render free tier sleeps after 15 min of inactivity

const KEEP_ALIVE_API = import.meta.env.VITE_API_URL
const INTERVAL = 14 * 60 * 1000 // 14 minutes

export function startKeepAlive() {
  // Ping immediately on load
  ping()
  // Then every 14 minutes
  setInterval(ping, INTERVAL)
}

function ping() {
  fetch(`${KEEP_ALIVE_API}/api/products?limit=1`)
    .then(() => console.log('Backend alive:', new Date().toLocaleTimeString()))
    .catch(() => {}) // Silent fail
}
