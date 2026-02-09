import { XMarkIcon } from "@heroicons/react/24/outline"

const ProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null

  const isEdit = Boolean(product)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* MODAL */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        {/* FORM */}
        <form className="space-y-4">
          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              defaultValue={product?.title || ""}
              placeholder="Enter product name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              defaultValue={product?.price || ""}
              placeholder="Enter price"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              defaultValue={product?.category || ""}
              className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="beauty">Beauty</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>

          {/* IMAGE URL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Image URL
            </label>
            <input
              type="text"
              defaultValue={product?.image || ""}
              placeholder="Paste image URL"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
