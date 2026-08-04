import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ textAlign: 'center', maxWidth: 480 }}>
        
        {/* Big 404 */}
        <div style={{ fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 900, lineHeight: 1, marginBottom: 8, letterSpacing: '-4px' }}>
          <span style={{ color: '#0f172a' }}>4</span>
          <span style={{ color: '#C9A84C' }}>0</span>
          <span style={{ color: '#0f172a' }}>4</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Page not found</h1>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 36 }}>
          The page you're looking for doesn't exist or has been moved.<br />
          Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#0f172a', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            <Home size={16} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#fff', color: '#0f172a', border: '2px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
