import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Forecast from './pages/Forecast'
import Alerts from './pages/Alerts'
import Seasonality from './pages/Seasonality'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="seasonality" element={<Seasonality />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
