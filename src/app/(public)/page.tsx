import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getFeaturedWorkshops() {
  try {
    return await prisma.workshop.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { date: 'asc' },
      take: 6,
    })
  } catch {
    return []
  }
}

const professionData: Record<string, { emoji: string; color: string; bg: string }> = {
  Accounting: { emoji: '📊', color: '#1A0F0A', bg: '#F5E6CC' },
  HR: { emoji: '👥', color: '#1A0F0A', bg: '#FCE8DD' },
  Marketing: { emoji: '📣', color: '#1A0F0A', bg: '#FDE8D0' },
  'Estate Agent': { emoji: '🏡', color: '#1A0F0A', bg: '#E8F5E9' },
  Legal: { emoji: '⚖️', color: '#1A0F0A', bg: '#EDE7F6' },
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

export default async function HomePage() {
  const workshops = await getFeaturedWorkshops()

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#FDF6EC', paddingTop: '5rem', paddingBottom: '5rem', borderBottom: '2px solid #F5E6CC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F5E6CC', color: '#D47C0F', padding: '0.375rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              <span>🍪</span> Fully Baked: IRL AI
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, color: '#1A0F0A', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              AI Skills, Baked Fresh
              <span style={{ color: '#D47C0F', display: 'block' }}>For Your Profession</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#8B7355', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Hands-on, in-person AI workshops designed for accountants, HR managers, estate agents, and marketers.
              No jargon. No fluff. Just practical skills you can use Monday morning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/workshops"
                style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '0.75rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.35)' }}
                className="hover:opacity-90 transition-opacity"
              >
                Browse Workshops →
              </Link>
              <Link
                href="/corporate"
                style={{ backgroundColor: 'transparent', color: '#1A0F0A', fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '0.75rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none', border: '2px solid #1A0F0A' }}
                className="hover:bg-stone-100 transition-colors"
              >
                Corporate Training
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'Professionals Trained' },
              { number: '12', label: 'Cities Nationwide' },
              { number: '4', label: 'Professions Covered' },
              { number: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #F5E6CC' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#D47C0F' }}>{stat.number}</div>
                <div style={{ fontSize: '0.8rem', color: '#8B7355', fontWeight: 500, marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FDF6EC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '0.75rem' }}>
              Who We Serve
            </h2>
            <p style={{ color: '#8B7355', fontSize: '1rem' }}>Profession-specific AI workshops — no tech background required</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { profession: 'Accounting', emoji: '📊', desc: 'Automate reconciliations, write better reports, draft client emails with AI.' },
              { profession: 'HR', emoji: '👥', desc: 'Screen candidates faster, craft job descriptions, and streamline onboarding.' },
              { profession: 'Marketing', emoji: '📣', desc: 'Generate campaigns, write copy at scale, analyze data without a data team.' },
              { profession: 'Estate Agent', emoji: '🏡', desc: 'Write listings faster, respond to leads, and market properties smarter.' },
            ].map((item) => (
              <Link
                key={item.profession}
                href={`/workshops?profession=${encodeURIComponent(item.profession)}`}
                style={{ backgroundColor: 'white', border: '2px solid #F5E6CC', borderRadius: '1.25rem', padding: '1.75rem', textDecoration: 'none', display: 'block' }}
                className="hover:border-amber-400 hover:shadow-md transition-all group"
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '0.5rem' }}>
                  {item.profession}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#8B7355', lineHeight: 1.6 }}>{item.desc}</p>
                <div style={{ color: '#D47C0F', fontWeight: 600, fontSize: '0.825rem', marginTop: '1rem' }} className="group-hover:underline">
                  View workshops →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workshops */}
      {workshops.length > 0 && (
        <section style={{ padding: '5rem 0', backgroundColor: '#F5E6CC' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '0.5rem' }}>
                  Upcoming Workshops
                </h2>
                <p style={{ color: '#8B7355' }}>Fresh dates. Real rooms. Practical skills.</p>
              </div>
              <Link href="/workshops" style={{ color: '#D47C0F', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }} className="hidden md:block hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => {
                const pd = professionData[workshop.profession] || { emoji: '🧠', color: '#1A0F0A', bg: '#F5E6CC' }
                return (
                  <Link
                    key={workshop.id}
                    href={`/workshops/${workshop.id}`}
                    style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #F5E6CC', overflow: 'hidden', textDecoration: 'none', display: 'block' }}
                    className="hover:shadow-xl transition-all group"
                  >
                    <div style={{ backgroundColor: pd.bg, padding: '1.75rem', borderBottom: '1px solid #F5E6CC' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ backgroundColor: 'white', color: pd.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {pd.emoji} {workshop.profession}
                        </span>
                        <span style={{ color: '#1A0F0A', fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(workshop.priceCents)}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1A0F0A', lineHeight: 1.3 }}>
                        {workshop.title}
                      </h3>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.825rem', color: '#8B7355', marginBottom: '1rem' }}>
                        <div>📅 {formatDate(workshop.date)}</div>
                        <div>⏰ {workshop.startTime} – {workshop.endTime}</div>
                        <div>📍 {workshop.venueName}, {workshop.city}</div>
                      </div>
                      <div style={{ color: '#D47C0F', fontWeight: 600, fontSize: '0.875rem' }} className="group-hover:underline">
                        Book Now →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Corporate CTA */}
      <section style={{ padding: '5rem 0', backgroundColor: '#1A0F0A' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#FDF6EC', marginBottom: '1rem' }}>
            Training Your Whole Team?
          </h2>
          <p style={{ color: '#8B7355', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            We offer private, on-site AI workshops for teams of 10 or more. Custom curriculum, your location, your schedule.
          </p>
          <Link
            href="/corporate"
            style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '1rem 2.5rem', borderRadius: '0.75rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.4)' }}
            className="hover:opacity-90 transition-opacity"
          >
            Request Corporate Training
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FDF6EC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700, color: '#1A0F0A', textAlign: 'center', marginBottom: '3rem' }}>
            What Our Graduates Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I came in knowing nothing about AI. I left with 12 prompts I use every single day in my accounting work. Worth every penny.",
                name: "Sarah Chen",
                role: "Senior Accountant, Nashville",
                emoji: "📊"
              },
              {
                quote: "The HR workshop changed how I write job descriptions. What used to take me 2 hours now takes 15 minutes — and they're better.",
                name: "Marcus Williams",
                role: "HR Manager, Chicago",
                emoji: "👥"
              },
              {
                quote: "Finally, AI training that doesn't assume I'm a programmer. The facilitator was brilliant and the material was spot-on.",
                name: "Jennifer Park",
                role: "Marketing Director, Atlanta",
                emoji: "📣"
              },
            ].map((t) => (
              <div key={t.name} style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1.25rem', padding: '2rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</div>
                <p style={{ color: '#1A0F0A', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#F5E6CC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1A0F0A', fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ color: '#8B7355', fontSize: '0.75rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
