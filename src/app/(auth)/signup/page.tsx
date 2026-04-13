'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profession, setProfession] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, profession, city }),
      })

      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Signup failed.')
        setLoading(false)
        return
      }

      // Auto sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created but sign-in failed. Please log in manually.')
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🍪</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1A0F0A', marginBottom: '0.5rem' }}>
          Join AIssembly
        </h1>
        <p style={{ color: '#8B7355', fontSize: '0.9rem' }}>Create your free account to book workshops</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid #F5E6CC', boxShadow: '0 8px 32px rgba(26,15,10,0.06)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.625rem', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.625rem', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.625rem', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>Profession</label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.625rem', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
              >
                <option value="">Select...</option>
                <option>Accounting</option>
                <option>HR</option>
                <option>Marketing</option>
                <option>Estate Agent</option>
                <option>Legal</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1A0F0A', marginBottom: '0.375rem' }}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #F5E6CC', borderRadius: '0.625rem', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                placeholder="Nashville"
              />
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#D47C0F', color: '#FDF6EC', fontWeight: 700, padding: '0.875rem', borderRadius: '0.75rem', fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.25rem', boxShadow: '0 4px 14px rgba(212, 124, 15, 0.3)' }}
          >
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F5E6CC' }}>
          <p style={{ color: '#8B7355', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#D47C0F', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
