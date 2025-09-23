import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { api } from '@/lib/api'

type Who = { principal: string; authorities: string[] }

export default function MePage() {
  const [uid, setUid] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [who, setWho] = useState<Who | null>(null)
  const [role, setRole] = useState<string>('UNKNOWN')
  const [msg, setMsg] = useState<string | null>(null)

  async function fetchWhoAmI() {
    setMsg(null)
    try {
      const res = await api.get<Who>('/whoami')
      setWho(res.data)
    } catch (e: any) {
      setMsg(e?.response?.data?.message || e?.message || 'whoami failed')
    }
  }

  async function refreshToken() {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true) // форс-обновление, тянет свежие custom claims
      setMsg('Token refreshed')
    }
  }

  // ВРЕМЕННО: назначение роли через наш локальный /admin/set-role
  async function setSeller() {
    if (!uid) return
    setMsg(null)
    try {
      await fetch(`http://localhost:8080/admin/set-role?uid=${uid}&role=SELLER`, { method: 'POST' })
      setMsg('Custom claim role=SELLER set. Now click "Refresh token" and then "Check whoami".')
    } catch {
      setMsg('Failed to call /admin/set-role')
    }
  }
  async function setAdmin() {
    if (!uid) return
    setMsg(null)
    try {
      await fetch(`/admin/set-role?uid=${uid}&role=${role}`, { method: 'POST' })
      setMsg('Custom claim role=ADMIN set. Now click "Refresh token" and then "Check whoami".')
    } catch {
      setMsg('Failed to call /admin/set-role')
    }
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUid(u?.uid ?? null)
      setEmail(u?.email ?? null)
      // попытаемся прочитать роль из токена прямо на клиенте
      if (u) {
        const token = await u.getIdTokenResult()
        const r = (token.claims as any).role as string | undefined
        setRole(r ? r : 'USER') // по умолчанию USER
      } else {
        setRole('ANON')
      }
    })
    return () => unsub()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Me</h1>
      <div className="rounded-2xl border bg-white p-4 text-sm">
        <div><b>UID:</b> {uid ?? '—'}</div>
        <div><b>Email:</b> {email ?? '—'}</div>
        <div><b>Client role claim:</b> {role}</div>
        <div><b>Server whoami:</b> {who ? JSON.stringify(who) : '—'}</div>
      </div>

      {msg && <div className="text-rose-600 text-sm">{msg}</div>}

      <div className="flex gap-3">
        <button onClick={fetchWhoAmI} className="px-3 py-2 rounded-xl bg-slate-900 text-white">
          Check whoami (server)
        </button>
        <button onClick={refreshToken} className="px-3 py-2 rounded-xl bg-indigo-600 text-white">
          Refresh token
        </button>
        <button onClick={setSeller} className="px-3 py-2 rounded-xl bg-emerald-600 text-white">
          Become SELLER (debug)
        </button>
        <button onClick={setAdmin} className="px-3 py-2 rounded-xl bg-amber-600 text-white">
          Become ADMIN (debug)
        </button>
      </div>
    </div>
  )
}
