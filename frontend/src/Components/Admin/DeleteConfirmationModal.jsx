import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/solid"

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, product }) => {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="h-14 w-14 text-red-500" />
        </div>

        {/* TEXT */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Delete Product?
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete  
          <span className="font-semibold"> {product.title}</span>?  
          <br />
          This action cannot be undone.
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(product._id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
