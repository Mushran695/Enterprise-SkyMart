import { useEffect, useState } from "react"
import { getAdminAnalytics } from "../../services/adminApi"

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const res = await getAdminAnalytics()
      setData(res)
    } catch (err) {
      console.error("Failed to load admin dashboard", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <h3>Loading dashboard...</h3>

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div>
        <p>Total Products: {data.stats.products}</p>
        <p>Total Users: {data.stats.users}</p>
      </div>

      <h3>Categories</h3>
      <ul>
        {data.categories.map((cat, i) => (
          <li key={i}>
            {cat.name} - {cat.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDashboard
