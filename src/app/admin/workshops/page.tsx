import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getWorkshops() {
  try {
    return await prisma.workshop.findMany({
      include: { _count: { select: { bookings: true } } },
      orderBy: { date: 'asc' },
    })
  } catch {
    return []
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PUBLISHED: { bg: '#D1FAE5', text: '#065F46' },
  DRAFT: { bg: '#FEF3C7', text: '#92400E' },
  COMPLETED: { bg: '#EDE9FE', text: '#5B21B6' },
  CANCELLED: { bg: '#FEE2E2', text: '#991B1B' },
}

export default async function AdminWorkshopsPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/login')

  const workshops = await getWorkshops()

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.25rem' }}>
            Workshops
          </h1>
          <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>{workshops.length} workshops total</p>
        </div>
        <Link
          href="/admin/workshops/new"
          style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.3)' }}
        >
          + New Workshop
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1.25rem', overflow: 'hidden' }}>
        {workshops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8B7355' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍪</div>
            <p>No workshops yet. Create your first one!</p>
            <Link href="/admin/workshops/new" style={{ color: '#D47C0F', fontWeight: 600, textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
              Create Workshop →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FDF6EC', borderBottom: '2px solid #F5E6CC' }}>
                  {['Workshop', 'Profession', 'City', 'Date', 'Price', 'Bookings', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: '#8B7355', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workshops.map((ws) => {
                  const sc = statusColors[ws.status] || { bg: '#F3F4F6', text: '#374151' }
                  return (
                    <tr key={ws.id} style={{ borderBottom: '1px solid #F5E6CC' }} className="hover:bg-stone-50">
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#1A0F0A', maxWidth: 220 }}>{ws.title}</div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: '#8B7355' }}>{ws.profession}</td>
                      <td style={{ padding: '0.875rem 1rem', color: '#8B7355' }}>{ws.city}</td>
                      <td style={{ padding: '0.875rem 1rem', color: '#8B7355', whiteSpace: 'nowrap' }}>{formatDate(ws.date)}</td>
                      <td style={{ padding: '0.875rem 1rem', color: '#1A0F0A', fontWeight: 600 }}>${(ws.priceCents / 100).toFixed(0)}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ color: '#D47C0F', fontWeight: 600 }}>{ws._count.bookings}</span>
                        <span style={{ color: '#8B7355' }}>/{ws.capacity}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '0.25rem 0.625rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                          {ws.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link href={`/admin/workshops/${ws.id}/edit`} style={{ color: '#D47C0F', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                            Edit
                          </Link>
                          <Link href={`/admin/workshops/${ws.id}/attendees`} style={{ color: '#8B7355', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                            Attendees
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
