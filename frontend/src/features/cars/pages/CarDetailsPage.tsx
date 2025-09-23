import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Car } from '@/types/Car'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Button from '@/components/ui/Button'

export default function CarDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthed, role } = useAuth()
  const canEdit = isAuthed && (role === 'SELLER' || role === 'ADMIN')

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        setErr(null)
        setLoading(true)
        const res = await api.get(`/cars/${id}`)
        if (!isMounted) return
        setCar(res.data)
      } catch {
        if (!isMounted) return
        setErr('Unable to load car')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => { isMounted = false }
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this car?')) return
    await api.delete(`/cars/${id}`)
    navigate('/')
  }

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-60 bg-zinc-200 rounded-2xl" />
      <div className="h-6 w-48 bg-zinc-200 rounded" />
      <div className="h-4 w-72 bg-zinc-200 rounded" />
    </div>
  }

  if (err || !car) {
    return (
      <div className="space-y-4">
        <div className="text-red-600">{err ?? 'Not found'}</div>
        <Link to="/" className="text-indigo-700 hover:underline">← Back to list</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* верхняя панель  */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm text-zinc-600 hover:text-zinc-900">← Back</Link>
        <div className="ml-auto flex gap-2">
          {canEdit && (
            <>
              <Link
                to={`/cars/${car.id}/edit`}
                className="inline-flex items-center rounded-xl border px-3 py-2 text-sm bg-white hover:bg-zinc-50"
              >
                Edit
              </Link>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </>
          )}
        </div>
      </div>


      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="aspect-[16/9] bg-zinc-100">
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {car.make} {car.model}
          </h1>
          <div className="text-zinc-600">
            Year: <span className="font-medium text-zinc-800">{car.year}</span>
          </div>
          <div className="text-2xl font-semibold">
            € {car.priceEur.toLocaleString('de-AT')}
          </div>
          {car.description && (
            <p className="text-zinc-700 leading-relaxed">{car.description}</p>
          )}
          {car.createdAt && (
            <p className="text-xs text-zinc-500">
              Published {new Date(car.createdAt).toLocaleDateString('de-AT')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
