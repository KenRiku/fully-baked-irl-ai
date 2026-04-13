'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Workshop {
  id: string
  title: string
  profession: string
  city: string
  venueName: string
  venueAddress: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  priceCents: number
  description: string
  curriculumOutline?: string
  facilitatorName?: string
  facilitatorBio?: string
  status: string
  imageUrl?: string
  _count?: { bookings: number }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

const professionColors: Record<string, { bg: string; text: string; emoji: string }> = {
  Accounting: { bg: '#FEF3C7', text: '#92400E', emoji: '📊' },
  HR: { bg: '#FCE7F3', text: '#9D174D', emoji: '👥' },
  Marketing: { bg: '#DBEAFE', text: '#1E40AF', emoji: '📣' },
  'Estate Agent': { bg: '#D1FAE5', text: '#065F46', emoji: '🏡' },
  Legal: { bg: '#EDE9FE', text: '#5B21B6', emoji: '⚖️' },
}

export default function WorkshopDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/workshops/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setWorkshop(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError('Workshop not found.')
      })
  }, [id])

  const handleBook = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/workshops/${id}`)
      return
    }
    setBooking(true)
    setError('')
    try {
      const res = await fetch(`/api/checkout?workshopId=${id}`)
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Unable to start checkout.')
        setBooking(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍪</div>
          <p style={{ color: '#8B7355' }}>Loading workshop details...</p>
        </div>
      </div>
    )
  }

  if (!workshop || error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#1A0F0A', marginBottom: '0.75rem' }}>
            Workshop Not Found
          </h2>
          <Link href="/workshops" style={{ color: '#D47C0F', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to workshops
          </Link>
        </div>
      </div>
    )
  }

  const pc = professionColors[workshop.profession] || { bg: '#F5E6CC', text: '#1A0F0A', emoji: '🧠' }
  const spotsLeft = workshop.capacity - (workshop._count?.bookings || 0)
  const isSoldOut = spotsLeft <= 0

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#8B7355' }}>
          <Link href="/workshops" style={{ color: '#D47C0F', textDecoration: 'none', fontWeight: 500 }}>Workshops</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>{workshop.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Header card */}
            <div style={{ backgroundColor: pc.bg, borderRadius: '1.5rem', padding: '2rem', marginBottom: '2rem', border: `2px solid ${pc.bg}` }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ backgroundColor: 'white', color: pc.text, padding: '0.375rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {pc.emoji} {workshop.profession}
                </span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 800, color: '#1A0F0A', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                {workshop.title}
              </h1>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '📅', label: 'Date', value: formatDate(workshop.date) },
                  { icon: '⏰', label: 'Time', value: `${workshop.startTime} – ${workshop.endTime}` },
                  { icon: '📍', label: 'Venue', value: workshop.venueName },
                  { icon: '🏙️', label: 'City', value: workshop.city },
                ].map((item) => (
                  <div key={item.label} style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.7rem', color: '#8B7355', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: '0.875rem', color: '#1A0F0A', fontWeight: 600, marginTop: '0.1rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem', border: '1px solid #F5E6CC' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
                About This Workshop
              </h2>
              <p style={{ color: '#4B3832', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {workshop.description}
              </p>
            </div>

            {/* Curriculum */}
            {workshop.curriculumOutline && (
              <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem', border: '1px solid #F5E6CC' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
                  📋 What You'll Cover
                </h2>
                <div style={{ color: '#4B3832', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {workshop.curriculumOutline}
                </div>
              </div>
            )}

            {/* Facilitator */}
            {workshop.facilitatorName && (
              <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '2rem', border: '1px solid #F5E6CC' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
                  Your Facilitator
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F5E6CC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                    🧑‍🏫
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1A0F0A', fontSize: '1rem', marginBottom: '0.5rem' }}>{workshop.facilitatorName}</div>
                    {workshop.facilitatorBio && (
                      <p style={{ color: '#8B7355', fontSize: '0.875rem', lineHeight: 1.7 }}>{workshop.facilitatorBio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '2rem', border: '2px solid #F5E6CC', position: 'sticky', top: '5rem', boxShadow: '0 8px 32px rgba(26,15,10,0.08)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, color: '#1A0F0A' }}>
                  {formatPrice(workshop.priceCents)}
                </div>
                <div style={{ color: '#8B7355', fontSize: '0.875rem' }}>per person, all inclusive</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#FDF6EC', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#8B7355' }}>Date</span>
                  <span style={{ color: '#1A0F0A', fontWeight: 600 }}>{formatDate(workshop.date)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#8B7355' }}>Time</span>
                  <span style={{ color: '#1A0F0A', fontWeight: 600 }}>{workshop.startTime} – {workshop.endTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#8B7355' }}>Location</span>
                  <span style={{ color: '#1A0F0A', fontWeight: 600 }}>{workshop.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#8B7355' }}>Spots left</span>
                  <span style={{ color: isSoldOut ? '#C85A2A' : '#059669', fontWeight: 600 }}>
                    {isSoldOut ? 'Sold out' : `${spotsLeft} remaining`}
                  </span>
                </div>
              </div>

              {error && (
                <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={booking || isSoldOut}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: booking || isSoldOut ? 'not-allowed' : 'pointer',
                  backgroundColor: isSoldOut ? '#E5E7EB' : '#D47C0F',
                  color: isSoldOut ? '#6B7280' : '#FDF6EC',
                  border: 'none',
                  boxShadow: isSoldOut ? 'none' : '0 4px 14px rgba(212, 124, 15, 0.35)',
                  opacity: booking ? 0.7 : 1,
                }}
              >
                {booking ? '⏳ Processing...' : isSoldOut ? 'Sold Out' : 'Book This Workshop'}
              </button>

              {!session && (
                <p style={{ textAlign: 'center', color: '#8B7355', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                  You'll be asked to{' '}
                  <Link href="/login" style={{ color: '#D47C0F', fontWeight: 600, textDecoration: 'none' }}>sign in</Link>
                  {' '}before checkout
                </p>
              )}

              <div style={{ borderTop: '1px solid #F5E6CC', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#8B7355' }}>
                  <div>✅ Full-day workshop (materials included)</div>
                  <div>✅ Prompt library takeaway</div>
                  <div>✅ Coffee & refreshments provided</div>
                  <div>✅ Certificate of completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Venue info */}
        <div style={{ marginTop: '2rem', backgroundColor: 'white', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #F5E6CC' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '0.75rem' }}>
            📍 Venue Details
          </h3>
          <div style={{ color: '#4B3832', fontSize: '0.9rem' }}>
            <strong>{workshop.venueName}</strong>
            <br />
            {workshop.venueAddress}
            <br />
            {workshop.city}
          </div>
        </div>
      </div>
    </div>
  )
}
