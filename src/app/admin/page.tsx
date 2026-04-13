import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getStats() {
  try {
    const [totalWorkshops, publishedWorkshops, totalBookings, totalRevenue, recentBookings, corporateInquiries] = await Promise.all([
      prisma.workshop.count(),
      prisma.workshop.count({ where: { status: 'PUBLISHED' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.aggregate({ where: { status: 'CONFIRMED' }, _sum: { amountCents: true } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { bookedAt: 'desc' },
        include: { user: true, workshop: true },
        where: { status: 'CONFIRMED' },
      }),
      prisma.corporateInquiry.count({ where: { status: 'NEW' } }),
    ])
    return { totalWorkshops, publishedWorkshops, totalBookings, totalRevenue: totalRevenue._sum.amountCents || 0, recentBookings, corporateInquiries }
  } catch {
    return { totalWorkshops: 0, publishedWorkshops: 0, totalBookings: 0, totalRevenue: 0, recentBookings: [], corporateInquiries: 0 }
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AdminPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/login')

  const stats = await getStats()

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.25rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
          Good to see you, {session?.user?.name}. Here's the latest.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${(stats.totalRevenue / 100).toLocaleString()}`, icon: '💰', color: '#D47C0F' },
          { label: 'Confirmed Bookings', value: stats.totalBookings, icon: '🎫', color: '#059669' },
          { label: 'Published Workshops', value: stats.publishedWorkshops, icon: '🍪', color: '#C85A2A' },
          { label: 'New Inquiries', value: stats.corporateInquiries, icon: '📬', color: '#7C3AED' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{kpi.icon}</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>
              {kpi.value}
            </div>
            <div style={{ color: '#8B7355', fontSize: '0.8rem', fontWeight: 500, marginTop: '0.4rem' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/workshops/new" style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.625rem 1.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            + New Workshop
          </Link>
          <Link href="/admin/workshops" style={{ backgroundColor: '#F5E6CC', color: '#1A0F0A', fontWeight: 600, padding: '0.625rem 1.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            Manage Workshops
          </Link>
          <Link href="/admin/inquiries" style={{ backgroundColor: '#F5E6CC', color: '#1A0F0A', fontWeight: 600, padding: '0.625rem 1.25rem', borderRadius: '0.625rem', textDecoration: 'none', fontSize: '0.875rem' }}>
            View Inquiries
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1.25rem', padding: '1.5rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1.25rem' }}>
          Recent Bookings
        </h2>
        {stats.recentBookings.length === 0 ? (
          <p style={{ color: '#8B7355', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No bookings yet. Share those workshops!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F5E6CC' }}>
                  {['Attendee', 'Workshop', 'Date Booked', 'Amount'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.625rem 0.75rem', color: '#8B7355', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid #F5E6CC' }}>
                    <td style={{ padding: '0.75rem', color: '#1A0F0A', fontWeight: 500 }}>
                      <div>{booking.user.name}</div>
                      <div style={{ color: '#8B7355', fontSize: '0.75rem' }}>{booking.user.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#1A0F0A' }}>
                      <div style={{ fontWeight: 500 }}>{booking.workshop.title}</div>
                      <div style={{ color: '#8B7355', fontSize: '0.75rem' }}>{booking.workshop.city}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#8B7355' }}>{formatDate(booking.bookedAt)}</td>
                    <td style={{ padding: '0.75rem', color: '#D47C0F', fontWeight: 700 }}>
                      ${(booking.amountCents / 100).toFixed(0)}
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
