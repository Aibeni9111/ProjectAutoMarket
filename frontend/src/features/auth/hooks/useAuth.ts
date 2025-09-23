
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export type Role = 'USER' | 'SELLER' | 'ADMIN'

export function useAuth() {
  const [isLoading, setLoading] = useState(true)
  const [isAuthed, setAuthed] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<Role>('USER')
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setLoading(true)
        if (!u) {
          setAuthed(false)
          setEmail(null)
          setUid(null)
          setRole('USER')
          return
        }
        setAuthed(true)
        setEmail(u.email ?? null)
        setUid(u.uid)
        // Обновим токен и вытащим кастомные claims
        const token = await u.getIdTokenResult(true)
        const r = (token.claims?.role as string | undefined)?.toUpperCase() as Role | undefined
        setRole(r ?? 'USER')
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  return { isLoading, isAuthed, email, role, uid }
}
