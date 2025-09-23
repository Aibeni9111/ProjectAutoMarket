import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Car } from '@/types/Car'

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState<number>(2020)
  const [priceEur, setPriceEur] = useState<number>(0)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setErr(null)
        const res = await api.get<Car>(`/cars/${id}`)
        const c = res.data
        setMake(c.make)
        setModel(c.model)
        setYear(c.year)
        setPriceEur(c.priceEur)
        setImageUrl(c.imageUrl)
        setDescription(c.description ?? '')
      } catch (e) {
        setErr('Не удалось загрузить авто')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault()
    try {
      setErr(null)
      await api.put(`/cars/${id}`, {
        make,
        model,
        year: +year,
        priceEur: +priceEur,
        imageUrl,
        description,
      })
      navigate(`/cars/${id}`)
    } catch (e: any) {
      setErr(e?.response?.data || 'Request failed')
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit car</h1>
      {err && <div className="mb-3 text-red-600">{String(err)}</div>}

      <form className="grid gap-3" onSubmit={onUpdate}>
        <input className="border rounded px-3 py-2" value={make} onChange={e=>setMake(e.target.value)} placeholder="Make" />
        <input className="border rounded px-3 py-2" value={model} onChange={e=>setModel(e.target.value)} placeholder="Model" />
        <input className="border rounded px-3 py-2" type="number" value={year} onChange={e=>setYear(+e.target.value)} placeholder="Year" />
        <input className="border rounded px-3 py-2" type="number" value={priceEur} onChange={e=>setPriceEur(+e.target.value)} placeholder="Price EUR" />
        <input className="border rounded px-3 py-2" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL" />
        <textarea className="border rounded px-3 py-2" rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-indigo-600 text-white">Update</button>
          <a className="px-4 py-2 rounded border" href={`/cars/${id}`}>Cancel</a>
        </div>
      </form>
    </div>
  )
}
