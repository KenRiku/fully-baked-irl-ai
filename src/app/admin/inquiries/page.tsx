import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

async function getInquiries() {
  try {
    return await prisma.corporateInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusColors: Record<string, { bg: string; text: string }> = {
  NEW: { bg: '#DBEAFE', text: '#1E40AF' },
  CONTACTED: { bg: '#D1FAE5', text: '#065F46' },
  CLOSED: { bg: '#F3F4F6', text: '#374151' },
}

export default async function InquiriesPage() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/login')

  const inquiries = await getInquiries()
  const newCount = inquiries.filter((i) => i.status === 'NEW').length

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.25rem' }}>
          Corporate Inquiries
        </h1>
        <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
          {newCount > 0 ? `${newCount} new inquiry${newCount !== 1 ? 'ies' : 'y'} awaiting response` : `${inquiries.length} total inquiries`}
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid #F5E6CC', color: '#8B7355' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
          <p>No corporate inquiries yet. They'll show up here when companies submit the form.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {inquiries.map((inquiry) => {
            const sc = statusColors[inquiry.status] || { bg: '#F3F4F6', text: '#374151' }
            return (
              <div key={inquiry.id} style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1A0F0A', fontSize: '1.1rem' }}>
                        {inquiry.companyName}
                      </h3>
                      <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '0.2rem 0.625rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {inquiry.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#8B7355' }}>
                      <span>👤 {inquiry.contactName}</span>
                      <span>📧 {inquiry.contactEmail}</span>
                      {inquiry.phone && <span>📞 {inquiry.phone}</span>}
                      <span>👥 Team of {inquiry.teamSize}</span>
                      <span>🏷️ {inquiry.profession}</span>
                      <span>📅 Submitted {formatDate(inquiry.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {inquiry.preferredDates && (
                  <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8B7355', fontWeight: 600 }}>Preferred dates: </span>
                    <span style={{ color: '#1A0F0A' }}>{inquiry.preferredDates}</span>
                  </div>
                )}

                <div style={{ backgroundColor: '#FDF6EC', borderRadius: '0.625rem', padding: '1rem', fontSize: '0.875rem', color: '#4B3832', lineHeight: 1.7 }}>
                  {inquiry.message}
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                  <a
                    href={`mailto:${inquiry.contactEmail}?subject=Re: Corporate AI Training for ${inquiry.companyName}`}
                    style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
