import { useEffect, useState } from 'react'
import ImageUploader from '@/features/upload/ImageUploader'
import { useAuth } from '@/features/auth/hooks/useAuth'

export type CarFormValues = {
  make: string
  model: string
  year: number
  priceEur: number
  imageUrl: string
  description?: string
}

type Props = {
  initial?: Partial<CarFormValues>
  submitLabel?: string
  onSubmit: (values: CarFormValues) => Promise<void> | void
}

export default function CarForm({ initial, submitLabel = 'Save', onSubmit }: Props) {

  const [make, setMake] = useState(initial?.make ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [year, setYear] = useState<number>(initial?.year ?? new Date().getFullYear())
  const [priceEur, setPriceEur] = useState<number>(initial?.priceEur ?? 0)
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { uid } = useAuth()


  useEffect(() => {
    if (initial) {
      if (initial.make !== undefined) setMake(initial.make)
      if (initial.model !== undefined) setModel(initial.model)
      if (initial.year !== undefined) setYear(initial.year)
      if (initial.priceEur !== undefined) setPriceEur(initial.priceEur)
      if (initial.imageUrl !== undefined) setImageUrl(initial.imageUrl)
      if (initial.description !== undefined) setDescription(initial.description)
    }
  }, [initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await onSubmit({ make, model, year, priceEur, imageUrl, description })
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
      {error && <div className="text-red-600">{error}</div>}

      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Make</span>
        <input className="border rounded-lg px-3 py-2" value={make} onChange={e => setMake(e.target.value)} required />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Model</span>
        <input className="border rounded-lg px-3 py-2" value={model} onChange={e => setModel(e.target.value)} required />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Year</span>
        <input type="number" className="border rounded-lg px-3 py-2" value={year}
               onChange={e => setYear(Number(e.target.value))} min={1950} max={2100} required />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Price (EUR)</span>
        <input type="number" className="border rounded-lg px-3 py-2" value={priceEur}
               onChange={e => setPriceEur(Number(e.target.value))} min={0} required />
      </label>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700">Bild</label>


        <ImageUploader uid={uid} value={imageUrl} onChange={setImageUrl}/>


        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="oder füge eine Bild-URL ein"
          className="w-full px-3 py-2 rounded-xl border"
        />
      </div>

      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Description (optional)</span>
        <textarea className="border rounded-lg px-3 py-2" value={description}
                  onChange={e => setDescription(e.target.value)} rows={4}/>
      </label>

      <div className="flex gap-2">
        <button type="submit" disabled={busy}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
          {submitLabel}
        </button>
        <a href="/" className="px-4 py-2 rounded-xl border">Cancel</a>
      </div>
    </form>
  )

}
