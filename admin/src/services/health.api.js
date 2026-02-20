import api from './axios'

const SERVICES = [
  { name: 'auth', path: '/auth' },
  { name: 'products', path: '/products' },
  { name: 'orders', path: '/orders' },
  { name: 'payment', path: '/payment' },
  { name: 'admin', path: '/admin' },
  { name: 'analytics', path: '/analytics' },
  { name: 'notification', path: '/notification' }
]

export const checkServiceHealth = async () => {
  const results = {}
  await Promise.all(SERVICES.map(async svc => {
    try {
      // try canonical path first
      const res = await api.get(`${svc.path}/health`)
      results[svc.name] = { ok: true, status: res.data }
    } catch (err) {
      // try singular/plural variants or root
      try {
        const res2 = await api.get(`/${svc.name}/health`)
        results[svc.name] = { ok: true, status: res2.data }
      } catch (err2) {
        results[svc.name] = { ok: false, error: err2?.response?.status ? `${err2.response.status} ${err2.response.statusText}` : (err2.message || 'unreachable') }
      }
    }
  }))
  return results
}

export default { checkServiceHealth }
