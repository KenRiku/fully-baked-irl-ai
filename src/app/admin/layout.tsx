'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/workshops', label: 'Workshops', icon: '🍪' },
  { href: '/admin/inquiries', label: 'Inquiries', icon: '📬' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, backgroundColor: '#1A0F0A', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid #2D1810' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.75rem' }}>🍪</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: '#FDF6EC', fontWeight: 700, fontSize: '1.1rem' }}>AIssembly</div>
              <div style={{ color: '#D47C0F', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Console</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem' }}>
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  marginBottom: '0.25rem',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#2D1810' : 'transparent',
                  color: isActive ? '#D47C0F' : '#8B7355',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s',
                }}
                className="hover:bg-stone-800"
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #2D1810' }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8B7355', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '0.75rem' }}
          >
            ← View Public Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ width: '100%', backgroundColor: '#2D1810', color: '#8B7355', border: 'none', padding: '0.625rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, backgroundColor: '#FDF6EC', overflowY: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
