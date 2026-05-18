import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Bell,
  BarChart3,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/inventory',   label: 'Inventory',  icon: Package },
  { to: '/forecast',    label: 'Forecast',   icon: TrendingUp },
  { to: '/alerts',      label: 'Alerts',     icon: Bell },
  { to: '/seasonality', label: 'Seasonality',icon: BarChart3 },
]

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide">RetailIQ</p>
          <p className="text-xs text-slate-500">Demand Forecast</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-2 mb-3">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-800">
        <p className="text-xs text-slate-600">v1.0.0 · RetailIQ</p>
      </div>
    </aside>
  )
}
