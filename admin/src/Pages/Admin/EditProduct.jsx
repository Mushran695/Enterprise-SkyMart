import { useState } from "react"
import { updateProduct } from "../../services/adminProduct.api"

export default function EditProduct({ product, onClose, refresh }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    image: product.image || "",
    category: product.category
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    try {
      setLoading(true)
      setError("")

      await updateProduct(product._id, {
        name: form.name,
        price: Number(form.price),
        image: form.image,
        category: form.category
      })

      await refresh()
      onClose()
    } catch {
      setError("Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          Edit Product
        </h3>

        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </p>
        )}

        {/* FORM */}
        <div className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Name
            </label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Price
            </label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Image URL
            </label>
            <input
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option>Fashion</option>
              <option>Electronics</option>
              <option>Beauty</option>
              <option>Wellness</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-medium disabled:opacity-60"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}
