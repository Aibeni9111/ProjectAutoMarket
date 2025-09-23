import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import HomePage from '@/features/home/pages/HomePage'
import CarDetailsPage from '@/features/cars/pages/CarDetailsPage'
import NewCarPage from '@/features/cars/pages/NewCarPage'
import EditCarPage from '@/features/cars/pages/EditCarPage'
import MePage from '@/features/auth/pages/MePage'
import SellerDashboardPage from '@/features/seller/pages/SellerDashboardPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cars/:id', element: <CarDetailsPage /> },
      { path: 'cars/new', element: <NewCarPage /> },
      { path: 'cars/:id/edit', element: <EditCarPage /> },
      { path: '/seller', element: <SellerDashboardPage /> },
    ]
  }
])
