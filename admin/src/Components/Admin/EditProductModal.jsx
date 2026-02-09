import { useEffect, useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/solid"

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    rating: 0,
    featured: false,
    discount: false,
  })

  // ✅ Fill form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        price: product.price || "",
        category: product.category || "",
        image: product.image || "",
        rating: product.rating || 0,
        featured: product.featured || false,
        discount: product.discount || false,
      })
    }
  }, [product])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = () => {
    onSave({ ...product, ...form })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        {/* FORM */}
        <div className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Beauty">Beauty</option>
            <option value="Wellness">Wellness</option>
          </select>

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="rating"
            type="number"
            step="0.1"
            max="5"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating"
            className="w-full border px-3 py-2 rounded"
          />

          {/* CHECKBOXES */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />
              Featured
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="discount"
                checked={form.discount}
                onChange={handleChange}
              />
              Discount
            </label>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProductModal
