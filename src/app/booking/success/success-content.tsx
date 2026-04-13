'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Workshop {
  id: string
  title: string
  city: string
  date: string
  startTime: string
  endTime: string
  venueName: string
  venueAddress: string
  priceCents: number
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(true)

  const sessionId = searchParams.get('session_id')
  const workshopId = searchParams.get('workshopId')
  const isMock = searchParams.get('mock') === 'true'

  useEffect(() => {
    const confirm = async () => {
      if (!session?.user?.id) return

      // Fetch workshop details
      const targetId = workshopId || sessionId
      if (!targetId && !sessionId) {
        setLoading(false)
        return
      }

      try {
        // For mock mode, create booking directly
        if (isMock && workshopId) {
          const wsRes = await fetch(`/api/workshops/${workshopId}`)
          const ws = await wsRes.json()
          setWorkshop(ws)

          const bookingRes = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workshopId, mock: true }),
          })
          if (bookingRes.ok) setBooked(true)
        } else if (sessionId) {
          // Real Stripe: confirm via session_id
          const confirmRes = await fetch(`/api/bookings/confirm?session_id=${sessionId}`)
          if (confirmRes.ok) {
            const data = await confirmRes.json()
            setWorkshop(data.workshop)
            setBooked(true)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (session !== undefined) {
      confirm()
    }
  }, [session, sessionId, workshopId, isMock])

  if (loading || session === undefined) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍪</div>
          <p style={{ color: '#8B7355' }}>Confirming your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '1rem' }}>
          You're Booked!
        </h1>
        <p style={{ color: '#8B7355', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Your spot has been confirmed. Get ready to level up your AI skills!
        </p>

        {workshop && (
          <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '1.75rem', border: '1px solid #F5E6CC', marginBottom: '2rem', textAlign: 'left' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
              {workshop.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#8B7355' }}>
              <div>📅 {formatDate(workshop.date)}</div>
              <div>⏰ {workshop.startTime} – {workshop.endTime}</div>
              <div>📍 {workshop.venueName}</div>
              <div>🏙️ {workshop.city}</div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#F5E6CC', borderRadius: '1rem', padding: '1.25rem', marginBottom: '2rem' }}>
          <p style={{ color: '#8B7355', fontSize: '0.875rem', lineHeight: 1.6 }}>
            📧 A confirmation email is on its way. Add the date to your calendar and we'll see you there!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.875rem 1.75rem', borderRadius: '0.75rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.3)' }}
          >
            View My Bookings →
          </Link>
          <Link
            href="/workshops"
            style={{ backgroundColor: 'white', color: '#1A0F0A', fontWeight: 600, padding: '0.875rem 1.75rem', borderRadius: '0.75rem', textDecoration: 'none', border: '2px solid #F5E6CC' }}
          >
            Browse More Workshops
          </Link>
        </div>
      </div>
    </div>
  )
}
