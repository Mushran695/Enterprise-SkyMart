import { useState } from "react"
import { addProduct } from "../../services/adminProduct.api"

export default function AddProducts({ refresh, onClose }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    category: "Fashion"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    try {
      setLoading(true)
      setError("")

      if (!form.title || !form.price) {
        setError("Product name and price are required")
        setLoading(false)
        return
      }

      await addProduct({
        name: form.title,
        price: Number(form.price),
        image: form.image,
        category: form.category
      })

      await refresh()
      onClose()
    } catch (err) {
      setError("Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}>
          <h2>Add New Product</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={formGrid}>
          {/* Product Name */}
          <div>
            <label>Product Name</label>
            <input
              style={input}
              placeholder="Enter product title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Price */}
          <div>
            <label>Price (₹)</label>
            <input
              style={input}
              type="number"
              placeholder="Enter price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>

          {/* Image Upload */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Product Image</label>

            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <input
                style={{ ...input, flex: 1 }}
                placeholder="Paste image URL"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
              />

              <label style={uploadBtn}>
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => {
                    const file = e.target.files[0]
                    if (!file) return
                    const preview = URL.createObjectURL(file)
                    setForm({ ...form, image: preview })
                  }}
                />
              </label>
            </div>

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                style={{
                  marginTop: "10px",
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  border: "1px solid #eee",
                  borderRadius: "8px"
                }}
              />
            )}
          </div>

          {/* Category */}
          <div>
            <label>Category</label>
            <select
              style={input}
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option>Fashion</option>
              <option>Electronics</option>
              <option>Beauty</option>
              <option>Wellness</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={footer}>
          <button onClick={onClose} style={cancelBtn}>
            Cancel
          </button>
          <button onClick={submit} disabled={loading} style={saveBtn}>
            {loading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* 🔥 Styles */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
}

const modal = {
  width: "560px",
  background: "#fff",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
  paddingBottom: "10px"
}

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: "22px",
  cursor: "pointer"
}

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginTop: "20px"
}

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  marginTop: "5px"
}

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "25px"
}

const saveBtn = {
  background: "#ff9900",
  border: "none",
  padding: "10px 20px",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "6px",
  cursor: "pointer"
}

const cancelBtn = {
  background: "#eee",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer"
}

const uploadBtn = {
  background: "#2874f0",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center"
}

const errorBox = {
  background: "#ffe5e5",
  color: "#b00020",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "15px"
}
