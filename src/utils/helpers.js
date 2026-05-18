/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(value, compact = false) {
  if (value == null || isNaN(value)) return '₹0'
  const num = Number(value)
  if (compact) {
    if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(1)}Cr`
    if (num >= 100_000)    return `₹${(num / 100_000).toFixed(1)}L`
    if (num >= 1_000)      return `₹${(num / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format a date string to a human-readable relative time
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)

  if (diffMin < 1)    return 'just now'
  if (diffMin < 60)   return `${diffMin}m ago`
  if (diffHr < 24)    return `${diffHr}h ago`
  if (diffDays < 7)   return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/**
 * Get stock status label and color class
 */
export function getStockStatus(stock, threshold) {
  if (stock <= threshold)          return { label: 'Critical', color: 'red' }
  if (stock <= threshold * 1.5)    return { label: 'Low',      color: 'amber' }
  return                                  { label: 'OK',       color: 'green' }
}

/**
 * Severity to Tailwind color class mapping
 */
export const severityColors = {
  critical: {
    bg:     'bg-red-500/10',
    border: 'border-red-500/30',
    text:   'text-red-400',
    badge:  'bg-red-500/20 text-red-300',
    dot:    'bg-red-500',
  },
  warning: {
    bg:     'bg-amber-500/10',
    border: 'border-amber-500/30',
    text:   'text-amber-400',
    badge:  'bg-amber-500/20 text-amber-300',
    dot:    'bg-amber-500',
  },
  info: {
    bg:     'bg-brand-500/10',
    border: 'border-brand-500/30',
    text:   'text-brand-400',
    badge:  'bg-brand-500/20 text-brand-300',
    dot:    'bg-brand-500',
  },
}

export function getSeverityColors(severity) {
  return severityColors[severity?.toLowerCase()] || severityColors.info
}

/**
 * Clamp a number between min and max
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

/**
 * Safely parse JSON
 */
export function safeJSON(str, fallback = null) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}
