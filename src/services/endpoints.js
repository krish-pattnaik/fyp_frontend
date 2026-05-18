import api from './api'

export const endpoints = {
  health:              () => api.get('/health'),
  products:            () => api.get('/products'),
  inventory:           () => api.get('/inventory'),
  sales:               () => api.get('/sales'),
  topProducts:         () => api.get('/top-products'),
  alerts:              (includeReorder = false) =>
                         api.get(`/alerts${includeReorder ? '?include_reorder=true' : ''}`),
  checkReorder:        () => api.post('/alerts/check-reorder'),
  forecast:            (productId) => api.get(`/forecast/${productId}`),
  dashboardSummary:    () => api.get('/dashboard/summary'),
  seasonalitySummary:  () => api.get('/seasonality/summary'),
  productSeasonality:  (productId) => api.get(`/seasonality/${productId}`),
  uploadSales:         (formData) =>
                         api.post('/sales/upload', formData, {
                           headers: { 'Content-Type': 'multipart/form-data' },
                         }),
}
