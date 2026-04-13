'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface Booking {
  id: string
  status: string
  amountCents: number
  bookedAt: string
  workshop: {
    id: string
    title: string
    city: string
    date: string
    startTime: string
    endTime: string
    venueName: string
    profession: string
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

const professionEmoji: Record<string, string> = {
  Accounting: '📊',
  HR: '👥',
  Marketing: '📣',
  'Estate Agent': '🏡',
  Legal: '⚖️',
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/bookings')
        .then((r) => r.json())
        .then((data) => {
          setBookings(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session])

  const now = new Date()
  const upcoming = bookings.filter((b) => new Date(b.workshop.date) >= now && b.status === 'CONFIRMED')
  const past = bookings.filter((b) => new Date(b.workshop.date) < now || b.status !== 'CONFIRMED')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC' }}>
      {/* Top nav */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #F5E6CC', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span>🍪</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1A0F0A', fontSize: '1.1rem' }}>AIssembly</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/workshops" style={{ color: '#8B7355', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
            Browse Workshops
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ backgroundColor: '#1A0F0A', color: '#FDF6EC', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.375rem' }}>
            My Workshops
          </h1>
          <p style={{ color: '#8B7355', fontSize: '0.9rem' }}>
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '🎫' },
            { label: 'Upcoming', value: upcoming.length, icon: '📅' },
            { label: 'Completed', value: past.filter((b) => b.status === 'CONFIRMED').length, icon: '✅' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 800, color: '#1A0F0A' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#8B7355', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍪</div>
            <p style={{ color: '#8B7355' }}>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1.5rem', border: '1px solid #F5E6CC' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#1A0F0A', marginBottom: '0.75rem' }}>
              No Bookings Yet
            </h2>
            <p style={{ color: '#8B7355', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Your AI journey starts with your first workshop!
            </p>
            <Link
              href="/workshops"
              style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '0.75rem', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.3)' }}
            >
              Browse Workshops →
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
                  Upcoming Workshops
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {upcoming.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isUpcoming />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
                  Past Workshops
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.8 }}>
                  {past.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, isUpcoming }: { booking: Booking; isUpcoming: boolean }) {
  const emoji = professionEmoji[booking.workshop.profession] || '🧠'
  return (
    <div style={{ backgroundColor: 'white', border: `2px solid ${isUpcoming ? '#F5E6CC' : '#E5E7EB'}`, borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ width: 48, height: 48, backgroundColor: isUpcoming ? '#F5E6CC' : '#F3F4F6', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1A0F0A', fontSize: '1rem', marginBottom: '0.3rem' }}>
              {booking.workshop.title}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#8B7355', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span>📅 {formatDate(booking.workshop.date)}</span>
              <span>⏰ {booking.workshop.startTime}</span>
              <span>📍 {booking.workshop.venueName}, {booking.workshop.city}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 700, color: '#1A0F0A', fontSize: '1rem' }}>{formatPrice(booking.amountCents)}</div>
            <div style={{ fontSize: '0.7rem', color: isUpcoming ? '#059669' : '#8B7355', fontWeight: 600, marginTop: '0.2rem' }}>
              {booking.status === 'CONFIRMED' ? (isUpcoming ? '✅ CONFIRMED' : '✔ COMPLETED') : booking.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
