import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from './session-provider'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'AIssembly — IRL AI Workshops',
  description: 'Hands-on AI workshops for non-tech professionals. Book a session in your city today.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en">
      <body style={{ fontFamily: "'DM Sans', sans-serif", background: '#FDF6EC' }}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
