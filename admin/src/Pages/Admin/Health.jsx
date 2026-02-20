import { useEffect, useState } from 'react'
import { checkServiceHealth } from '../../services/health.api'

const Health = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await checkServiceHealth()
        if (mounted) setStatus(res)
      } catch (err) {
        if (mounted) setStatus({ error: err.message })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">System Health</h1>
      {loading && <p>Checking services...</p>}
      {!loading && !status && <p>No data</p>}

      {status && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(status).map(([svc, res]) => (
            <div key={svc} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <div className="font-medium">{svc}</div>
                <div>
                  {res.ok ? (
                    <span className="text-green-600">Healthy</span>
                  ) : (
                    <span className="text-red-600">Unavailable</span>
                  )}
                </div>
              </div>
              <div className="text-sm mt-2 text-gray-600">
                {res.ok ? JSON.stringify(res.status) : res.error}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Health
