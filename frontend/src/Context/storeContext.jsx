import { createContext, useContext, useEffect, useMemo, useState } from "react"
import api from "../api"

export const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  /* ================== AUTH ================== */
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
      return null
    }
  })

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("cart")
    setUser(null)
    setCart({ items: [] })
  }

  /* ================== PRODUCTS ================== */
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get("/products")
      const data = res.data

      const list = Array.isArray(data) ? data : data.products || []

      const normalized = list.map(p => ({
        ...p,
        title: p.title || p.name,
        image: p.image || p.images?.[0],
        category: typeof p.category === "object" ? p.category?.name : p.category,
        price: Number(p.price) || 0,
        rating: Number(p.rating) || 0,
        isFeatured: Boolean(p.featured),
        discount: Number(p.discount) || 0
      }))

      setProducts(normalized)
    } catch (err) {
      console.error("Failed to fetch products", err)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  /* ================== FILTERS ================== */
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [priceRange, setPriceRange] = useState(null)
  const [minRating, setMinRating] = useState(null)
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [onlyDiscount, setOnlyDiscount] = useState(false)

  const setMaxPrice = (max) => {
    if (max == null) return setPriceRange(null)
    const min = (priceRange && priceRange[0]) || 0
    setPriceRange([min, Number(max)])
  }
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search) {
      result = result.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      result = result.filter(
        p => p.category?.toLowerCase() === category.toLowerCase()
      )
    }

    if (priceRange) {
      result = result.filter(
        p => p.price >= priceRange[0] && p.price <= priceRange[1]
      )
    }

    if (minRating) {
      result = result.filter(p => p.rating >= minRating)
    }

    if (onlyFeatured) {
      result = result.filter(p => p.isFeatured)
    }

    if (onlyDiscount) {
      result = result.filter(p => p.discount > 0)
    }

    return result
  }, [products, search, category, priceRange, minRating, onlyFeatured, onlyDiscount])

  /* ================== CART ================== */
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    try {
      return saved ? JSON.parse(saved) : { items: [] }
    } catch {
      return { items: [] }
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch {}
  }, [cart])

  const loadCart = async () => {
    try {
      const res = await api.get("/cart")
      const serverCart = res.data || { items: [], totalAmount: 0 }
      const normalized = {
        items: (serverCart.items || []).map(i => ({
          ...i,
          product: i.product && i.product._id ? i.product._id : i.product,
          quantity: i.quantity || i.qty || 1
        })),
        totalAmount: serverCart.totalAmount || 0
      }
      setCart(normalized)
    } catch (err) {
      console.error("Failed to load cart", err)
      setCart({ items: [] })
    }
  }

  useEffect(() => {
    if (user) loadCart()
    else setCart({ items: [] })
  }, [user])

  const updateCartItemQuantity = async (productId, qty) => {
    if (qty < 1) {
      await removeFromCart(productId)
      return
    }
    try {
      await api.put("/cart/update", { productId, qty })
      await loadCart()
    } catch (err) {
      console.error("Qty update failed", err)
      alert("Failed to update quantity")
    }
  }

  const addToCart = async (product) => {
    try {
      await api.post("/cart", {
        productId: product._id,
        category: product.category,
        title: product.name || product.title,
        price: product.price,
        image: product.image,
      })
      await loadCart()
    } catch (err) {
      console.error("Add to cart failed", err)
      alert("Failed to add to cart")
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`)
      await loadCart()
    } catch (err) {
      console.error("Remove failed", err)
      alert("Failed to remove item")
    }
  }

  const clearCart = async () => {
    try {
      setCart({ items: [] })
      localStorage.removeItem("cart")
    } catch {}
  }

  /* ================== UI ================== */
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [productToShow, setProductToShow] = useState(null)

  return (
    <StoreContext.Provider
      value={{
        /* AUTH */
        user,
        login,
        logout,

        /* PRODUCTS */
        products,
        filteredProducts,
        fetchProducts,
        loading,
        error,

        /* FILTERS */
        search,
        setSearch,
        category,
        setCategory,
        setPriceRange,
        setMaxPrice,
        setMinRating,
        onlyFeatured,
        setOnlyFeatured,
        onlyDiscount,
        setOnlyDiscount,

        /* CART */
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,

        /* UI */
        isProductDetailOpen,
        setIsProductDetailOpen,
        productToShow,
        setProductToShow
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
