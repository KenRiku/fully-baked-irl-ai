import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getWorkshops(profession?: string, city?: string) {
  try {
    return await prisma.workshop.findMany({
      where: {
        status: 'PUBLISHED',
        ...(profession ? { profession } : {}),
        ...(city ? { city } : {}),
      },
      orderBy: { date: 'asc' },
    })
  } catch {
    return []
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
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

const PROFESSIONS = ['Accounting', 'HR', 'Marketing', 'Estate Agent', 'Legal']
const CITIES = ['Nashville', 'Chicago', 'Atlanta', 'New York', 'Los Angeles', 'Houston']

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ profession?: string; city?: string }>
}) {
  const params = await searchParams
  const { profession, city } = params
  const workshops = await getWorkshops(profession, city)

  return (
    <div style={{ padding: '3rem 0', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.75rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.5rem' }}>
            🍪 Upcoming Workshops
          </h1>
          <p style={{ color: '#8B7355', fontSize: '1rem' }}>
            Freshly scheduled, hands-on AI sessions across the country.
          </p>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <div className="flex flex-wrap gap-3 items-center">
            <span style={{ color: '#1A0F0A', fontWeight: 600, fontSize: '0.875rem', marginRight: '0.5rem' }}>Filter by:</span>

            {/* Profession filters */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/workshops"
                style={{
                  padding: '0.375rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  backgroundColor: !profession ? '#1A0F0A' : '#F5E6CC',
                  color: !profession ? '#FDF6EC' : '#1A0F0A',
                }}
              >
                All
              </Link>
              {PROFESSIONS.map((p) => (
                <Link
                  key={p}
                  href={`/workshops?profession=${encodeURIComponent(p)}${city ? `&city=${encodeURIComponent(city)}` : ''}`}
                  style={{
                    padding: '0.375rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    backgroundColor: profession === p ? '#D47C0F' : '#F5E6CC',
                    color: profession === p ? '#FDF6EC' : '#1A0F0A',
                  }}
                >
                  {professionColors[p]?.emoji} {p}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Workshop grid */}
        {workshops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍪</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#1A0F0A', marginBottom: '0.75rem' }}>
              No workshops found
            </h2>
            <p style={{ color: '#8B7355', marginBottom: '1.5rem' }}>
              {profession || city ? 'Try adjusting your filters.' : 'Check back soon — new workshops are baking!'}
            </p>
            <Link href="/workshops" style={{ color: '#D47C0F', fontWeight: 600, textDecoration: 'none' }}>
              Clear filters →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => {
              const pc = professionColors[workshop.profession] || { bg: '#F5E6CC', text: '#1A0F0A', emoji: '🧠' }
              const spotsLeft = workshop.capacity
              return (
                <Link
                  key={workshop.id}
                  href={`/workshops/${workshop.id}`}
                  style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #F5E6CC', overflow: 'hidden', textDecoration: 'none', display: 'block' }}
                  className="hover:shadow-xl hover:border-amber-300 transition-all group"
                >
                  {/* Card header */}
                  <div style={{ backgroundColor: pc.bg, padding: '1.5rem', borderBottom: '1px solid #F5E6CC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ backgroundColor: 'white', color: pc.text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, border: `1px solid ${pc.bg}` }}>
                        {pc.emoji} {workshop.profession}
                      </span>
                      <span style={{ color: '#1A0F0A', fontWeight: 800, fontSize: '1.2rem' }}>
                        {formatPrice(workshop.priceCents)}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#1A0F0A', lineHeight: 1.3 }}>
                      {workshop.title}
                    </h3>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: '#8B7355', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>📅</span>
                        <span>{formatDate(workshop.date)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>⏰</span>
                        <span>{workshop.startTime} – {workshop.endTime}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span>📍</span>
                        <span>{workshop.venueName}, {workshop.city}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: '#C85A2A', fontWeight: 600 }}>
                        {spotsLeft} spots available
                      </span>
                      <span style={{ color: '#D47C0F', fontWeight: 600, fontSize: '0.875rem' }} className="group-hover:underline">
                        Book Now →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
