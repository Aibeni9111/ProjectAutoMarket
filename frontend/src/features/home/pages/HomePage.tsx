import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import CardGrid from '@/features/home/components/CardGrid'
import type { Car } from '@/types/Car'

type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export default function HomePage() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState<Page<Car> | null>(null)
  const [q, setQ] = useState(params.get('make') ?? '')

  async function load() {
    const res = await api.get<Page<Car>>('/cars', {
      params: { make: q || undefined, page: 0, size: 8, sort: 'createdAt,desc' }
    })
    setData(res.data)
  }
  const heroImages = ['/hero-1.jpg', '/hero-2.jpg', '/hero-3.jpg']

  useEffect(() => { load() }, [])

  function applySearch() {
    load()
  }

  return (
    <main className="pt-0" >
      {/* HERO-SLIDER */}
      <section className="relative group h-[520px] w-full overflow-hidden bg-[#0f172a]">
        {/* мягкие цветные пятна поверх тёмного */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-32 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
               style={{background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)'}}/>
          <div className="absolute -bottom-20 -right-28 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
               style={{background: 'radial-gradient(circle, rgba(236,72,153,0.30), transparent 60%)'}}/>
        </div>


        <div className="absolute inset-y-0 left-0 right-1">
          <img
            src="/img/hero-4.gif"
            alt="Hero"
            className="absolute top-1/2 -translate-y-1/2 h-[320px] md:h-[360px] object-contain animate-slide-rtl select-none"
            draggable={false}
            loading="eager"
          />
        </div>


        <div className="absolute inset-0 bg-black/10"/>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow">
            Finde dein Traumauto
          </h1>
          <p className="mt-3 text-zinc-200 max-w-xl">
            Entdecke Top-Angebote, vergleiche Modelle und starte deine Probefahrt.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#suche"
               className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">
              Jetzt suchen
            </a>
          </div>
        </div>
      </section>


      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Warum AutoMarket?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 text-2xl">🚗</div>
              <h3 className="font-semibold mb-1">Große Auswahl</h3>
              <p className="text-zinc-600 text-sm">Tausende Inserate von verifizierten Anbietern.</p>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 text-2xl">🛡️</div>
              <h3 className="font-semibold mb-1">Sichere Abwicklung</h3>
              <p className="text-zinc-600 text-sm">Identity & Rollen per Google/Firebase.</p>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 text-2xl">💬</div>
              <h3 className="font-semibold mb-1">Direkter Kontakt</h3>
              <p className="text-zinc-600 text-sm">Schnell mit Verkäufer*innen verbinden.</p>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 text-2xl">⚡</div>
              <h3 className="font-semibold mb-1">Schnelle Suche</h3>
              <p className="text-zinc-600 text-sm">Filter nach Marke, Jahr, Preis u.v.m.</p>
            </div>
          </div>
        </div>
      </section>


      <section id="suche" className="bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">Frisch eingetroffen</h2>
              <p className="text-zinc-600">Die neuesten Angebote nur für dich.</p>
            </div>
            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Marke (z. B. Toyota)"
                className="px-3 py-2 rounded-xl border bg-white"
              />
              <button onClick={applySearch} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
                Suchen
              </button>
            </div>
          </div>

          {!data ? (
            <div>Laden…</div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {data.content.slice(0, 8).map((car) => (
                <article key={car.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <a href={`/cars/${car.id}`} className="block">
                    <div className="aspect-[16/9] bg-zinc-100">
                      <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
                      <p className="text-zinc-500">{car.year}</p>
                      <div className="mt-2 font-semibold">€ {car.priceEur.toLocaleString('de-AT')}</div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-indigo-800 to-purple-800 text-gray-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white">AutoMarket</h3>
            <p className="text-sm">© 2025 AutoMarket. Alle Rechte vorbehalten.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Kontakt</h4>
            <p>Email: support@automarket.com</p>
            <p>Tel: +43 123 456 789</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Navigation</h4>
            <a href="/" className="block hover:underline">Home</a>
            <a href="/about" className="block hover:underline">Über uns</a>
            <a href="/contacts" className="block hover:underline">Kontakt</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
