import { endpoints } from './endpoints'

export const productService = {
  async getAll() {
    const { data } = await endpoints.products()
    return Array.isArray(data) ? data : []
  },

  async getInventory() {
    const { data } = await endpoints.inventory()
    return Array.isArray(data) ? data : []
  },

  async getTopProducts() {
    const { data } = await endpoints.topProducts()
    return Array.isArray(data) ? data : []
  },

  async getForecast(productId) {
    const { data } = await endpoints.forecast(productId)
    return data
  },

  getStockStatus(product) {
    if (!product) return 'unknown'
    if (product.current_stock <= product.threshold) return 'critical'
    if (product.current_stock <= product.threshold * 1.5) return 'low'
    return 'ok'
  },
}
