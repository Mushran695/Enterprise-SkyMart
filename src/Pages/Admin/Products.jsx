import { useEffect, useState } from "react"
import { getAllProducts } from "../../services/adminProduct.api";
import ProductList from "./ProductList"
import AddProducts from "./AddProduct"

export default function Products() {
  const [products, setProducts] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      console.error("Failed to load products", err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Products</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
      </div>

      {showAdd && (
        <AddProducts
          refresh={fetchProducts}
          onClose={() => setShowAdd(false)}
        />
      )}

      <ProductList
        products={products}
        refresh={fetchProducts}
      />
    </div>
  )
}
