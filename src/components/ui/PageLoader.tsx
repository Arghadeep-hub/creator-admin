export function PageLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right,#ffedd5 0%,#f8fafc 34%,#f8fafc 100%)',
        zIndex: 9999,
      }}
    >
      <style>{`
        @keyframes page-spin { to { transform: rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) {
          .page-spinner { animation: none !important }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <span
          className="page-spinner"
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '9999px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#111827',
            animation: 'page-spin 0.8s linear infinite',
          }}
        />
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#6b7280',
          }}
        >
          Loading…
        </span>
      </div>
    </div>
  )
}
