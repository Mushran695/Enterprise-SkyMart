import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeftIcon, LockClosedIcon } from "@heroicons/react/24/solid"
import { ShoppingCartContext } from "../../Context"
import Layout from "../../Components/Layout"
import { formatINR } from "../../utils"
import { createOrder } from "../../services/payment"

const RAZORPAY_KEY = "rzp_test_SA848OYsod4lAU" // 🔑 Your Razorpay Public Key

const CartSummary = () => {
  const {
    cartItems,
    isUserAuthenticated,
    user,
    updateCartQty
  } = useContext(ShoppingCartContext)

  const navigate = useNavigate()

  const cartTotal = cartItems.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  )

  const handlePayment = async () => {
  try {
    if (cartTotal <= 0) {
      alert("Your cart is empty")
      return
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Refresh the page.")
      return
    }

    const amount = Math.round(cartTotal)   // send rupees only
    const order = await createOrder(amount)


      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "SkyMart",
        description: "Order Payment",
        order_id: order.id,

     handler: async function (response) {
  try {
    const payload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }

    // VERIFY PAYMENT & CREATE ORDER IN ONE CALL
    const verifyRes = await fetch(
      "http://localhost:5000/api/payment/verify-payment",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      alert("Payment verification failed ❌")
      return
    }

    alert("Order Placed Successfully 🎉")
    // Navigate to order confirmation page with the MongoDB order ID
    navigate(`/order-confirmation/${verifyData.orderId}`)

  } catch (err) {
    console.error(err)
    alert("Payment error: " + err.message)
  }
},



        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@test.com"
        },

        theme: {
          color: "#F4C430"
        }
      }

      const razor = new window.Razorpay(options)
      razor.open()

    } catch (error) {
      console.error(error)
      alert("Payment Failed")
    }
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100 p-2 rounded"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Your SkyMart Cart is empty
            </h2>
            <button
              onClick={() => navigate("/")}
              className="bg-yellow-400 px-6 py-2 rounded font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 bg-white border rounded-lg p-5">
              <div className="flex justify-between border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <span className="text-sm text-gray-500">Price</span>
              </div>

              {cartItems.map(item => (
                <div
                  key={item.product}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      className="w-24 h-24 object-contain"
                      alt={item.title}
                    />

                    <div>
                      <p className="font-medium">{item.title}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateCartQty(item.product, item.quantity - 1)
                          }
                          className="border px-2 rounded hover:bg-gray-100"
                        >
                          −
                        </button>

                        <span className="font-medium">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateCartQty(item.product, item.quantity + 1)
                          }
                          className="border px-2 rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="font-semibold">
                    {formatINR((item.price || 0) * (item.quantity || 0))}
                  </p>
                </div>
              ))}

              <div className="text-right mt-6 font-medium">
                Subtotal ({cartItems.length} items):{" "}
                <strong>{formatINR(cartTotal)}</strong>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white border rounded-lg p-5 h-fit sticky top-24">
              <p className="text-green-700 text-sm mb-3">
                ✔ Your order is eligible for FREE Delivery
              </p>

              <p className="text-lg mb-4">
                Subtotal ({cartItems.length} items):{" "}
                <span className="font-bold text-xl">
                  {formatINR(cartTotal)}
                </span>
              </p>

              {isUserAuthenticated ? (
                <button
                  onClick={handlePayment}
                  className="w-full bg-yellow-400 py-2 rounded font-medium hover:bg-yellow-500"
                >
                  <LockClosedIcon className="h-4 w-4 inline mr-2" />
                  Proceed to Buy
                </button>
              ) : (
                <button
                  onClick={() => navigate("/sign-in")}
                  className="w-full bg-yellow-400 py-2 rounded"
                >
                  Sign in to checkout
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  )
}

export default CartSummary
