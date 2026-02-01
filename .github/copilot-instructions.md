# Copilot Instructions - React E-Commerce (SkyMart)

## Architecture Overview

**Full-stack MERN application** with monorepo structure:
- **Frontend**: React 18 (Vite) + Context API + TailwindCSS at project root
- **Backend**: Express.js + MongoDB at `/backend`

### Key Data Flow
1. **Context Store** (`src/Context/storeContext.jsx`): Central state for auth, products, cart, filters
2. **Axios Interceptor** (`src/services/axios.js`): Auto-clears auth on 401, redirects to `/sign-in`
3. **API Services** (`src/services/`): Thin wrapper functions around axios calls
4. **Controllers** (`backend/controllers/`): Business logic; models define data schemas

### Critical Routes (Backend)
- `/api/auth` - register/login (returns token + user object)
- `/api/products` - fetch all products (normalized in context)
- `/api/admin/products` - admin CRUD (requires `protect` + `adminOnly` middleware)
- `/api/cart` - cart operations (add/remove items with category tracking)
- `/api/orders` - order management & placement (requires payment verification)
- `/api/payment` - Razorpay payment verification
- `/api/analytics` - dashboard stats, revenue/orders trends, category breakdown (requires `protect` middleware)

## Essential Developer Workflows

### Frontend Development
```bash
cd /  # project root
npm run dev    # Vite dev server (http://localhost:5173)
npm run build  # vite build
npm run lint   # eslint .
```

### Backend Development
```bash
cd backend
npm run dev    # nodemon (watches index.js, runs on port 5000)
npm start      # production
npm run seed   # database seeding (if available)
```

**Environment Setup**: Both frontend and backend require `.env` files:
- Backend needs: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `RAZORPAY_*` keys
- Frontend Vite config proxies API calls; axios hardcodes `http://localhost:5000` (see `src/services/axios.js`)

## Critical Conventions & Patterns

### Authentication Flow
1. **Register/Login** → returns `{ token, user }`
2. **Token Storage**: `localStorage.setItem("token", ...)` + stored in axios headers
3. **Protected Routes**: Middleware `protect` validates JWT; `adminOnly` checks `user.role === "admin"`
4. **Session Loss**: 401 response triggers logout + redirect to `/sign-in` (axios interceptor)

### Product Data Normalization
Context normalizes backend product responses to consistent schema (see lines 35-45 in `storeContext.jsx`):
```javascript
{ title, image, category, price, rating, isFeatured, discount }
```
Backend may return different field names (`name` vs `title`, `images[0]` vs `image`); context handles it.

### API Service Pattern
Backend service should be thin wrappers:
```javascript
// Good: src/services/productApi.js
export const getProducts = () => axios.get("/products")
export const createProduct = (data) => axios.post("/api/admin/products", data, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
```

### State Management
**Context-only** (no Redux). Key sections in `storeContext.jsx`:
- Auth (user, login, logout)
- Products (fetch, loading, error)
- Filters (search, category, priceRange, minRating, onlyFeatured, onlyDiscount)
- Cart (items, totals, local storage persistence)

## File Structure Essentials

```
/src/services/     → API client functions (axios wrappers)
/src/Context/      → Global state (storeContext.jsx is the single source of truth)
/backend/models/   → Mongoose schemas (User, Product, Order, Cart)
/backend/middleware/  → auth.middleware.js (protect), admin.middleware.js
/backend/controllers/ → Route handlers (business logic)
/backend/routes/   → Route definitions + inline auth checks
```

**Duplicated Routes Warning**: Both `/routes/auth.js` (inline logic) and `/routes/auth.routes.js` + `/controllers/auth.controller.js` exist. **Use the controller pattern** for new features.

## Integration Points & External Dependencies

### Analytics Dashboard
- Frontend: `src/Pages/Admin/Analytics.jsx` fetches 4 endpoints for dashboard display
- Backend: `src/routes/analytics.routes.js` provides protected analytics data
- **Endpoints** (all require `protect` middleware):
  - `GET /api/analytics/stats` - total revenue, orders, users, conversion rate
  - `GET /api/analytics/orders` - orders count grouped by month
  - `GET /api/analytics/revenue` - revenue amount grouped by month  
  - `GET /api/analytics/categories` - sales quantity by category
- **Key Dependencies**: Analytics uses Order aggregations with `totalAmount` field and product `category`

### Order & Cart Schema
- **Cart items**: Each item has `product`, `category`, `title`, `price`, `image`, `quantity`
- **Order products**: Transformed from cart items, stores `qty` (not `quantity`) for aggregation
- **Order totals**: `totalAmount` must be populated from cart before order creation
- **Analytics Flow**: Cart.items → Order.products → Aggregation queries for revenue/category stats

### Database Connections
- MongoDB via `connectDB()` in `backend/config/db.js`
- Models use Mongoose schema middleware for password hashing (`userSchema.pre("save", ...)`)
- Sensitive fields excluded on retrieval: `.select("-password")`

### CORS & Local Development
- Backend listens on `http://localhost:5000` (hardcoded in service files)
- CORS enabled in backend/index.js for frontend requests
- Change port via `PORT` env var (fallback 5000)

## Common Debugging Patterns

- **Auth Failures**: Check `process.env.JWT_SECRET` consistency; JWT expires in 7d (register) or 1d (login)
- **404 Product Routes**: Verify endpoint is mounted in `backend/index.js` (not just controllers)
- **Cart Not Persisting**: Context uses `localStorage.getItem("cart")`—check browser storage is enabled
- **Admin Actions Blocked**: Ensure user.role is "admin"; check middleware chain in route definition

## Task Guidelines for AI Agents

When adding features:
1. **Validate** existing patterns before creating new ones (e.g., use controller pattern for routes)
2. **Normalize** product/order responses in context if schema differs from backend
3. **Include** Bearer token in requests: `headers: { Authorization: `Bearer ${token}` }`
4. **Test** auth flows (logout clears localStorage; 401 triggers redirect)
5. **Check** both root and backend `.env` requirements before testing

## Admin Dashboard Integration

### Frontend Setup
- **Routes**: `/admin` (Dashboard) and `/admin/analytics` (Analytics charts)
- **Protection**: `ProtectedRoute` with `requireAdmin={true}` checks `account?.role === 'admin'`
- **API**: All calls use `getAdminAnalytics()` from `src/services/adminApi.js`
- **Display**: AdminDashboard shows stats cards + category/order/revenue tables

### Backend Aggregation
- **Stats** (`/api/analytics/stats`): Total revenue, orders, users, conversion rate
- **Orders** (`/api/analytics/orders`): Count by month using MongoDB `$month` aggregation
- **Revenue** (`/api/analytics/revenue`): Revenue by month from Order.totalAmount
- **Categories** (`/api/analytics/categories`): Sales quantity from Order.products.category

### Key Data Transformations
- Cart → Order: `items` array becomes `products` array with `qty` (not `quantity`) for aggregation
- Month grouping: Returns `{month: "Jan", orders: 5}` format (hardcoded months array)
- Category sales: Sums product quantities per category from flattened order products

### Connection Checklist
✅ Analytics routes mounted in backend/index.js
✅ Order schema includes `products` array with `category` and `qty` fields
✅ Cart schema includes `category` and uses `quantity` field
✅ AdminDashboard calls `getAdminAnalytics()` which fetches all 4 endpoints
✅ Admin routes protected with admin role check
✅ Frontend running on port 5174, backend on 5000
