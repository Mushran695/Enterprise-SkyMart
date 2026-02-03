import { useEffect, useState } from "react"
import axios from "axios"

const roleStyles = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-blue-100 text-blue-700",
}

const statusStyles = {
  active: "bg-green-100 text-green-700",
  blocked: "bg-red-100 text-red-700",
}

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔥 Fetch users from MongoDB
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://mern-ecommerce-1-mpg2.onrender.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setUsers(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch users", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 🔁 Update Role (UI + Backend)
  const updateRole = async (id, role) => {
    try {
      await axios.put(
        `https://mern-ecommerce-1-mpg2.onrender.com/api/admin/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setUsers(prev =>
        prev.map(user =>
          user._id === id ? { ...user, role } : user
        )
      )
    } catch (err) {
      console.error("Role update failed", err)
    }
  }

  // 🔁 Update Status (UI + Backend)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://mern-ecommerce-1-mpg2.onrender.com/api/admin/users/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setUsers(prev =>
        prev.map(user =>
          user._id === id ? { ...user, status } : user
        )
      )
    } catch (err) {
      console.error("Status update failed", err)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-sm text-gray-500">
          Manage user roles and access
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>

                {/* ROLE */}
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={e =>
                      updateRole(user._id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${
                      roleStyles[user.role]
                    }`}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <select
                    value={user.status || "active"}
                    onChange={e =>
                      updateStatus(user._id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${
                      statusStyles[user.status || "active"]
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
