function PremiaLogo({ variant = 'light', size = 'md' }) {
  const sizes = {
    sm: { icon: 28, text: 14, sub: 6 },
    md: { icon: 36, text: 18, sub: 7.5 },
    lg: { icon: 48, text: 24, sub: 9 },
  }
  const s = sizes[size]

  const iconDark = (
    <svg width={s.icon} height={s.icon} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#0f172a"/>
      <rect x="8" y="20" width="48" height="38" rx="9" fill="#1e293b"/>
      <path d="M18 20 C18 7 46 7 46 20" stroke="#1e293b" strokeWidth="5" strokeLinecap="round"/>
      <text x="32" y="47" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="26" fontWeight="900" fill="#C9A84C">P</text>
    </svg>
  )

  const iconGold = (
    <svg width={s.icon} height={s.icon} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#C9A84C"/>
      <rect x="8" y="20" width="48" height="38" rx="9" fill="#b8932a"/>
      <path d="M18 20 C18 7 46 7 46 20" stroke="#b8932a" strokeWidth="5" strokeLinecap="round"/>
      <text x="32" y="47" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="26" fontWeight="900" fill="#0a0a0a">P</text>
    </svg>
  )

  return (
    <div className="flex items-center gap-2.5">
      {variant === 'dark' ? iconGold : iconDark}
      <div>
        <div style={{
          fontFamily: 'Inter, system-ui',
          fontSize: s.text,
          fontWeight: 900,
          color: variant === 'dark' ? '#ffffff' : '#0f172a',
          letterSpacing: '-0.4px',
          lineHeight: 1.1
        }}>
          PREMIA
        </div>
        <div style={{
          fontSize: s.sub,
          color: '#C9A84C',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginTop: 2
        }}>
          Premium Shopping
        </div>
      </div>
    </div>
  )
}

export default PremiaLogo