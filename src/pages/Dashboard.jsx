import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Package, DollarSign, AlertTriangle, Bell } from 'lucide-react'
import { endpoints } from '../services/endpoints'
import KPIBox from '../components/KPIBox'
import ChartWrapper from '../components/ChartWrapper'
import AlertCard from '../components/AlertCard'
import { formatCurrency } from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.dataKey === 'total_sales' ? formatCurrency(p.value, true) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await endpoints.dashboardSummary()
        setSummary(data)
      } catch (e) {
        setError('Failed to load dashboard data. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-slate-500 text-sm mt-1">
            Ensure <code className="text-slate-300">uvicorn main:app --reload</code> is running on port 8000.
          </p>
        </div>
      </div>
    )
  }

  const salesTrend = Array.isArray(summary?.sales_trend) ? summary.sales_trend : []
  const topProducts = Array.isArray(summary?.top_products) ? summary.top_products : []
  const recentAlerts = Array.isArray(summary?.recent_alerts) ? summary.recent_alerts : []

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIBox
          label="Total Products"
          value={summary?.total_products ?? '—'}
          icon={Package}
          color="brand"
          loading={loading}
          sub="Across all categories"
        />
        <KPIBox
          label="Total Revenue"
          value={summary ? formatCurrency(summary.total_sales, true) : '—'}
          icon={DollarSign}
          color="green"
          loading={loading}
          sub="All-time sales"
        />
        <KPIBox
          label="Low Stock Items"
          value={summary?.low_stock_items ?? '—'}
          icon={AlertTriangle}
          color="amber"
          loading={loading}
          sub="At or below threshold"
        />
        <KPIBox
          label="Active Alerts"
          value={summary?.active_alerts ?? '—'}
          icon={Bell}
          color="red"
          loading={loading}
          sub="Requiring attention"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartWrapper title="Sales Trend" subtitle="Monthly revenue over time" loading={loading}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesTrend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="total_sales" stroke="#6366f1" strokeWidth={2}
                dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Top Products" subtitle="Units sold" loading={loading}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProducts} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false}
                tickFormatter={(v) => v.split(' ').slice(0, 2).join(' ')} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantity_sold" fill="#6366f1" radius={[4, 4, 0, 0]} name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Alerts</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentAlerts.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent alerts.</p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
