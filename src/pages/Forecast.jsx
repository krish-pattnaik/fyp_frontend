import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { productService } from '../services/productService'
import { endpoints } from '../services/endpoints'
import ChartWrapper from '../components/ChartWrapper'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value ?? 'N/A'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Forecast() {
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getAll()
        setProducts(data)
        if (data.length > 0) setSelectedId(data[0].id)
      } catch {
        setError('Failed to load products.')
      } finally {
        setProductsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const load = async () => {
      setLoading(true)
      setError(null)
      setForecast(null)
      try {
        const { data } = await endpoints.forecast(selectedId)
        setForecast(data)
      } catch (e) {
        const msg = e?.response?.data?.detail || 'Forecast unavailable for this product.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedId])

  const chartData = Array.isArray(forecast?.forecast) ? forecast.forecast : []

  return (
    <div className="space-y-5">
      {/* Product Selector */}
      <div className="card">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Product
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="input-field w-full sm:w-80"
          disabled={productsLoading}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} — {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <ChartWrapper
        title={forecast?.product_name ? `Forecast: ${forecast.product_name}` : 'Demand Forecast'}
        subtitle="Actual vs predicted orders"
        loading={loading}
      >
        {error ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-slate-500 text-sm text-center">{error}</p>
          </div>
        ) : chartData.length === 0 && !loading ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No forecast data available.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date_label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(v) => <span className="text-slate-400">{v}</span>}
              />
              <Line
                type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2}
                dot={{ r: 3 }} connectNulls name="Actual"
              />
              <Line
                type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2}
                strokeDasharray="5 3" dot={{ r: 3 }} connectNulls name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartWrapper>

      {/* Legend Note */}
      <div className="flex gap-6 text-xs text-slate-500 px-1">
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-brand-500 inline-block" /> Actual demand
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-amber-500 inline-block border-dashed" style={{ borderTop: '2px dashed #f59e0b', background: 'none' }} /> Prophet forecast
        </span>
      </div>
    </div>
  )
}
