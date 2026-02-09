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
