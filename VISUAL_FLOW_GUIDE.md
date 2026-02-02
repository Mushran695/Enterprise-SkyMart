# Visual Flow Guide - Order Placed & Track Order

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. HOME PAGE (/)                                               │
│     ├─ Browse products                                          │
│     ├─ Add multiple items to cart                              │
│     └─ Verify items appear in cart count (navbar)              │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  2. SHOPPING CART (/cart)                                       │
│     ├─ Display all cart items                                   │
│     ├─ Show item prices and quantities                         │
│     ├─ Display total amount                                    │
│     ├─ Show "FREE Delivery" message                            │
│     └─ "Proceed to Buy" button (yellow)                        │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  3. CHECK AUTHENTICATION                                        │
│     ├─ If NOT logged in:                                        │
│     │  └─ Redirect to /sign-in                                 │
│     └─ If logged in:                                            │
│        └─ Continue to step 4                                   │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  4. SYNC CART TO BACKEND                                        │
│     ├─ POST /api/cart (for each item)                          │
│     ├─ Send: productId, category, title, price, image          │
│     └─ Wait for backend confirmation                           │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │ (If sync fails)
                       X ─── Alert: "Failed to sync cart"
                       │      (Try again)
                       │
                       ▼ (If sync succeeds)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  5. CREATE RAZORPAY ORDER                                       │
│     ├─ POST /api/payment/create-order                          │
│     ├─ Send: amount (cart total in INR)                        │
│     └─ Receive: orderId, amount (in paise)                     │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  6. RAZORPAY PAYMENT MODAL                                      │
│     ├─ Razorpay checkout opens                                 │
│     ├─ Display order amount                                    │
│     ├─ Pre-fill customer name & email                          │
│     ├─ User enters card details:                               │
│     │  ├─ Card: 4111 1111 1111 1111                           │
│     │  ├─ Expiry: 12/30 (or any future date)                  │
│     │  └─ CVV: 123 (or any 3 digits)                          │
│     ├─ Click "Pay" button                                      │
│     └─ (Modal closes after payment)                            │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  7. VERIFY PAYMENT (Backend)                                    │
│     ├─ POST /api/payment/verify-payment                        │
│     ├─ Receive: razorpay_order_id, razorpay_payment_id,       │
│     │           razorpay_signature                             │
│     ├─ Verify signature using HMAC-SHA256                      │
│     ├─ If signature matches:                                   │
│     │  ├─ ✓ Payment verified                                   │
│     │  └─ Continue to step 8                                   │
│     └─ If signature doesn't match:                             │
│        └─ ✗ Payment verification failed (stop)                 │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  8. CREATE ORDER IN DATABASE                                    │
│     ├─ Get user's cart from MongoDB                            │
│     ├─ Transform cart items to order format:                   │
│     │  └─ quantity → qty                                       │
│     │  └─ items → products                                     │
│     ├─ Create Order document with:                             │
│     │  ├─ user: userId                                         │
│     │  ├─ products: [...items]                                 │
│     │  ├─ totalAmount: cart total                              │
│     │  ├─ status: "Pending"                                    │
│     │  └─ payment: {razorpay_details}                          │
│     ├─ Clear user's cart                                       │
│     └─ Return order._id (MongoDB _id)                          │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  9. CLEAR FRONTEND CART                                         │
│     ├─ Clear cart from localStorage                            │
│     ├─ Clear cart from Context (StoreContext)                  │
│     └─ Set cart = []                                           │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  10. ORDER CONFIRMATION PAGE (/order-confirmation/:orderId)     │
│     ├─ Fetch order details from /api/orders/:id                │
│     ├─ Display:                                                │
│     │  ├─ ✅ Green success banner "Order Placed Successfully!"  │
│     │  ├─ Order ID (MongoDB _id)                               │
│     │  ├─ Order date & time                                    │
│     │  ├─ Order status: "Pending"                              │
│     │  ├─ Order items with images & prices                     │
│     │  ├─ Total amount                                         │
│     │  ├─ Payment status: "✓ Paid"                             │
│     │  └─ Order timeline (visual)                              │
│     └─ Action buttons:                                         │
│        ├─ 🟢 "Track Order" (NEW)                               │
│        ├─ 🔵 "View All Orders"                                 │
│        └─ ⚪ "Continue Shopping"                               │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼ (User clicks "Track Order")
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  11. ORDER TRACKING PAGE (/track-order/:orderId)                │
│     ├─ Fetch order details from /api/orders/:id                │
│     ├─ Display:                                                │
│     │  ├─ Back button                                          │
│     │  ├─ "Track Your Order" header                            │
│     │  ├─ Order ID (MongoDB _id)                               │
│     │  ├─ Delivery Status:                                     │
│     │  │  ├─ Status badge with icon                            │
│     │  │  └─ Description text                                  │
│     │  ├─ Progress bar (dynamic based on status)               │
│     │  ├─ Visual Timeline:                                     │
│     │  │  ├─ ✓ Order Placed (green, completed)                │
│     │  │  ├─ 2 Processing (blue or gray, depends on status)    │
│     │  │  ├─ 3 Shipped (blue or gray, depends on status)       │
│     │  │  └─ 4 Delivered (green or gray, depends on status)    │
│     │  ├─ Order items section                                  │
│     │  │  └─ Display all products with images                  │
│     │  └─ Right sidebar:                                       │
│     │     ├─ Order date, items count, payment status           │
│     │     ├─ Subtotal & total amount                           │
│     │     ├─ Delivery address (if available)                   │
│     │     └─ Action buttons                                    │
│     └─ Features:                                               │
│        ├─ Real-time progress bar                               │
│        ├─ Responsive for mobile & desktop                      │
│        └─ Sticky right sidebar                                 │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
       [View All Orders]   [Continue Shopping]
            │                     │
            ▼                     ▼
      /my-orders              /
      (Order History)      (Home)
