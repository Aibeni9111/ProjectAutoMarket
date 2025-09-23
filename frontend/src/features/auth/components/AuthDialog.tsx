import { useEffect, useState } from 'react'
import { auth, googleProvider } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { api } from '@/lib/api'

type Role = 'USER' | 'SELLER'
type Tab = 'login' | 'register'

type Props = {
  open: boolean
  onClose: () => void
  initialTab?: Tab
}

export default function AuthDialog({ open, onClose, initialTab = 'login' }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [role, setRole] = useState<Role>('USER') // регистрация: пользователь выбирает роль
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setTab(initialTab) }, [initialTab])
  useEffect(() => {
    if (!open) {

      setError(null)
      setLoading(false)
      setEmail(''); setPassword(''); setFirstName(''); setLastName('')
      setRole('USER')
    }
  }, [open])

  if (!open) return null

  async function applySellerRoleIfNeeded(uid: string) {

    if (role === 'SELLER') {
      try {
        await api.post(`/admin/set-role`, null, { params: { uid, role: 'SELLER' } })
        // форсим обновление токена — чтобы claim role подцепился на клиенте
        await auth.currentUser?.getIdToken(true)
      } catch (e) {
        console.warn('Failed to set SELLER role (local only endpoint).', e)
      }
    }
  }

  async function handleLoginEmail() {
    try {
      setLoading(true); setError(null)
      await signInWithEmailAndPassword(auth, email.trim(), password)
      onClose()

      const token = await auth.currentUser?.getIdTokenResult(true)
      const r = (token?.claims as any)?.role?.toString()?.toUpperCase()
      if (r === 'SELLER' || r === 'ADMIN') window.location.href = '/seller'
      else window.location.href = '/'
    } catch (e: any) {
      setError(e?.message ?? 'Login fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegisterEmail() {
    try {
      setLoading(true); setError(null)
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)

      if (firstName || lastName) {
        await updateProfile(cred.user, { displayName: `${firstName} ${lastName}`.trim() })
      }
      await applySellerRoleIfNeeded(cred.user.uid)
      onClose()

      const token = await auth.currentUser?.getIdTokenResult(true)
      const r = (token?.claims as any)?.role?.toString()?.toUpperCase()
      if (r === 'SELLER' || r === 'ADMIN') window.location.href = '/seller'
      else window.location.href = '/'
    } catch (e: any) {
      setError(e?.message ?? 'Registrierung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    try {
      setLoading(true); setError(null)
      const res = await signInWithPopup(auth, googleProvider)

      if (tab === 'register') {
        await applySellerRoleIfNeeded(res.user.uid)
      }
      onClose()
      const token = await auth.currentUser?.getIdTokenResult(true)
      const r = (token?.claims as any)?.role?.toString()?.toUpperCase()
      if (r === 'SELLER' || r === 'ADMIN') window.location.href = '/seller'
      else window.location.href = '/'
    } catch (e: any) {
      setError(e?.message ?? 'Aktion fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg ${tab==='login'?'bg-zinc-900 text-white':'bg-zinc-100'}`}
              onClick={() => setTab('login')}
            >
              Anmelden
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg ${tab==='register'?'bg-zinc-900 text-white':'bg-zinc-100'}`}
              onClick={() => setTab('register')}
            >
              Registrieren
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100">✕</button>
        </div>

        <div className="px-5 py-5">
          {tab === 'register' && (
            <div className="mb-4">
              <p className="text-sm text-zinc-600 mb-2">Rolle wählen</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setRole('USER')}
                  className={`px-3 py-2 rounded-xl border ${role==='USER'?'border-indigo-600 text-indigo-700':'border-zinc-200'}`}
                >
                  Käufer (USER)
                </button>
                <button
                  onClick={() => setRole('SELLER')}
                  className={`px-3 py-2 rounded-xl border ${role==='SELLER'?'border-indigo-600 text-indigo-700':'border-zinc-200'}`}
                >
                  Verkäufer (SELLER)
                </button>
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm text-zinc-600">Vorname</label>
                <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border" />
              </div>
              <div>
                <label className="text-sm text-zinc-600">Nachname</label>
                <input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border" />
              </div>
            </div>
          )}

          <div className="grid gap-3">
            <div>
              <label className="text-sm text-zinc-600">E-Mail</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border" />
            </div>
            <div>
              <label className="text-sm text-zinc-600">Passwort</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border" />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            {tab === 'login' ? (
              <button
                disabled={loading}
                onClick={handleLoginEmail}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? 'Bitte warten…' : 'Anmelden'}
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleRegisterEmail}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? 'Bitte warten…' : 'Registrieren'}
              </button>
            )}

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-zinc-500">oder</span>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleGoogle}
              className="w-full px-4 py-3 rounded-xl border bg-white hover:bg-zinc-50 disabled:opacity-60"
            >
              Mit Google {tab==='login'?'anmelden':'registrieren'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
