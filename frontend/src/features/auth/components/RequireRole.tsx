import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'


type Props = {
  roles: Array<'SELLER' | 'ADMIN'>
  children: ReactNode
}

export default function RequireRole({ roles, children }: Props) {
  const { isLoading, isAuthed, role } = useAuth()
  const loc = useLocation()

  if (isLoading) return <div>Checking access…</div>
  if (!isAuthed) return <Navigate to="/me" state={{ from: loc }} replace />


  const allowed = roles.some(r => r === role)
  if (!allowed) return <div style={{ padding: 16 }}>403 — Forbidden</div>

  return <>{children}</>
}
