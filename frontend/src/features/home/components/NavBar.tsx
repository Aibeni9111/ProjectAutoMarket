import { useEffect, useState } from 'react'
import { auth, googleProvider } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useAuth } from '@/features/auth/hooks/useAuth'
import AuthDialog from '@/features/auth/components/AuthDialog'

export default function NavBar() {
  const [email, setEmail] = useState<string | null>(null)
  const { isAuthed, role } = useAuth()
  const canEdit = isAuthed && (role === 'SELLER' || role === 'ADMIN')

  const [openAuth, setOpenAuth] = useState(false)
  const [initTab, setInitTab] = useState<'login'|'register'>('login')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setEmail(u?.email ?? null))
    return () => unsub()
  }, [])

  function openLogin() { setInitTab('login'); setOpenAuth(true) }
  function openRegister() { setInitTab('register'); setOpenAuth(true) }

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/30"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 12,
          borderBottom: '1px solid #eee',
        }}
      >
        <a href="/" className="font-bold text-lg text-indigo-700" style={{ textDecoration:'none' }}>
          AutoMarket
        </a>


        <div className="hidden md:flex items-center gap-2">
          <a href="/" className="px-3 py-2 rounded-lg hover:bg-zinc-100">Home</a>
          <a href="/#suche" className="px-3 py-2 rounded-lg hover:bg-zinc-100">Suche</a>
          <a href="/#kontakt" className="px-3 py-2 rounded-lg hover:bg-zinc-100">Kontakt</a>
        </div>

        <div style={{ marginLeft: 'auto' }} className="flex items-center gap-2">
          <a href={import.meta.env.VITE_API_DOCS} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg hover:bg-zinc-100">
            API
          </a>

          {canEdit && (
            <a
              href="/cars/new"
              className="px-3 py-2 rounded-xl border hover:bg-zinc-50"
            >
              + Inserat
            </a>
          )}

          {email ? (
            <>
              <a href="/me" className="px-3 py-2 rounded-lg hover:bg-zinc-100">{email}</a>
              {(role === 'SELLER' || role === 'ADMIN') && (
                <a href="/seller" className="px-3 py-2 rounded-lg hover:bg-zinc-100">Seller</a>
              )}
              <button
                onClick={() => signOut(auth)}
                className="px-3 py-2 rounded-xl border bg-white hover:bg-zinc-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={openLogin} className="px-3 py-2 rounded-xl border bg-white hover:bg-zinc-50">
                Anmelden
              </button>
              <button onClick={openRegister} className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
                Registrieren
              </button>
            </>
          )}
        </div>
      </nav>

      <AuthDialog open={openAuth} onClose={()=>setOpenAuth(false)} initialTab={initTab} />
    </>
  )
}
