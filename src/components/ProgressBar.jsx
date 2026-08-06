import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ProgressBar() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setVisible(true)
    setProgress(20)
    const t1 = setTimeout(() => setProgress(60), 100)
    const t2 = setTimeout(() => setProgress(90), 300)
    const t3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => { setVisible(false); setProgress(0) }, 300)
    }, 600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [location.pathname])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 2.5, zIndex: 9999, background: 'transparent',
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #C9A84C, #e8c96a)',
        transition: progress === 100 ? 'width 0.2s ease, opacity 0.3s' : 'width 0.4s ease',
        opacity: progress === 100 ? 0 : 1,
        boxShadow: '0 0 8px rgba(201,168,76,0.6)',
      }} />
    </div>
  )
}
