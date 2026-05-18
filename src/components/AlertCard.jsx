import { AlertTriangle, Info, XCircle, Clock } from 'lucide-react'
import { getSeverityColors, formatRelativeTime } from '../utils/helpers'

const icons = {
  critical: XCircle,
  warning:  AlertTriangle,
  info:     Info,
}

export default function AlertCard({ alert }) {
  const colors = getSeverityColors(alert.severity)
  const Icon = icons[alert.severity?.toLowerCase()] || Info

  return (
    <div className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex-shrink-0 ${colors.text}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {alert.product_name || 'Unknown Product'}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${colors.badge}`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
          {alert.suggested_quantity > 0 && (
            <p className="text-xs text-slate-500 mt-1.5">
              Suggested reorder: <span className="text-slate-300 font-medium">{alert.suggested_quantity} units</span>
            </p>
          )}
          {alert.created_at && (
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(alert.created_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
