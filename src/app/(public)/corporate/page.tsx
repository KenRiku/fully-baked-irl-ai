'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  companyName: z.string().min(2, 'Required'),
  contactName: z.string().min(2, 'Required'),
  contactEmail: z.string().email('Valid email required'),
  phone: z.string().optional(),
  teamSize: z.coerce.number().min(2, 'Min 2').max(1000, 'Max 1000'),
  profession: z.string().min(2, 'Required'),
  preferredDates: z.string().optional(),
  message: z.string().min(20, 'Please provide more detail (min 20 chars)'),
})

type FormData = z.infer<typeof schema>

export default function CorporatePage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const d = await res.json()
        setError(d.error || 'Something went wrong.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '1rem' }}>
            Inquiry Received!
          </h1>
          <p style={{ color: '#8B7355', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Thank you for reaching out about corporate AI training. Our team will be in touch within 1 business day to discuss your team's needs.
          </p>
          <a href="/" style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '0.75rem', textDecoration: 'none', display: 'inline-block' }}>
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F5E6CC', color: '#D47C0F', padding: '0.375rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              🏢 Corporate Training
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, color: '#1A0F0A', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Upskill Your
              <span style={{ color: '#D47C0F', display: 'block' }}>Entire Team</span>
            </h1>
            <p style={{ color: '#8B7355', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              We bring fully baked AI workshops directly to your workplace — custom-built around your team's profession, workflows, and goals. No fluff, no code, just results.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { icon: '🎯', title: 'Custom Curriculum', desc: 'We design the workshop around your team\'s specific tools, workflows, and job roles.' },
                { icon: '📍', title: 'On-Site Delivery', desc: 'We come to you — no travel required. Your office, your schedule.' },
                { icon: '👥', title: 'Teams of 10–200+', desc: 'From small departments to company-wide rollouts. We scale to your needs.' },
                { icon: '📦', title: 'Everything Included', desc: 'Materials, prompt libraries, workbooks, and post-session support.' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '0.75rem', backgroundColor: '#F5E6CC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1A0F0A', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.title}</div>
                    <div style={{ color: '#8B7355', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#1A0F0A', color: '#FDF6EC', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>📞 Prefer to call?</div>
              <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>Available Mon–Fri, 9am–5pm across all US timezones.</p>
              <div style={{ color: '#D47C0F', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>hello@aissembly.co</div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid #F5E6CC', boxShadow: '0 8px 32px rgba(26,15,10,0.06)' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#1A0F0A', marginBottom: '0.5rem' }}>
                Request a Proposal
              </h2>
              <p style={{ color: '#8B7355', fontSize: '0.875rem', marginBottom: '2rem' }}>
                Fill in the details below and we'll be in touch within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Company Name *</label>
                    <input {...register('companyName')} style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none' }} placeholder="Acme Corp" />
                    {errors.companyName && <p style={{ color: '#C85A2A', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Contact Name *</label>
                    <input {...register('contactName')} style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none' }} placeholder="Jane Smith" />
                    {errors.contactName && <p style={{ color: '#C85A2A', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.contactName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Work Email *</label>
                    <input {...register('contactEmail')} type="email" style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none' }} placeholder="jane@company.com" />
                    {errors.contactEmail && <p style={{ color: '#C85A2A', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.contactEmail.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Phone</label>
                    <input {...register('phone')} type="tel" style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none' }} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Team Size *</label>
                    <input {...register('teamSize')} type="number" min={2} style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none' }} placeholder="25" />
                    {errors.teamSize && <p style={{ color: '#C85A2A', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.teamSize.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Profession / Role *</label>
                    <select {...register('profession')} style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white' }}>
                      <option value="">Select...</option>
                      <option>Accounting</option>
                      <option>HR</option>
                      <option>Marketing</option>
                      <option>Estate Agent</option>
                      <option>Legal</option>
                      <option>Mixed / Other</option>
                    </select>
                    {errors.profession && <p style={{ color: '#C85A2A', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.profession.message}</p>}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Preferred Dates / Timeframe</label>
                  <input {...register('preferredDates')} style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none' }} placeholder="e.g. Q2 2025, or specific dates" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Tell us about your team's needs *</label>
                  <textarea {...register('message')} rows={4} style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} placeholder="What challenges are you facing? What AI tools does your team use or want to use?" />
                  {errors.message && <p style={{ color: '#C85A2A', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.message.message}</p>}
                </div>

                {error && (
                  <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 700, padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 14px rgba(212, 124, 15, 0.35)' }}
                >
                  {submitting ? '⏳ Sending...' : 'Request a Proposal →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
