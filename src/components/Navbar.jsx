import { useLocation } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { endpoints } from '../services/endpoints'

const titles = {
  '/':            'Dashboard',
  '/inventory':   'Inventory Management',
  '/forecast':    'Demand Forecast',
  '/alerts':      'Alerts & Notifications',
  '/seasonality': 'Seasonality Analysis',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'RetailIQ'
  const [status, setStatus] = useState(null)

  const checkHealth = async () => {
    try {
      const { data } = await endpoints.health()
      setStatus(data.db_connected ? 'online' : 'degraded')
    } catch {
      setStatus('offline')
    }
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        {status && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              status === 'online'
                ? 'bg-green-500/20 text-green-400'
                : status === 'degraded'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {status === 'online' ? '● Connected' : status === 'degraded' ? '● Degraded' : '● Offline'}
          </span>
        )}
        <button
          onClick={checkHealth}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          title="Check API health"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
