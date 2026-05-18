import { useEffect, useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { productService } from '../services/productService'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { formatCurrency, getStockStatus } from '../utils/helpers'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getInventory()
        setProducts(data)
      } catch {
        setError('Failed to load inventory.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map((p) => p.category))]
    return cats
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter
      return matchSearch && matchCat
    })
  }, [products, search, categoryFilter])

  const columns = [
    { key: 'id',            label: 'ID',        width: '80px' },
    { key: 'name',          label: 'Product',   render: (v) => <span className="font-medium text-slate-100">{v}</span> },
    { key: 'category',      label: 'Category',  render: (v) => (
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{v}</span>
      )
    },
    { key: 'current_stock', label: 'Stock',     render: (v, row) => {
        const { label, color } = getStockStatus(v, row.threshold)
        const textColor = color === 'red' ? 'text-red-400' : color === 'amber' ? 'text-amber-400' : 'text-green-400'
        return <span className={`font-semibold ${textColor}`}>{v}</span>
      }
    },
    { key: 'threshold',     label: 'Threshold' },
    { key: 'lead_time',     label: 'Lead Time', render: (v) => `${v}d` },
    { key: 'unit_price',    label: 'Price',     render: (v) => formatCurrency(v) },
    { key: 'status',        label: 'Status',    render: (_, row) => {
        const { label } = getStockStatus(row.current_stock, row.threshold)
        return <StatusBadge status={label} />
      }
    },
  ]

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search products, categories, IDs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Strip */}
      {!loading && (
        <div className="flex gap-4 text-xs text-slate-500">
          <span><span className="text-white font-medium">{filtered.length}</span> products</span>
          <span className="text-red-400 font-medium">
            {filtered.filter((p) => getStockStatus(p.current_stock, p.threshold).label === 'Critical').length} critical
          </span>
          <span className="text-amber-400 font-medium">
            {filtered.filter((p) => getStockStatus(p.current_stock, p.threshold).label === 'Low').length} low
          </span>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No products match your search."
      />
    </div>
  )
}
