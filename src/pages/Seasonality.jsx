import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { endpoints } from '../services/endpoints'
import { productService } from '../services/productService'
import ChartWrapper from '../components/ChartWrapper'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const riskColor = { High: 'text-red-400', Medium: 'text-amber-400', Low: 'text-green-400' }

export default function Seasonality() {
  const [summary, setSummary] = useState([])
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [productLoading, setProductLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, prods] = await Promise.all([
          endpoints.seasonalitySummary(),
          productService.getAll(),
        ])
        setSummary(Array.isArray(summaryRes.data) ? summaryRes.data : [])
        setProducts(prods)
        if (prods.length > 0) setSelectedId(prods[0].id)
      } catch {
        setError('Failed to load seasonality data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const load = async () => {
      setProductLoading(true)
      try {
        const { data } = await endpoints.productSeasonality(selectedId)
        setProductData(data)
      } catch {
        setProductData(null)
      } finally {
        setProductLoading(false)
      }
    }
    load()
  }, [selectedId])

  const monthlyData = Array.isArray(productData?.monthly_data) ? productData.monthly_data : []

  return (
    <div className="space-y-6">
      {/* Cross-product summary */}
      <ChartWrapper title="Monthly Order Volume" subtitle="All products combined by month" loading={loading}>
        {!loading && summary.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No seasonality data available.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summary} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_orders" fill="#6366f1" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartWrapper>

      {/* Festival Calendar */}
      {!loading && summary.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Festival / Seasonal Peaks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {summary.map((m) => (
              <div key={m.month} className="bg-slate-800/60 rounded-lg px-3 py-2.5 border border-slate-700">
                <p className="text-xs font-bold text-slate-300">{m.month}</p>
                <p className="text-xs text-brand-400 mt-0.5">{m.festival}</p>
                <p className="text-xs text-slate-500 mt-1">{m.total_orders} orders</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product deep-dive */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <h3 className="text-sm font-semibold text-white flex-1">Product Deep-Dive</h3>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="input-field w-full sm:w-72"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name}
              </option>
            ))}
          </select>
        </div>

        {productData && (
          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div className="bg-slate-800 rounded-lg px-3 py-2">
              <p className="text-slate-500">Avg Orders/Month</p>
              <p className="text-white font-bold">{productData.avg_orders}</p>
            </div>
            <div className="bg-slate-800 rounded-lg px-3 py-2">
              <p className="text-slate-500">Seasonality Risk</p>
              <p className={`font-bold ${riskColor[productData.risk_level] || 'text-white'}`}>
                {productData.risk_level}
              </p>
            </div>
            {productData.peak_months?.length > 0 && (
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-500">Peak Months</p>
                <p className="text-amber-300 font-medium">{productData.peak_months.join(', ')}</p>
              </div>
            )}
            {productData.low_months?.length > 0 && (
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-500">Slow Months</p>
                <p className="text-slate-400 font-medium">{productData.low_months.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        <ChartWrapper
          title=""
          loading={productLoading}
        >
          {monthlyData.length === 0 && !productLoading ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-slate-500 text-sm">No data for this product.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="short_month" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0]?.payload
                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
                        <p className="text-slate-200 font-medium">{d?.month}</p>
                        <p className="text-brand-400">{d?.orders} orders</p>
                        <p className="text-slate-500 mt-0.5">{d?.festival}</p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
