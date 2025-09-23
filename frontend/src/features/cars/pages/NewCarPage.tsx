import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import CarCreateForm from '@/features/cars/components/CarCreateForm'

export default function NewCarPage() {
  const { role, email } = useAuth()
  const isSeller = role === 'SELLER' || role === 'ADMIN'
  const navigate = useNavigate()

  if (!isSeller) {
    return (
      <div className="max-w-3xl mx-auto py-16">
        <div className="rounded-2xl border bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold">403 — Kein Zugriff</h1>
          <p className="text-zinc-500 mt-2">Nur Verkäufer oder Admins dürfen Inserate erstellen.</p>
          <div className="mt-6">
            <Link to="/" className="px-4 py-2 rounded-xl border hover:bg-white">Zur Startseite</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Neues Inserat</h1>
          <p className="text-zinc-500">Erstelle ein neues Fahrzeugangebot — angemeldet als <span className="font-medium">{email}</span>.</p>
        </div>
        <Link to="/seller" className="px-4 py-2 rounded-xl border hover:bg-white">Zurück zum Dashboard</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        {/* Формa */}
        <div className="rounded-2xl border bg-white p-5 md:p-6 shadow-sm">
          <CarCreateForm onCreated={(id) => navigate(`/cars/${id}`)} />
        </div>

        {/* Подсказки/советы */}
        <aside className="rounded-2xl border bg-white p-5 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Tipps für bessere Inserate</h3>
          <ul className="mt-3 space-y-2 text-zinc-700">
            <li>• Verwende ein klares Titelbild (Querformat, 16:9).</li>
            <li>• Füge eine kurze, prägnante Beschreibung hinzu.</li>
            <li>• Preis realistisch wählen — erhöht die Sichtbarkeit.</li>
            <li>• Baujahr und Modell korrekt angeben.</li>
          </ul>
          <div className="mt-4 rounded-xl border bg-zinc-50 p-4 text-sm text-zinc-600">
            Nach dem Speichern kannst du das Inserat jederzeit im Dashboard bearbeiten.
          </div>
        </aside>
      </div>
    </div>
  )
}
