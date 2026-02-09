import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const ProductModal = ({ onClose, product }) => {
  const isEdit = Boolean(product)

  const [form, setForm] = useState({
    title: product?.title || "",
    price: product?.price || "",
    category: product?.category?.name || "",
    image: product?.images?.[0] || "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 🔥 Frontend only (no backend yet)
    console.log(isEdit ? "EDIT PRODUCT" : "ADD PRODUCT", form)

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <input
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
