'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditWorkshopPage() {
  const router = useRouter()
  const { id } = useParams()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

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

  useEffect(() => {
    fetch(`/api/workshops/${id}`)
      .then((r) => r.json())
      .then((ws) => {
        setForm({
          title: ws.title || '',
          profession: ws.profession || '',
          city: ws.city || '',
          venueName: ws.venueName || '',
          venueAddress: ws.venueAddress || '',
          date: ws.date ? new Date(ws.date).toISOString().split('T')[0] : '',
          startTime: ws.startTime || '09:00',
          endTime: ws.endTime || '17:00',
          capacity: ws.capacity || 20,
          priceCents: ws.priceCents || 29900,
          description: ws.description || '',
          curriculumOutline: ws.curriculumOutline || '',
          facilitatorName: ws.facilitatorName || '',
          facilitatorBio: ws.facilitatorBio || '',
          status: ws.status || 'DRAFT',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/workshops/${id}`, {
        method: 'PUT',
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
        setError(d.error || 'Failed to update workshop.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workshop? This cannot be undone.')) return
    setDeleting(true)
    try {
      await fetch(`/api/workshops/${id}`, { method: 'DELETE' })
      router.push('/admin/workshops')
    } catch {
      setError('Delete failed.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>🍪</div>
        <p style={{ color: '#8B7355', marginTop: '1rem' }}>Loading workshop...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href="/admin/workshops" style={{ color: '#8B7355', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Workshops
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
        >
          {deleting ? 'Deleting...' : 'Delete Workshop'}
        </button>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '2rem' }}>
        Edit Workshop
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title="Basic Information">
            <Field label="Workshop Title *">
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} style={inputStyle} />
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
              <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
            <Field label="Curriculum Outline">
              <textarea rows={5} value={form.curriculumOutline} onChange={(e) => set('curriculumOutline', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
          </Section>

          <Section title="Venue & Schedule">
            <TwoCol>
              <Field label="City *">
                <input required value={form.city} onChange={(e) => set('city', e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Venue Name *">
                <input required value={form.venueName} onChange={(e) => set('venueName', e.target.value)} style={inputStyle} />
              </Field>
            </TwoCol>
            <Field label="Venue Address *">
              <input required value={form.venueAddress} onChange={(e) => set('venueAddress', e.target.value)} style={inputStyle} />
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

          <Section title="Pricing & Capacity">
            <TwoCol>
              <Field label="Capacity *">
                <input required type="number" min={1} value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value))} style={inputStyle} />
              </Field>
              <Field label="Price (cents) *">
                <input required type="number" min={100} value={form.priceCents} onChange={(e) => set('priceCents', parseInt(e.target.value))} style={inputStyle} />
              </Field>
            </TwoCol>
          </Section>

          <Section title="Facilitator">
            <Field label="Name">
              <input value={form.facilitatorName} onChange={(e) => set('facilitatorName', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Bio">
              <textarea rows={3} value={form.facilitatorBio} onChange={(e) => set('facilitatorBio', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>
          </Section>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.875rem', borderRadius: '0.625rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 700, padding: '0.875rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontSize: '0.95rem' }}>
              {saving ? '⏳ Saving...' : 'Save Changes'}
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
