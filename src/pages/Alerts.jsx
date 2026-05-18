import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle } from 'lucide-react'
import { endpoints } from '../services/endpoints'
import AlertCard from '../components/AlertCard'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState(null)
  const [checkResult, setCheckResult] = useState(null)

  const loadAlerts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await endpoints.alerts(true)
      setAlerts(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load alerts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAlerts() }, [])

  const handleCheckReorder = async () => {
    setChecking(true)
    setCheckResult(null)
    try {
      const { data } = await endpoints.checkReorder()
      setCheckResult(`Generated ${data.alerts_generated} reorder alert(s).`)
      await loadAlerts()
    } catch {
      setCheckResult('Reorder check failed.')
    } finally {
      setChecking(false)
    }
  }

  const critical = Array.isArray(alerts) ? alerts.filter((a) => a.severity === 'critical') : []
  const warning  = Array.isArray(alerts) ? alerts.filter((a) => a.severity === 'warning') : []
  const info     = Array.isArray(alerts) ? alerts.filter((a) => a.severity === 'info') : []

  return (
    <div className="space-y-5">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-3 text-xs text-slate-500">
          <span className="text-red-400"><span className="font-bold">{critical.length}</span> critical</span>
          <span className="text-amber-400"><span className="font-bold">{warning.length}</span> warning</span>
          <span className="text-brand-400"><span className="font-bold">{info.length}</span> info</span>
        </div>
        <button
          onClick={handleCheckReorder}
          disabled={checking}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking…' : 'Run Reorder Check'}
        </button>
      </div>

      {checkResult && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {checkResult}
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">All clear</p>
          <p className="text-slate-500 text-sm mt-1">No active alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Critical first */}
          {critical.length > 0 && (
            <>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Critical</p>
              {critical.map((a) => <AlertCard key={a.id} alert={a} />)}
            </>
          )}
          {warning.length > 0 && (
            <>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-4">Warning</p>
              {warning.map((a) => <AlertCard key={a.id} alert={a} />)}
            </>
          )}
          {info.length > 0 && (
            <>
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mt-4">Info</p>
              {info.map((a) => <AlertCard key={a.id} alert={a} />)}
            </>
          )}
        </div>
      )}
    </div>
  )
}
