'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewWorkshopPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    profession: '',
    city: '',
    venueName: '',
    venueAddress: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    capacity: 20,
    priceCents: 29900,
    description: '',
    curriculumOutline: '',
    facilitatorName: '',
    facilitatorBio: '',
    status: 'DRAFT',
  })

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: new Date(form.date).toISOString(),
          capacity: Number(form.capacity),
          priceCents: Number(form.priceCents),
        }),
      })
      if (res.ok) {
        router.push('/admin/workshops')
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to create workshop.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/workshops" style={{ color: '#8B7355', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Workshops
        </Link>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '2rem' }}>
        New Workshop
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic Info */}
          <Section title="Basic Information">
            <Field label="Workshop Title *">
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="AI Prompting for Accountants: From Basics to Billing" style={inputStyle} />
            </Field>
            <TwoCol>
              <Field label="Profession *">
                <select required value={form.profession} onChange={(e) => set('profession', e.target.value)} style={inputStyle}>
                  <option value="">Select...</option>
                  {['Accounting', 'HR', 'Marketing', 'Estate Agent', 'Legal'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => set('status', e.target.value)} style={inputStyle}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </Field>
            </TwoCol>
            <Field label="Description *">
              <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What will attendees learn and experience?" style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
            <Field label="Curriculum Outline">
              <textarea rows={5} value={form.curriculumOutline} onChange={(e) => set('curriculumOutline', e.target.value)} placeholder="Session 1: Introduction to AI tools&#10;Session 2: Prompt engineering basics&#10;..." style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
          </Section>

          {/* Venue & Schedule */}
          <Section title="Venue & Schedule">
            <TwoCol>
              <Field label="City *">
                <input required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Nashville" style={inputStyle} />
              </Field>
              <Field label="Venue Name *">
                <input required value={form.venueName} onChange={(e) => set('venueName', e.target.value)} placeholder="The Workshop Hub" style={inputStyle} />
              </Field>
            </TwoCol>
            <Field label="Venue Address *">
              <input required value={form.venueAddress} onChange={(e) => set('venueAddress', e.target.value)} placeholder="123 Main St, Nashville, TN 37201" style={inputStyle} />
            </Field>
            <TwoCol>
              <Field label="Date *">
                <input required type="date" value={form.date} onChange={(e) => set('date', e.target.value)} style={inputStyle} />
              </Field>
              <TwoCol>
                <Field label="Start Time">
                  <input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} style={inputStyle} />
                </Field>
                <Field label="End Time">
                  <input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} style={inputStyle} />
                </Field>
              </TwoCol>
            </TwoCol>
          </Section>

          {/* Pricing & Capacity */}
          <Section title="Pricing & Capacity">
            <TwoCol>
              <Field label="Capacity (seats) *">
                <input required type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value))} style={inputStyle} />
              </Field>
              <Field label="Price (in cents) *">
                <input required type="number" min={100} value={form.priceCents} onChange={(e) => set('priceCents', parseInt(e.target.value))} style={inputStyle} />
                <p style={{ color: '#8B7355', fontSize: '0.75rem', marginTop: '0.25rem' }}>e.g. 29900 = $299</p>
              </Field>
            </TwoCol>
          </Section>

          {/* Facilitator */}
          <Section title="Facilitator (Optional)">
            <Field label="Facilitator Name">
              <input value={form.facilitatorName} onChange={(e) => set('facilitatorName', e.target.value)} placeholder="Jane Smith" style={inputStyle} />
            </Field>
            <Field label="Facilitator Bio">
              <textarea rows={3} value={form.facilitatorBio} onChange={(e) => set('facilitatorBio', e.target.value)} placeholder="Brief bio of the workshop facilitator..." style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
          </Section>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.875rem', borderRadius: '0.625rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 700, padding: '0.875rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.3)' }}
            >
              {saving ? '⏳ Creating...' : 'Create Workshop'}
            </button>
            <Link href="/admin/workshops" style={{ backgroundColor: 'white', color: '#1A0F0A', fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '0.75rem', textDecoration: 'none', border: '2px solid #F5E6CC', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #F5E6CC',
  borderRadius: '0.625rem',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  backgroundColor: 'white',
  boxSizing: 'border-box',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #F5E6CC', borderRadius: '1rem', padding: '1.75rem' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F5E6CC' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>{label}</label>
      {children}
    </div>
  )
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>
}
