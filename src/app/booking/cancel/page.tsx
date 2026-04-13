import Link from 'next/link'
import { Suspense } from 'react'

function CancelContent() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😔</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '1rem' }}>
          Booking Cancelled
        </h1>
        <p style={{ color: '#8B7355', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          No worries — your card has not been charged. The workshop spot is still available if you change your mind.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/workshops"
            style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.875rem 1.75rem', borderRadius: '0.75rem', textDecoration: 'none' }}
          >
            Browse Workshops
          </Link>
          <Link
            href="/"
            style={{ backgroundColor: 'white', color: '#1A0F0A', fontWeight: 600, padding: '0.875rem 1.75rem', borderRadius: '0.75rem', textDecoration: 'none', border: '2px solid #F5E6CC' }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  )
}
