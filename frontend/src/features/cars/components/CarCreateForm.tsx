import { useMemo, useState } from 'react'
import { api } from '@/lib/api'
import ImageUploader from '@/features/upload/ImageUploader'
import { useAuth } from '@/features/auth/hooks/useAuth'

type Props = {
  onCreated: (id: number) => void
}

export default function CarCreateForm({ onCreated }: Props) {
  const currentYear = new Date().getFullYear()
  const { uid } = useAuth() // ← нужен для путей в Supabase

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState<number | ''>('' as any)
  const [priceEur, setPriceEur] = useState<number | ''>('' as any)
  const [imageUrl, setImageUrl] = useState('')          // ← сюда кладём URL из аплоада
  const [description, setDescription] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const isValidUrl = useMemo(() => {
    if (!imageUrl) return false
    try { new URL(imageUrl); return true } catch { return false }
  }, [imageUrl])

  const canSubmit =
    make.trim().length > 0 &&
    model.trim().length > 0 &&
    typeof year === 'number' &&
    year >= 1950 && year <= currentYear + 1 &&
    typeof priceEur === 'number' && priceEur >= 0 &&
    isValidUrl // ← нужна валидная ссылка (либо из аплоада, либо ручная)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    setOk(null)
    try {
      const payload = {
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        priceEur: Number(priceEur),
        imageUrl: imageUrl.trim(),   // ← из стейта (после аплоада тут уже публичный URL)
        description: description.trim(),
      }
      const res = await api.post('/cars', payload)
      const id = res.data?.id as number | undefined
      setOk('Inserat wurde erstellt.')
      if (id) onCreated(id)
    } catch (err: any) {
      setError(err?.response?.data || 'Fehler beim Speichern')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-[1fr,360px]">
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Marke" required>
              <input
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="z. B. Toyota"
                className="px-3 py-2 rounded-xl border w-full"
                maxLength={64}
              />
            </Field>
            <Field label="Modell" required>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="z. B. Corolla"
                className="px-3 py-2 rounded-xl border w-full"
                maxLength={64}
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Baujahr" required hint={`1950–${currentYear + 1}`}>
              <input
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={`${currentYear}`}
                className="px-3 py-2 rounded-xl border w-full"
              />
            </Field>

            <Field label="Preis (EUR)" required>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400">€</span>
                <input
                  inputMode="numeric"
                  value={priceEur}
                  onChange={(e) => setPriceEur(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="15000"
                  className="pl-7 pr-3 py-2 rounded-xl border w-full"
                />
              </div>
            </Field>


            <Field label="Bild" hint="Upload oder URL einfügen">
              <div className="space-y-2">

                <ImageUploader uid={uid} value={imageUrl} onChange={setImageUrl} />


                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className="px-3 py-2 rounded-xl border w-full"
                />
              </div>
            </Field>
          </div>

          <Field label="Beschreibung">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurzbeschreibung des Fahrzeugs…"
              className="px-3 py-2 rounded-xl border w-full min-h-[120px] resize-vertical"
              maxLength={5000}
            />
          </Field>
        </div>


        <div>
          <div className="rounded-xl border bg-zinc-50 overflow-hidden">
            <div className="p-3 border-b">
              <div className="text-sm font-medium">Vorschau</div>
              <div className="text-xs text-zinc-500">So sieht das Titelbild aus</div>
            </div>
            <div className="aspect-[16/9] bg-zinc-100">
              {isValidUrl ? (
                <img src={imageUrl} alt="Vorschau" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                  Bild hochladen oder URL einfügen
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="text-lg font-semibold leading-tight">
                {make || 'Marke'} {model || 'Modell'}
              </div>
              <div className="text-zinc-500">{year || 'Jahr'}</div>
              <div className="mt-1 font-semibold">
                {typeof priceEur === 'number' ? `€ ${priceEur.toLocaleString('de-AT')}` : '€ —'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700">{String(error)}</div>}
      {ok && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">{ok}</div>}

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-500">Mit * gekennzeichnete Felder sind erforderlich.</div>
        <div className="flex gap-2">
          <a href="/seller" className="px-4 py-2 rounded-xl border hover:bg-white">Abbrechen</a>
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={`px-4 py-2 rounded-xl text-white shadow-sm ${
              !canSubmit || submitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {submitting ? 'Speichern…' : 'Inserat erstellen'}
          </button>
        </div>
      </div>
    </form>
  )
}


function Field({
                 label,
                 required,
                 hint,
                 children,
               }: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="ml-auto text-xs text-zinc-400">{hint}</span>}
      </div>
      {children}
    </label>
  )
}
