import { createContext, useContext, useEffect, useMemo, useState } from "react"
import axios from "../services/axios"

export const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  /* ================== AUTH ================== */
  const [user, setUser] = useState(null)

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
    localStorage.removeItem("cart")
    setUser(null)
    setCart([])
  }

  /* ================== PRODUCTS ================== */
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/products")

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
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p._id === product._id)
      if (exists) {
        return prev.map(p =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p._id !== id))
  }

  const clearCart = () => setCart([])

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
        setMinRating,
        onlyFeatured,
        setOnlyFeatured,
        onlyDiscount,
        setOnlyDiscount,

        /* CART */
        cart,
        addToCart,
        removeFromCart,
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
