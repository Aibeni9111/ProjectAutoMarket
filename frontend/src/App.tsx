// src/App.tsx
import { Outlet } from 'react-router-dom'
import NavBar from '@/features/home/components/NavBar'

export default function App() {
  return (
    <div className="min-h-dvh">
      <NavBar />
      <main className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
