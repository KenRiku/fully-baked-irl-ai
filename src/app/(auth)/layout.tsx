export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #F5E6CC' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem' }}>🍪</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1A0F0A' }}>AIssembly</span>
        </a>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        {children}
      </div>
    </div>
  )
}
