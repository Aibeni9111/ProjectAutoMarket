import { Car } from '@/types/Car'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { api } from '@/lib/api'

type Props = {
  items: Car[]
  onDeleted?: (id: number) => void
}

export default function CardGrid({ items, onDeleted }: Props) {
  const { isAuthed, role } = useAuth()
  const canEdit = isAuthed && (role === 'SELLER' || role === 'ADMIN')

  async function handleDelete(id: number) {
    if (!confirm('Delete this car?')) return
    await api.delete(`/cars/${id}`)
    onDeleted?.(id)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
      {items.map((car) => (
        <article key={car.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <a href={`/cars/${car.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ aspectRatio: '16/9', background: '#eee', overflow: 'hidden' }}>
              <img
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: 12 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>{car.make} {car.model}</h3>
              <p style={{ margin: '0 0 8px', color: '#555' }}>{car.year}</p>
              <strong style={{ fontSize: 18 }}>€ {car.priceEur.toLocaleString('de-AT')}</strong>
            </div>
          </a>

          {canEdit && (
            <div style={{ display: 'flex', gap: 8, margin: '12px', marginTop: 0 }}>
              <a
                href={`/cars/${car.id}/edit`}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 10, textDecoration: 'none' }}
              >
                Edit
              </a>
              <button
                onClick={() => handleDelete(car.id!)}
                style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #f1c2c2', background: '#ffe5e5', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
