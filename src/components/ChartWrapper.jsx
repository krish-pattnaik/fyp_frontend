export default function ChartWrapper({ title, subtitle, children, loading = false, action }) {
  if (loading) {
    return (
      <div className="card">
        <div className="h-4 bg-slate-800 rounded w-32 mb-2 animate-pulse" />
        <div className="h-3 bg-slate-800 rounded w-24 mb-6 animate-pulse" />
        <div className="h-56 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
