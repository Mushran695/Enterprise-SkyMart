# Order Placed & Payment Flow Documentation

## Overview
This document explains how the order placement and payment flow works in the SkyMart e-commerce application.

## Flow Steps

### 1. **Shopping Cart** (`/cart`)
- User adds products to cart from product pages
- Cart is stored in frontend context (storeContext)
- Cart displays all items with quantity and total price

### 2. **Proceed to Checkout**
- User clicks "Proceed to Buy" button
- System validates:
  - User is logged in
  - Cart is not empty
  - Cart total > 0

### 3. **Cart Synchronization** 
- Frontend cart items are synced to backend database (`/api/cart`)
- Each item includes:
  - `productId`: Product reference
  - `category`: Category name
  - `title`: Product title
  - `price`: Unit price
  - `image`: Product image
  - `quantity`: Number of items

### 4. **Create Razorpay Order**
- Backend creates a Razorpay order via `/api/payment/create-order`
- Sends:
  - `amount`: Total cart value in rupees
- Returns:
  - `orderId`: Razorpay order ID
  - `amount`: Amount in paise
  - `currency`: "INR"

### 5. **Razorpay Payment Modal**
- Razorpay checkout modal opens with:
  - Razorpay order ID
  - Amount
  - Customer name and email (from user context)
  - Custom theme color

### 6. **Payment Verification** ✅ After Successful Payment
- Frontend sends payment details to `/api/payment/verify-payment`:
  - `razorpay_order_id`
  - `razorpay_payment_id`
  - `razorpay_signature`

- Backend verifies signature using HMAC-SHA256:
  - Compares signature with expected value
  - If match: Payment is verified ✅
  - If no match: Payment verification fails ❌

### 7. **Order Creation** (Only if payment verified)
Backend performs:
1. Retrieves user's cart from database
2. Transforms cart items to order format:
   - `items` (from cart) → `products` (for order)
   - `quantity` (from cart) → `qty` (for order)
3. Creates Order document with:
   - `user`: User ID
   - `products`: Array of ordered items with qty, price, category
   - `totalAmount`: Total order value
   - `status`: "Pending"
   - `payment`: Razorpay payment details
4. Clears user's cart from database
5. Returns created order's MongoDB `_id`

### 8. **Order Confirmation Page** (`/order-confirmation/:orderId`)
Displays:
- ✅ Success banner
- Order ID
- Order date & time
- Order status (Pending)
- Order items with images and prices
- Total amount
- Payment status (Paid)
- **Track Order button** (new)

### 9. **Track Order Page** (`/track-order/:orderId`)
Displays:
- Interactive progress bar showing order stages:
  - Pending → Processing → Shipped → Delivered
- Visual timeline with checkmarks
- Current order status with description
- Order items
- Delivery address
- Action buttons to continue shopping

## Database Schemas

### Cart Schema (Temporary)
```javascript
{
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      category: String,
      title: String,
      price: Number,
      image: String,
      quantity: Number
    }
  ],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema (Permanent)
```javascript
{
  user: ObjectId,
  products: [
    {
      product: ObjectId,
      category: String,
      title: String,
      price: Number,
      image: String,
      qty: Number
    }
  ],
  totalAmount: Number,
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled",
  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
  },
  createdAt: Date
}
```

## Key Differences Between Cart and Order

| Aspect | Cart | Order |
|--------|------|-------|
| Field Name | `items` | `products` |
| Qty Field | `quantity` | `qty` |
| Purpose | Temporary shopping | Permanent record |
| Cleared After | Order creation | Never |
| Status | N/A | Pending/Processing/Shipped/Delivered |

## Error Handling

### Payment Verification Failed
- User sees: "Payment verification failed ❌"
- Cart remains on backend (can try again)
- Frontend cart not cleared

### Cart Sync Failed
- User sees: "Failed to sync cart. Please try again."
- Razorpay order not created
- Payment not initiated

### Order Creation Failed (Database Error)
- Backend returns: `success: true, payment_verified: true` (payment is still valid)
- Returns error message in response
- Frontend cart cleared anyway to prevent duplicate orders

## Frontend Components

- **CartSummary** (`src/Components/CartSummary/index.jsx`)
  - Displays cart items
  - Syncs cart to backend
  - Initiates payment flow
  - Redirects to order confirmation

- **OrderConfirmation** (`src/Pages/OrderConfirmation/index.jsx`)
  - Shows order success
  - Displays order details
  - Has "Track Order" button

- **OrderTracking** (`src/Pages/OrderTracking/index.jsx`)
  - Shows order timeline
  - Interactive progress bar
  - Delivery status updates

## Backend Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify-payment` | Verify payment & create order |
| POST | `/api/cart` | Add item to cart |
| GET | `/api/cart` | Get user's cart |
| DELETE | `/api/cart/:id` | Remove item from cart |
| GET | `/api/orders/:id` | Get order details |
| GET | `/api/orders/my` | Get user's orders |

## Testing Payment Flow

1. Go to `/cart`
2. Add products from home page
3. Click "Proceed to Buy"
4. Login if not already logged in
5. Razorpay modal appears
6. Use test card: `4111 1111 1111 1111`
7. Enter any future expiry and CVV
8. Click "Pay"
9. Should see success message and redirect to order confirmation

## Notes

- Payment data is NOT stored locally; only in MongoDB
- Cart is cleared after successful order placement
- Order status can be updated manually in admin panel
- Razorpay public key is embedded in frontend (safe to expose)
- JWT token is required for verification endpoint
- All monetary values are in INR (Indian Rupees)
