export default function KPIBox({ label, value, sub, icon: Icon, color = 'brand', loading = false }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-500/10',  icon: 'text-brand-400',  border: 'border-brand-500/20' },
    green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  border: 'border-green-500/20' },
    amber:  { bg: 'bg-amber-500/10',  icon: 'text-amber-400',  border: 'border-amber-500/20' },
    red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/20' },
  }
  const c = colorMap[color] || colorMap.brand

  if (loading) {
    return (
      <div className="card border border-slate-800 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-24 mb-4" />
        <div className="h-8 bg-slate-800 rounded w-16 mb-2" />
        <div className="h-3 bg-slate-800 rounded w-20" />
      </div>
    )
  }

  return (
    <div className={`card border ${c.border} flex items-start gap-4`}>
      {Icon && (
        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-white truncate">{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
