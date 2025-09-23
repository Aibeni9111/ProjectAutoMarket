import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { api } from '@/lib/api'
import type { Car } from '@/types/Car'
import { Link } from 'react-router-dom'

type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export default function SellerDashboardPage() {
  const { role, uid, email } = useAuth()
  const isSeller = role === 'SELLER' || role === 'ADMIN'
  const [loading, setLoading] = useState(true)
  const [allCars, setAllCars] = useState<Car[]>([])
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'created' | 'priceAsc' | 'priceDesc' | 'yearDesc'>('created')
  const [tab, setTab] = useState<'inserate' | 'stats' | 'settings'>('inserate')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSeller || !uid) return
      ;(async () => {
      try {
        setError(null)
        setLoading(true)
        // Загружаем до 100 объявлений, потом фильтруем по sellerUid
        const res = await api.get<Page<Car>>('/cars', { params: { page: 0, size: 100, sort: 'createdAt,desc' } })
        setAllCars(res.data.content || [])
      } catch (e: any) {
        setError('Fehler beim Laden der Inserate')
      } finally {
        setLoading(false)
      }
    })()
  }, [isSeller, uid])

  const myCars = useMemo(() => {
    let items = allCars.filter(c => c.sellerUid === uid)
    if (q.trim()) {
      const qq = q.trim().toLowerCase()
      items = items.filter(c =>
        c.make.toLowerCase().includes(qq) ||
        c.model.toLowerCase().includes(qq) ||
        String(c.year).includes(qq)
      )
    }
    switch (sort) {
      case 'priceAsc': items = [...items].sort((a, b) => a.priceEur - b.priceEur); break
      case 'priceDesc': items = [...items].sort((a, b) => b.priceEur - a.priceEur); break
      case 'yearDesc': items = [...items].sort((a, b) => b.year - a.year); break
      default: /* created */ items = [...items].sort((a, b) => (a.createdAt! < b.createdAt! ? 1 : -1))
    }
    return items
  }, [allCars, uid, q, sort])

  const stats = useMemo(() => {
    if (myCars.length === 0) return { total: 0, avgPrice: 0, newest: null as string | null }
    const total = myCars.length
    const avgPrice = Math.round(myCars.reduce((sum, c) => sum + c.priceEur, 0) / total)
    const newest = myCars[0]?.createdAt || null
    return { total, avgPrice, newest }
  }, [myCars])

  async function handleDelete(id: number) {
    if (!confirm('Inserat löschen?')) return
    await api.delete(`/cars/${id}`)
    setAllCars(prev => prev.filter(c => c.id !== id))
  }

  if (!isSeller) {
    return <div className="py-10 text-center">403 — Forbidden</div>
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] py-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Verkäufer-Dashboard</h1>
            <p className="text-zinc-500">Eingeloggt als <span className="font-medium">{email || uid}</span></p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/cars/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
            >
              + Neues Inserat
            </Link>
            <a
              href="/"
              className="px-4 py-2 rounded-xl border hover:bg-white shadow-sm"
            >
              Zur Startseite
            </a>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard label="Inserate gesamt" value={String(stats.total)} />
          <KpiCard label="Durchschnittspreis" value={`€ ${stats.avgPrice.toLocaleString('de-AT')}`} />
          <KpiCard label="Neueste Anzeige" value={stats.newest ? new Date(stats.newest).toLocaleDateString('de-AT') : '—'} />
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <TabBtn active={tab === 'inserate'} onClick={() => setTab('inserate')}>Inserate</TabBtn>
        <TabBtn active={tab === 'stats'} onClick={() => setTab('stats')}>Statistiken</TabBtn>
        <TabBtn active={tab === 'settings'} onClick={() => setTab('settings')}>Einstellungen</TabBtn>
      </div>

      {/* Content */}
      <section className="bg-white rounded-2xl shadow-sm border">
        {tab === 'inserate' && (
          <div className="p-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Suchen (Marke, Modell, Jahr)"
                  className="px-3 py-2 rounded-xl border w-full md:w-[280px]"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border"
                >
                  <option value="created">Neueste zuerst</option>
                  <option value="priceAsc">Preis ↑</option>
                  <option value="priceDesc">Preis ↓</option>
                  <option value="yearDesc">Baujahr ↓</option>
                </select>
              </div>
              <div className="text-sm text-zinc-500">{myCars.length} Ergebnisse</div>
            </div>

            {/* List */}
            {error && <div className="text-red-600 mb-3">{error}</div>}
            {loading ? (
              <SkeletonGrid />
            ) : myCars.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {myCars.map((car) => (
                  <article key={car.id} className="group rounded-xl border overflow-hidden bg-white hover:shadow-md transition">
                    <a href={`/cars/${car.id}`} className="block">
                      <div className="aspect-[16/9] bg-zinc-100 overflow-hidden">
                        <img
                          src={car.imageUrl}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold leading-tight">
                            {car.make} {car.model}
                          </h3>
                          <span className="text-sm text-zinc-500">{car.year}</span>
                        </div>
                        <div className="mt-1 font-semibold">
                          € {car.priceEur.toLocaleString('de-AT')}
                        </div>
                        {car.description && (
                          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{car.description}</p>
                        )}
                      </div>
                    </a>
                    <div className="p-3 border-t flex items-center gap-2">
                      <a
                        href={`/cars/${car.id}/edit`}
                        className="px-3 py-2 rounded-lg border hover:bg-zinc-50"
                      >
                        Bearbeiten
                      </a>
                      <button
                        onClick={() => handleDelete(car.id!)}
                        className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Löschen
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'stats' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-3">Übersicht</h2>
            <ul className="space-y-2 text-zinc-700">
              <li>• Gesamt: <b>{stats.total}</b></li>
              <li>• Durchschnittspreis: <b>€ {stats.avgPrice.toLocaleString('de-AT')}</b></li>
              <li>• Neueste Anzeige: <b>{stats.newest ? new Date(stats.newest).toLocaleDateString('de-AT') : '—'}</b></li>
            </ul>
            <p className="mt-4 text-zinc-500">Bald fügen wir Diagramme (z. B. Preisverlauf, Leads) hinzu.</p>
          </div>
        )}

        {tab === 'settings' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-3">Einstellungen</h2>
            <p className="text-zinc-500">Hier kommen demnächst Profil- und Shop-Einstellungen.</p>
          </div>
        )}
      </section>
    </div>
  )
}

/* ---------------- helpers ---------------- */

function KpiCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border transition ${
        active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white hover:bg-zinc-50'
      }`}
    >
      {children}
    </button>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border overflow-hidden">
          <div className="aspect-[16/9] bg-zinc-100 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-zinc-100 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-14 text-center">
      <div className="text-3xl">🗂️</div>
      <h3 className="mt-2 text-lg font-semibold">Keine Inserate vorhanden</h3>
      <p className="text-zinc-500">Erstellen Sie Ihr erstes Inserat in wenigen Minuten.</p>
      <a
        href="/cars/new"
        className="inline-flex mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
      >
        + Neues Inserat
      </a>
    </div>
  )
}
