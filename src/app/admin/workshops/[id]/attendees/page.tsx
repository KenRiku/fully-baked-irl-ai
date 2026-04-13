import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

async function getWorkshopWithAttendees(id: string) {
  try {
    return await prisma.workshop.findUnique({
      where: { id },
      include: {
        bookings: {
          include: { user: true },
          orderBy: { bookedAt: 'desc' },
        },
      },
    })
  } catch {
    return null
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default async function AttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/login')

  const { id } = await params
  const workshop = await getWorkshopWithAttendees(id)
  if (!workshop) notFound()

  const confirmed = workshop.bookings.filter((b) => b.status === 'CONFIRMED')

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/workshops" style={{ color: '#8B7355', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Workshops
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.25rem' }}>
          {workshop.title}
        </h1>
        <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
          {workshop.city} · {formatDate(workshop.date)} · {workshop.startTime}–{workshop.endTime}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Capacity', value: workshop.capacity, icon: '🏟️' },
          { label: 'Confirmed', value: confirmed.length, icon: '✅' },
          { label: 'Spots Left', value: workshop.capacity - confirmed.length, icon: '🎫' },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 800, color: '#D47C0F' }}>{s.value}</div>
            <div style={{ color: '#8B7355', fontSize: '0.75rem', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Attendee table */}
      <div style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1.25rem', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F5E6CC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#1A0F0A' }}>
            Attendee List
          </h2>
          <span style={{ color: '#8B7355', fontSize: '0.8rem' }}>{confirmed.length} attendee{confirmed.length !== 1 ? 's' : ''}</span>
        </div>

        {confirmed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8B7355' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎫</div>
            <p>No confirmed bookings yet for this workshop.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FDF6EC' }}>
                  {['#', 'Name', 'Email', 'Profession', 'Booked At', 'Amount', 'Status'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#8B7355', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #F5E6CC' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {confirmed.map((booking, i) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #F5E6CC' }} className="hover:bg-stone-50">
                    <td style={{ padding: '0.875rem 1rem', color: '#8B7355', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1A0F0A' }}>{booking.user.name}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#8B7355' }}>{booking.user.email}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#8B7355' }}>{booking.user.profession || '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#8B7355', whiteSpace: 'nowrap' }}>{formatDateTime(booking.bookedAt)}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#D47C0F', fontWeight: 700 }}>${(booking.amountCents / 100).toFixed(0)}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
