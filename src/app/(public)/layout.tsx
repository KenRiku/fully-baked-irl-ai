import Navbar from '@/components/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EC' }}>
      <Navbar />
      <main>{children}</main>
      <footer style={{ backgroundColor: '#1A0F0A', color: '#FDF6EC' }} className="mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🍪</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>AIssembly</span>
              </div>
              <p style={{ color: '#8B7355', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Hands-on AI workshops baked fresh for non-tech professionals. Learn practical AI skills in a warm, welcoming environment.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#D47C0F', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workshops</h4>
              <ul style={{ color: '#8B7355', fontSize: '0.875rem' }} className="space-y-2">
                <li><a href="/workshops" className="hover:text-amber-400 transition-colors">Browse All</a></li>
                <li><a href="/workshops?profession=Accounting" className="hover:text-amber-400 transition-colors">For Accountants</a></li>
                <li><a href="/workshops?profession=HR" className="hover:text-amber-400 transition-colors">For HR Managers</a></li>
                <li><a href="/workshops?profession=Marketing" className="hover:text-amber-400 transition-colors">For Marketers</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#D47C0F', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</h4>
              <ul style={{ color: '#8B7355', fontSize: '0.875rem' }} className="space-y-2">
                <li><a href="/corporate" className="hover:text-amber-400 transition-colors">Corporate Training</a></li>
                <li><a href="/login" className="hover:text-amber-400 transition-colors">Sign In</a></li>
                <li><a href="/signup" className="hover:text-amber-400 transition-colors">Create Account</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2D1810', paddingTop: '1.5rem', textAlign: 'center', color: '#8B7355', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} AIssembly. All rights reserved. Fully Baked: IRL AI.
          </div>
        </div>
      </footer>
    </div>
  )
}
