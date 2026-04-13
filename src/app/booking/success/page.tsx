import { Suspense } from 'react'
import SuccessContent from './success-content'

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍪</div>
          <p style={{ color: '#8B7355' }}>Confirming your booking...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
