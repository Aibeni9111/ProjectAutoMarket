
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'


type Role = 'USER' | 'SELLER' | 'ADMIN'

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { isLoading, isAuthed, role } = useAuth()

  if (isLoading) {

    return null
  }

  if (!isAuthed) {
    return <Navigate to="/" replace />
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
