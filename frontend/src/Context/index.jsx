import { createContext, useEffect, useState } from "react"
import api from "../api"

export const ShoppingCartContext = createContext()

export const ShoppingCartProvider = ({ children }) => {
  /* =======================
      PRODUCTS
  ======================= */
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /* =======================
      CART
  ======================= */
  const [cartItems, setCartItems] = useState([])
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false)

  /* =======================
      ORDERS
  ======================= */
  const [orders, setOrders] = useState([])

  /* =======================
      UI
  ======================= */
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [productToShow, setProductToShow] = useState(null)

  /* =======================
      AUTH
  ======================= */
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    !!localStorage.getItem("token")
  )
  const [account, setAccount] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  )

  /* =======================
      FILTERS
  ======================= */
  const [searchByTitle, setSearchByTitle] = useState("")
  const [searchByCategory, setSearchByCategory] = useState("")
  const [priceRange, setPriceRange] = useState(null)
  const [minRating, setMinRating] = useState(null)
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [onlyDiscount, setOnlyDiscount] = useState(false)

  /* =======================
      FETCH PRODUCTS
  ======================= */
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/products")

      const products = res.data?.products || res.data || []

      const normalized = products.map(p => ({
        ...p,
        _id: p._id || p.id,
        title: p.title || p.name || "",
        name: p.name || p.title || "",
        image: p.image || p.images?.[0] || "",
        category:
          typeof p.category === "object"
            ? p.category?.name || ""
            : p.category || "",
        price: Number(p.price) || 0,
        rating: Number(p.rating) || 0,
        discount: Number(p.discount) || 0,
        isFeatured: Boolean(p.isFeatured),
      }))

      setItems(normalized)
      setFilteredItems(normalized)
    } catch {
      setError("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  /* =======================
      FILTER LOGIC
  ======================= */
  useEffect(() => {
    let result = [...items]

    if (searchByTitle) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchByTitle.toLowerCase())
      )
    }

    if (searchByCategory) {
      result = result.filter(p =>
        p.category.toLowerCase().includes(searchByCategory.toLowerCase())
      )
    }

    if (priceRange) {
      const [min, max] = priceRange
      result = result.filter(p => p.price >= min && p.price <= max)
    }

    if (minRating) {
      result = result.filter(p => p.rating >= minRating)
    }

    if (onlyFeatured) result = result.filter(p => p.isFeatured)
    if (onlyDiscount) result = result.filter(p => p.discount >= 50)

    setFilteredItems(result)
  }, [
    items,
    searchByTitle,
    searchByCategory,
    priceRange,
    minRating,
    onlyFeatured,
    onlyDiscount,
  ])

  /* =======================
      CART API
  ======================= */
  const loadCart = async () => {
    try {
      const res = await api.get("/cart")
      const items = res.data?.items || []
      // normalize backend item shape to include `qty` expected by UI
      const normalized = items.map(i => ({
        ...i,
        qty: i.quantity || i.qty || 1,
        product: i.product && i.product._id ? i.product._id : i.product,
      }))
      setCartItems(normalized)
    } catch {
      console.error("Load cart failed")
    }
  }

  useEffect(() => {
    if (isUserAuthenticated) loadCart()
    else setCartItems([])
  }, [isUserAuthenticated])

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
      setIsCheckoutSideMenuOpen(true)
    } catch {
      console.error("Add to cart failed")
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`)
      await loadCart()
    } catch {
      console.error("Remove failed")
    }
  }

  /* =======================
      AMAZON STYLE QTY UPDATE
  ======================= */
  const updateCartQty = async (productId, newQty) => {
  if (newQty < 1) {
    await removeFromCart(productId)
    return
  }

  try {
    await api.put("/cart/update", {
      productId,
      qty: newQty
    })

    // reload real MongoDB cart
    await loadCart()
  } catch {
    console.error("Qty update failed")
  }
}

  /* ======================
      FILTER HELPERS
  ====================== */
  const setMaxPrice = (max) => {
    if (max == null) return setPriceRange(null)
    const min = (priceRange && priceRange[0]) || 0
    setPriceRange([min, Number(max)])
  }

  /* =======================
      ORDERS
  ======================= */
  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my")
      setOrders(res.data || [])
    } catch {
      console.error("Orders load failed")
    }
  }

  useEffect(() => {
    if (isUserAuthenticated) loadOrders()
    else setOrders([])
  }, [isUserAuthenticated])

  const checkoutOrder = async () => {
    const products = cartItems.map(i => ({
      product: i.product,
      title: i.title,
      price: i.price,
      quantity: i.qty,
    }))

    const totalAmount = cartItems.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    )

    const res = await api.post("/orders", { products, totalAmount })

    setCartItems([])
    await loadOrders()
    return res.data
  }

  /* =======================
      UI HELPERS
  ======================= */
  const openProductDetail = () => setIsProductDetailOpen(true)
  const closeProductDetail = () => setIsProductDetailOpen(false)
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true)
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false)

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        filteredItems,
        isLoading,
        error,

        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        checkoutOrder,

        orders,

        isProductDetailOpen,
        openProductDetail,
        closeProductDetail,
        productToShow,
        setProductToShow,

        isCheckoutSideMenuOpen,
        openCheckoutSideMenu,
        closeCheckoutSideMenu,

        searchByTitle,
        setSearchByTitle,
        searchByCategory,
        setSearchByCategory,

        priceRange,
        setPriceRange,
        setMaxPrice,
        minRating,
        setMinRating,
        onlyFeatured,
        setOnlyFeatured,
        onlyDiscount,
        setOnlyDiscount,

        isUserAuthenticated,
        account,
        setIsUserAuthenticated,
        setAccount,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  )
}
