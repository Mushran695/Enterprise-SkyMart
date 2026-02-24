import { useState } from "react"
import { deleteProduct } from "../../services/adminProduct.api"
import EditProduct from "./EditProduct"

export default function ProductList({ products, refresh }) {
  const [editProduct, setEditProduct] = useState(null)

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return
    await deleteProduct(id)
    refresh()
  }

  return (
    <>
      {/* Desktop: table (preserve existing layout) */}
      <div className="hidden lg:block mt-5">
        <table width="100%" border="1" cellPadding="10" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.category}</td>
                <td>
                  <button onClick={() => setEditProduct(p)}>Edit</button>
                  <button
                    onClick={() => remove(p._id)}
                    style={{ marginLeft: 10, color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked card view */}
      <div className="lg:hidden space-y-4 mt-4">
        {products.map(p => (
          <div key={p._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-800">{p.name}</div>
                <div className="text-sm text-gray-500">{p.category}</div>
              </div>
              <div className="text-gray-800">₹{p.price}</div>
            </div>

            <div className="mt-3 flex gap-3">
              <button onClick={() => setEditProduct(p)} className="px-3 py-2 bg-blue-600 text-white rounded min-h-[44px]">Edit</button>
              <button
                onClick={() => remove(p._id)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded min-h-[44px]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editProduct && (
        <EditProduct
          product={editProduct}
          refresh={refresh}
          onClose={() => setEditProduct(null)}
        />
      )}
    </>
  )
}
