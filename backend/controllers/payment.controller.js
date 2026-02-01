import razorpay from "../config/razorpay.js"
import crypto from "crypto"
import Order from "../models/order.model.js"
import Cart from "../models/cart.model.js"

// ================================
// CREATE RAZORPAY ORDER
// ================================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount) {
      return res.status(400).json({ message: "Amount missing" })
    }

    const orderAmount = Math.round(amount * 100)   // MUST be integer

    const options = {
      amount: orderAmount,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    }

    const order = await razorpay.orders.create(options)

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    })

  } catch (error) {
    console.error("Razorpay Error:", error)
    res.status(500).json({
      message: "Order creation failed",
      error: error.message
    })
  }
}


// ================================
// VERIFY PAYMENT SIGNATURE
// ================================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    // 1️⃣ Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const missing = {}
      if (!razorpay_order_id) missing.razorpay_order_id = "missing"
      if (!razorpay_payment_id) missing.razorpay_payment_id = "missing"
      if (!razorpay_signature) missing.razorpay_signature = "missing"
      
      console.log("❌ Missing fields:", missing)
      console.log("📋 Request body received:", req.body)
      
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
        missing_fields: missing
      })
    }

    // 2️⃣ Log everything Razorpay sent
    console.log("ORDER ID:", razorpay_order_id)
    console.log("PAYMENT ID:", razorpay_payment_id)
    console.log("SIGNATURE FROM RAZORPAY:", razorpay_signature)
    console.log("SECRET USED:", process.env.RAZORPAY_KEY_SECRET)

    // 3️⃣ Create body string
    const body = razorpay_order_id + "|" + razorpay_payment_id
    console.log("BODY STRING:", body)

    // 4️⃣ Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex")

    console.log("EXPECTED SIGNATURE:", expectedSignature)

    // 5️⃣ Compare
    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment signature MATCHED")
      
      // 6️⃣ Save order to MongoDB
      try {
        const userId = req.user._id // Ensure auth middleware sets this
        
        // Get cart items for the user
        const cart = await Cart.findOne({ user: userId })
        if (!cart || !cart.items.length) {
          return res.status(400).json({
            success: true,
            payment_verified: true,
            message: "Payment verified but no cart items found"
          })
        }

        // Calculate total if not present
        let totalAmount = cart.totalAmount
        if (!totalAmount) {
          totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0)
        }

        // Create order document
        const newOrder = new Order({
          user: userId,
          items: cart.items,
          totalAmount,
          payment: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          }
        })

        await newOrder.save()
        console.log("✅ Order saved to MongoDB:", newOrder._id)
        
        // Clear the cart after order is placed
        await Cart.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 })

        return res.status(200).json({
          success: true,
          message: "Payment verified and order created",
          orderId: newOrder._id
        })
      } catch (dbError) {
        console.error("❌ Database error while saving order:", dbError)
        return res.status(500).json({
          success: true,
          payment_verified: true,
          message: "Payment verified but failed to save order",
          error: dbError.message
        })
      }
    } else {
      console.log("❌ Signature mismatch")
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      })
    }

  } catch (err) {
    console.error("🔥 Verification Error:", err)
    return res.status(500).json({
      success: false,
      message: "Verification error",
      error: err.message
    })
  }
}
