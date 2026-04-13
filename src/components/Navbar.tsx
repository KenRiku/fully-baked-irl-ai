'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{ backgroundColor: '#FDF6EC', borderBottom: '2px solid #F5E6CC' }} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🍪</span>
            <div>
              <span
                style={{ fontFamily: "'Playfair Display', serif", color: '#1A0F0A', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                AIssembly
              </span>
              <span style={{ color: '#D47C0F', fontSize: '0.65rem', display: 'block', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                Fully Baked: IRL AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/workshops" style={{ color: '#1A0F0A', fontWeight: 500 }} className="hover:text-amber-700 transition-colors text-sm">
              Workshops
            </Link>
            <Link href="/corporate" style={{ color: '#1A0F0A', fontWeight: 500 }} className="hover:text-amber-700 transition-colors text-sm">
              Corporate
            </Link>
            {session ? (
              <>
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link href="/admin" style={{ color: '#C85A2A', fontWeight: 600 }} className="text-sm hover:opacity-80 transition-opacity">
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  style={{ color: '#1A0F0A', fontWeight: 500 }}
                  className="hover:text-amber-700 transition-colors text-sm"
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{ backgroundColor: '#1A0F0A', color: '#FDF6EC', fontWeight: 600 }}
                  className="text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ color: '#1A0F0A', fontWeight: 500 }}
                  className="hover:text-amber-700 transition-colors text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600 }}
                  className="text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div style={{ width: 24, height: 2, background: '#1A0F0A', margin: '5px 0', transition: 'all 0.3s' }} />
            <div style={{ width: 24, height: 2, background: '#1A0F0A', margin: '5px 0', transition: 'all 0.3s' }} />
            <div style={{ width: 24, height: 2, background: '#1A0F0A', margin: '5px 0', transition: 'all 0.3s' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#FDF6EC', borderTop: '1px solid #F5E6CC' }} className="md:hidden px-4 py-4 flex flex-col gap-4">
          <Link href="/workshops" style={{ color: '#1A0F0A', fontWeight: 500 }} onClick={() => setMenuOpen(false)}>
            Workshops
          </Link>
          <Link href="/corporate" style={{ color: '#1A0F0A', fontWeight: 500 }} onClick={() => setMenuOpen(false)}>
            Corporate
          </Link>
          {session ? (
            <>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" style={{ color: '#C85A2A', fontWeight: 600 }} onClick={() => setMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <Link href="/dashboard" style={{ color: '#1A0F0A', fontWeight: 500 }} onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                style={{ backgroundColor: '#1A0F0A', color: '#FDF6EC', fontWeight: 600 }}
                className="w-full text-center py-2 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: '#1A0F0A', fontWeight: 500 }} onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link
                href="/signup"
                style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600 }}
                className="text-center py-2 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
