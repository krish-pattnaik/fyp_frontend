export default function StatusBadge({ status }) {
  const map = {
    Critical: 'bg-red-500/20 text-red-300 border-red-500/30',
    Low:      'bg-amber-500/20 text-amber-300 border-amber-500/30',
    OK:       'bg-green-500/20 text-green-300 border-green-500/30',
  }
  const cls = map[status] || 'bg-slate-700 text-slate-300 border-slate-600'

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  )
}
