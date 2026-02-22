import dotenv from 'dotenv'

dotenv.config()

let razorpay

const keyId = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.trim()
const keySecret = process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.trim()

if (keyId && keySecret) {
  try {
    const { default: Razorpay } = await import('razorpay')
    if (typeof Razorpay === 'function') {
      razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    } else if (Razorpay && Razorpay.default) {
      razorpay = new Razorpay.default({ key_id: keyId, key_secret: keySecret })
    }
  } catch (err) {
    console.warn('razorpay dynamic import/init failed, falling back to mock:', err && err.message)
  }
} else {
  console.warn('RAZORPAY keys not found in environment — using mock razorpay')
}

if (!razorpay) {
  razorpay = {
    orders: {
      async create(options) {
        return {
          id: `mock_order_${Date.now()}`,
          amount: options?.amount || 0,
          currency: options?.currency || 'INR'
        }
      }
    }
  }
}

export default razorpay
