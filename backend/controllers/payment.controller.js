import razorpay from "../config/razorpay.js"
import crypto from "crypto"

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
      console.log("❌ Missing fields:", req.body)
      return res.status(400).json({
        success: false,
        message: "Missing payment details"
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
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      })
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
