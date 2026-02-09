/**
 * Calculate total price of cart
 * Supports quantity and string/number prices
 */
export const totalPrice = (products = []) => {
  return products.reduce((sum, product) => {
    const price = Number(product.price) || 0
    const qty = product.quantity ? Number(product.quantity) : 1
    return sum + price * qty
  }, 0)
}

/**
 * Format price in Indian Rupees (₹)
 */
export const formatINR = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
