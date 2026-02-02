# Testing the Order Placed & Track Order Feature

## Prerequisites
1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:5173`
3. MongoDB is connected
4. Razorpay keys are configured

## Testing Steps

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Step 2: Add Products to Cart
1. Go to `http://localhost:5173/`
2. Click on any product card
3. Click "Add to Cart" button
4. Repeat for 2-3 products
5. You should see cart count increase in the navbar

### Step 3: Navigate to Cart
1. Click the shopping cart icon in navbar
2. Or navigate to `http://localhost:5173/cart`
3. Verify all products are displayed with correct prices
4. Verify cart total matches (sum of all items)

### Step 4: Test Payment Flow
1. Click "Proceed to Buy" button
2. **Scenario A - Not Logged In:**
   - Should redirect to `/sign-in`
   - Sign up/Log in with test credentials
   
3. **Scenario B - Logged In:**
   - Should show Razorpay payment modal
   - Verify customer name and email are populated

### Step 5: Complete Razorpay Payment
1. In Razorpay test modal:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., 12/30)
   - CVV: Any 3 digits (e.g., 123)
2. Click "Pay"
3. Verify success message appears

### Step 6: Verify Order Confirmation Page
URL should be: `http://localhost:5173/order-confirmation/{orderId}`

**Check these elements:**
- ✅ Green success banner saying "Order Placed Successfully 🎉"
- ✅ Order ID (clickable, shows MongoDB _id)
- ✅ Order date and time
- ✅ Order status: "Pending"
- ✅ All products listed with correct images and prices
- ✅ Total amount matches cart total
- ✅ Payment status shows "✓ Paid"
- ✅ **NEW: "Track Order" button is visible**

### Step 7: Test Track Order Page
1. Click the green "Track Order" button
2. Should navigate to: `http://localhost:5173/track-order/{orderId}`

**Check these elements:**
- ✅ Interactive progress bar at top
- ✅ Timeline showing:
  - Order Placed (✓ completed)
  - Processing (pending)
  - Shipped (pending)
  - Delivered (pending)
- ✅ Back button to go back
- ✅ Order items displayed with images
- ✅ Order summary on the right
- ✅ Delivery address (if available)
- ✅ Action buttons: "View All Orders" and "Continue Shopping"

### Step 8: Verify Cart is Cleared
1. Go back to home page
2. Click cart icon
3. Verify cart is empty
4. Local storage should have empty cart array

### Step 9: Test Order History
1. Go to `/my-orders`
2. Verify the newly created order appears in the list
3. Click on the order to see details
4. Verify it matches the order confirmation page

## Test Scenarios

### ✅ Successful Payment Flow
1. Login → Add to cart → Proceed to Buy → Enter card details → Pay
2. Expected: Order confirmation → Track order available

### ❌ Payment Verification Failed
1. Intercept payment verification request (browser DevTools)
2. Modify razorpay_signature to incorrect value
3. Expected: Alert "Payment verification failed ❌"
4. Expected: Cart still available for retry

### ❌ Cart Sync Failed
1. Disconnect backend temporarily
2. Click "Proceed to Buy"
3. Expected: Alert "Failed to sync cart. Please try again."
4. Expected: Razorpay modal doesn't open

### ❌ Not Logged In
1. Logout (clear localStorage)
2. Add products to cart
3. Click "Proceed to Buy"
4. Expected: Redirect to `/sign-in`
5. Expected: Cart preserved after login

## Database Verification

### Check MongoDB Collections

**Orders Collection:**
```bash
# View all orders
db.orders.find()

# View specific order
db.orders.findById(ObjectId("..."))

# Expected structure:
{
  _id: ObjectId,
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
  status: "Pending",
  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
  },
  createdAt: Date
}
```

**Cart Collection:**
```bash
# View all carts
db.carts.find()

# After order placement:
# User's cart should be empty or have items: []
```

## Browser Console Checks

### Expected Console Logs (No Errors)
1. Products fetched successfully
2. Cart synced successfully
3. Payment order created
4. Payment verified successfully
5. Order created with ID: {orderId}

### Check localStorage
```javascript
// Open browser DevTools > Console
localStorage.getItem("user")      // Should show logged-in user
localStorage.getItem("token")     // Should show JWT token
localStorage.getItem("cart")      // Should be empty [] after order
```

## Common Issues & Fixes

### Issue: "Payment verification failed"
**Solution:** 
- Check RAZORPAY_KEY_SECRET in .env
- Verify Razorpay credentials
- Check browser console for error details

### Issue: "Failed to sync cart"
**Solution:**
- Verify backend is running on port 5000
- Check CORS configuration
- Verify /api/cart endpoint is working (test with Postman)

### Issue: Order not appearing in database
**Solution:**
- Check if payment was actually verified
- Check backend logs for errors
- Verify MongoDB connection
- Check if user._id is set correctly in auth middleware

### Issue: Cart not syncing to backend
**Solution:**
- Ensure JWT token is in localStorage
- Check auth middleware is working
- Verify cart items have all required fields

## Performance Notes

- Cart sync adds 1-2 seconds to payment flow
- This is expected for database operations
- Consider caching cart data if too slow

## Next Steps

After successful testing:
1. Deploy backend to production
2. Update Razorpay keys to production keys
3. Update RAZORPAY_KEY in CartSummary.jsx
4. Deploy frontend
5. Test entire flow on production environment
