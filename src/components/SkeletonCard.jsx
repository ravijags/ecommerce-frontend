export default function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
      <div className="product-img-wrapper skeleton-pulse" style={{ background: '#f1f5f9' }} />
      <div style={{ padding: '10px 12px 14px' }}>
        <div className="skeleton-pulse" style={{ width: '55%', height: 9, borderRadius: 4, marginBottom: 8 }} />
        <div className="skeleton-pulse" style={{ width: '90%', height: 13, borderRadius: 4, marginBottom: 5 }} />
        <div className="skeleton-pulse" style={{ width: '70%', height: 13, borderRadius: 4, marginBottom: 14 }} />
        <div className="skeleton-pulse" style={{ width: '45%', height: 18, borderRadius: 4, marginBottom: 10 }} />
        <div className="skeleton-pulse" style={{ width: '100%', height: 36, borderRadius: 10 }} />
      </div>
      <style>{`
        .skeleton-pulse {
          animation: skeletonPulse 1.4s ease-in-out infinite;
          background: #f1f5f9;
        }
        @keyframes skeletonPulse {
          0%, 100% { background-color: #f1f5f9; }
          50% { background-color: #e2e8f0; }
        }
      `}</style>
    </div>
  )
}
