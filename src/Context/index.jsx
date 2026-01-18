import { createContext, useState, useEffect, useMemo } from 'react'

export const ShoppingCartContext = createContext()

export const ShoppingCartProvider = ({ children }) => {
  /* ================= CART ================= */
  const [count, setCount] = useState(0)
  const [cartProducts, setCartProducts] = useState([])
  const [order, setOrder] = useState([])

  /* ================= UI ================= */
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false)
  const [productToShow, setProductToShow] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  /* ================= PRODUCTS ================= */
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])

  /* ================= FILTERS ================= */
  const [searchByTitle, setSearchByTitle] = useState('')
  const [searchByCategory, setSearchByCategory] = useState('')
  const [priceRange, setPriceRange] = useState(null)
  const [minRating, setMinRating] = useState(null)
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [onlyDiscount, setOnlyDiscount] = useState(false)

  /* ================= AUTH ================= */
  const [account, setAccount] = useState(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

  /* ================= UI ACTIONS ================= */
  const openProductDetail = () => setIsProductDetailOpen(true)
  const closeProductDetail = () => setIsProductDetailOpen(false)
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true)
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false)

  /* ================= LOAD SESSION ================= */
  useEffect(() => {
    const savedAccount = localStorage.getItem('account')
    const savedAuth = localStorage.getItem('isUserAuthenticated')
    const savedOrder = localStorage.getItem('order')

    if (savedAccount && savedAuth === 'true') {
      setAccount(JSON.parse(savedAccount))
      setIsUserAuthenticated(true)
    }

    if (savedOrder) setOrder(JSON.parse(savedOrder))
  }, [])

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    setIsLoading(true)

    fetch('https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json')
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(item => {
          // ✅ SAFE PRICE HANDLING
          const usdPrice =
            typeof item.price === 'number' && item.price > 0
              ? item.price
              : Math.floor(Math.random() * 40) + 10 // fallback USD 10–50

          const priceINR = Math.round(usdPrice * 80)

          const discount = Math.random() > 0.6 ? 50 : 0
          const finalPrice = discount
            ? Math.round(priceINR - (priceINR * discount) / 100)
            : priceINR

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            images: [item.image],
            category: { name: item.category },

            price: finalPrice,
            originalPrice: priceINR,
            discount,

            rating: Math.floor(Math.random() * 2) + 4,
            featured: Math.random() > 0.7
          }
        })

        setItems(normalized)
        setFilteredItems(normalized)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return items
      .filter(p =>
        !searchByTitle ||
        p.title.toLowerCase().includes(searchByTitle.toLowerCase())
      )
      .filter(p =>
        !searchByCategory || p.category.name === searchByCategory
      )
      .filter(p =>
        !priceRange || (p.price >= priceRange[0] && p.price <= priceRange[1])
      )
      .filter(p =>
        !minRating || p.rating >= minRating
      )
      .filter(p =>
        !onlyFeatured || p.featured
      )
      .filter(p =>
        !onlyDiscount || p.discount > 0
      )
  }, [
    items,
    searchByTitle,
    searchByCategory,
    priceRange,
    minRating,
    onlyFeatured,
    onlyDiscount
  ])

  useEffect(() => {
    setFilteredItems(filteredProducts)
  }, [filteredProducts])

  /* ================= CART METHODS ================= */
  const addToCart = product => {
    setCartProducts(prev => [...prev, product])
    setCount(prev => prev + 1)
    openCheckoutSideMenu()
  }

  const removeFromCart = id => {
    setCartProducts(prev => prev.filter(p => p.id !== id))
    setCount(prev => Math.max(prev - 1, 0))
  }

  /* ================= CONTEXT PROVIDER ================= */
  return (
    <ShoppingCartContext.Provider
      value={{
        count,
        cartProducts,
        addToCart,
        removeFromCart,
        order,
        setOrder,

        isProductDetailOpen,
        openProductDetail,
        closeProductDetail,
        isCheckoutSideMenuOpen,
        openCheckoutSideMenu,
        closeCheckoutSideMenu,
        productToShow,
        setProductToShow,
        isLoading,

        items,
        filteredItems,

        searchByTitle,
        setSearchByTitle,
        searchByCategory,
        setSearchByCategory,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        onlyFeatured,
        setOnlyFeatured,
        onlyDiscount,
        setOnlyDiscount,

        account,
        isUserAuthenticated
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  )
}
