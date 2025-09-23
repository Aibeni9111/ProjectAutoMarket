// src/features/upload/ImageUploader.tsx
import { useState } from 'react'
import { uploadImageToSupabase } from './uploadToSupabase'

type Props = {
  value?: string
  onChange: (url: string) => void
  uid: string | null
}

export default function ImageUploader({ value, onChange, uid }: Props) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)


    const maxMB = 8
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Bild ist größer als ${maxMB}MB`)
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Nur Bilder sind erlaubt')
      return
    }

    setBusy(true)
    try {

      const local = URL.createObjectURL(file)
      setPreview(local)

      const { url } = await uploadImageToSupabase(file, uid)
      onChange(url)
      setPreview(url)
    } catch (err: any) {
      setError(err?.message ?? 'Upload fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  function clear() {
    setPreview(null)
    onChange('')
    setError(null)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center px-3 py-2 rounded-xl border bg-white cursor-pointer hover:bg-zinc-50">
          <input type="file" className="hidden" accept="image/*" onChange={onPick} disabled={busy} />
          {busy ? 'Lade hoch…' : 'Bild auswählen'}
        </label>
        {preview && (
          <button type="button" onClick={clear} className="px-3 py-2 rounded-xl border bg-white hover:bg-zinc-50">
            Entfernen
          </button>
        )}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {preview ? (
        <div className="rounded-xl overflow-hidden border">
          <img src={preview} alt="preview" className="w-full max-h-64 object-cover" />
        </div>
      ) : (
        <div className="text-sm text-zinc-500">Noch kein Bild ausgewählt</div>
      )}
    </div>
  )
}