```

## Component Architecture

```
App (src/App.jsx)
├─ Routes
│  ├─ / (Home)
│  ├─ /cart (CartSummary) ◄── UPDATED
│  ├─ /order-confirmation/:orderId (OrderConfirmation) ◄── UPDATED
│  ├─ /track-order/:orderId (OrderTracking) ◄── NEW
│  ├─ /my-orders (MyOrders)
│  └─ ... other routes

StoreContext (src/Context/storeContext.jsx)
├─ user (login/logout)
├─ products (fetch/filter)
├─ cart (addToCart/removeFromCart/clearCart) ◄── USED BY CARTSUMMARY
└─ filters

CartSummary (src/Components/CartSummary/index.jsx) ◄── UPDATED
├─ Sync cart to backend
├─ Create Razorpay order
├─ Handle payment
├─ Clear cart on success
└─ Navigate to order confirmation

OrderConfirmation (src/Pages/OrderConfirmation/index.jsx) ◄── UPDATED
├─ Fetch order from API
├─ Display order details
├─ Show timeline
└─ Track Order button ◄── NEW

OrderTracking (src/Pages/OrderTracking/index.jsx) ◄── NEW
├─ Fetch order from API
├─ Display progress bar
├─ Show status timeline
├─ Display order items
└─ Show delivery address
```

## API Call Sequence Diagram

```
Frontend                    Backend                    Database
   │                           │                           │
   ├─ POST /api/cart ─────────>│                           │
   │  (sync items)             ├─ Insert cart items ────>│
   │                           │<─ Cart created ────────┤
   │<─ Cart response ──────────┤                           │
   │                           │                           │
   ├─ POST /api/payment/create-order ──────────────────>│ (uses Razorpay API)
   │  (amount)                 ├─ Call Razorpay API       │
   │                           ├─ Create order            │
   │                           │<─ order_id, amount ──┤
   │<─ order response ─────────┤                           │
   │                           │                           │
   │ [Open Razorpay Modal]     │                           │
   │ [User completes payment]  │                           │
   │                           │                           │
   ├─ POST /api/payment/verify-payment ───────────────>│
   │  (order_id, payment_id, signature)                    │
   │                           ├─ Verify signature        │
   │                           ├─ Get cart items ───────>│
   │                           │<─ Cart items ──────────┤
   │                           ├─ Create order ────────>│
   │                           │<─ order created ──────┤
   │                           ├─ Clear cart ─────────>│
   │<─ Order created response ─┤                           │
   │  (with order._id)         │                           │
   │                           │                           │
   ├─ GET /api/orders/:id ────>│                           │
   │  (fetch confirmation)     ├─ Query order ──────────>│
   │                           │<─ Order details ──────┤
   │<─ Order details ──────────┤                           │
   │                           │                           │
   [Show Order Confirmation]   │                           │
   │                           │                           │
   ├─ GET /api/orders/:id ────>│ (for track page)         │
   │  (fetch tracking)         ├─ Query order ──────────>│
   │                           │<─ Order details ──────┤
   │<─ Order details ──────────┤                           │
   │                           │                           │
   [Show Order Tracking]       │                           │
```

## State Transitions

### Frontend State (StoreContext)
```
Initial State:
  cart: []
  user: { name, email, id, token }

After Adding Products:
  cart: [{ _id, title, image, price, qty: 1 }, ...]

During Payment:
  (loading: true)
  
After Payment Success:
  cart: [] ◄── CLEARED

After Navigation:
  cart: [] ◄── EMPTY (verified in /cart)
```

### Order State (Backend)
```
Initial State:
  Order not created
  
After Payment Verification:
  status: "Pending"
  payment: { razorpay_details }
  createdAt: now()
  
After Admin Updates:
  status: "Processing" (or "Shipped", "Delivered", "Cancelled")
  updatedAt: now()
```

## Error Handling Flow

```
Payment Verification Failed
  ├─ ✗ Signature mismatch
  ├─ Return: { success: false }
  ├─ Frontend alert: "Payment verification failed ❌"
  └─ Cart remains available for retry

Cart Sync Failed
  ├─ ✗ Backend /api/cart error
  ├─ Return: { error message }
  ├─ Frontend alert: "Failed to sync cart. Please try again."
  └─ Razorpay order not created

Order Creation Failed
  ├─ ✗ Database error while saving
  ├─ Return: { success: true, payment_verified: true, error }
  ├─ Frontend: Cart still cleared (payment was valid)
  └─ Manual admin intervention needed

Not Authenticated
  ├─ ✗ Missing or invalid JWT
  ├─ Return: { status: 401 }
  ├─ Frontend redirect to /sign-in
  └─ Cart preserved after login
```

---

This visual guide shows the complete flow from browsing products to tracking orders!
