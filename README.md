# 🛒 SkyMart — MERN E‑Commerce Platform

Professional, production-ready full-stack E‑Commerce reference application built with React (Vite), Node.js, Express, MongoDB and Razorpay.

Live demo and reference deployment links are provided below. This repository is suitable for portfolio showcase, production deployments, and open-source contributions.

---

## 🔎 Short Description

SkyMart is a modern, API-driven E‑Commerce application implementing best-practice patterns for authentication, role-based access, payments, and admin operations. It includes a mobile-first responsive storefront, a secure backend API, and an Admin Dashboard for product and order management.

---

## 🔗 Live Demo URLs

| Role | Frontend | Backend |
|---|---:|---:|
| Production (Frontend) | https://sky-mart.example.com (replace with deployed URL) | https://api.sky-mart.example.com (replace with deployed URL)

> Note: Replace the example demo URLs above with your actual Vercel / Render deployment links.

---

## 🧰 Tech Stack

- Frontend: React 18 + Vite, React Router, Tailwind CSS, Context API
- Backend: Node.js, Express.js, RESTful APIs
- Database: MongoDB (Mongoose models)
- Payments: Razorpay integration (server-side signature verification)
- Hosting / Deployment: Vercel (frontend), Render / Heroku / Render for backend
- Tooling: ESLint, Prettier, Nodemon (dev), Vite build

---

## 🏗 Project Architecture (text diagram)

The system follows a classic client-server architecture with a clear separation of concerns:

- Browser (React) ⇄ REST API (Express) ⇄ MongoDB
- Payments: Browser opens Razorpay checkout → Razorpay posts result → Backend verifies signature → Backend creates Order from server Cart
- Admin Dashboard: Authenticated admin calls protected API endpoints (adminOnly middleware) for product/order management

Simplified flow:

1. User browses products (GET /api/products)
2. User adds items (local Context + optional sync to server Cart via /api/cart)
3. Checkout creates a Razorpay order (POST /api/payment/create-order)
4. Razorpay payment completes; frontend posts signature to /api/payment/verify-payment
5. Server verifies signature and atomically creates an Order from server-side Cart

---

## ✨ Key Features

- User authentication: Sign up / Sign in flows
- JWT-based secure sessions with Authorization headers
- Product browsing, filtering and categories
- Cart management with server-side cart persistence
- Order placement and order history
- Razorpay payment integration and server-side verification
- Admin Dashboard with analytics, product and order management
- Role-based access control (adminOnly middleware)
- Mobile-responsive UI (Tailwind CSS)
- API-driven architecture for decoupled front/back development

---

## 🗂 Folder Structure (high level)

Root overview (important folders/files):

```
/.               # repo root (frontend + backend folders)
├─ backend/       # Express API, controllers, models, routes
│  ├─ controllers/ # business logic (auth, product, cart, order, payment, analytics)
│  ├─ models/      # Mongoose schemas (User, Product, Cart, Order)
│  ├─ routes/      # Express route definitions
│  ├─ config/      # DB + 3rd-party config (Razorpay)
│  └─ index.js     # server bootstrap
├─ src/            # Frontend (Vite + React)
│  ├─ Components/  # Reusable UI components and admin UI
│  ├─ Pages/       # Route pages (Home, Product, Cart, Admin, etc.)
│  ├─ Context/     # React Context store for global state
│  ├─ services/    # API client wrappers (axios, adminApi, productApi)
│  └─ main.jsx     # Frontend bootstrap
├─ public/         # Static assets
├─ package.json    # root scripts (dev, build, etc.)
└─ backend/package.json
```

Frontend notes:
- `src/Context/storeContext.jsx` centralizes auth, products, cart, filters and sync logic.
- `src/services/axios.js` contains axios instance and interceptors (auto-logout on 401).

Backend notes:
- Controllers use `protect` middleware to validate JWT and `adminOnly` to enforce admin access.
- Razorpay verification happens in `backend/controllers/payment.controller.js`.

---

## 🔌 API Endpoints Overview

**Authentication**
- POST /api/auth/register — create account
- POST /api/auth/login — returns `{ token, user }`

**Products**
- GET /api/products — public list
- GET /api/products/:id — product detail

**Cart**
- GET /api/cart — get current user's cart (protected)
- POST /api/cart — add item (protected)
- DELETE /api/cart/:id — remove item (protected)
- PUT /api/cart/update — set item quantity (protected)

**Orders**
- POST /api/orders — create order (protected)
- GET /api/orders/my — get user orders (protected)

**Payments**
- POST /api/payment/create-order — create Razorpay order (server)
- POST /api/payment/verify-payment — verify Razorpay signature and create Order (server)

**Admin (protected + adminOnly)**
- GET /api/admin/products — admin product CRUD
- GET /api/admin/orders — admin order listing
- GET /api/analytics/* — analytics endpoints

Refer to `backend/routes/` for full route list and `backend/controllers/` for request/response details.

---

## ⚙️ Environment Variables

Create `.env` in `backend/` (and `.env` in frontend if needed). Required variables:

```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Frontend (Vite) optional envs (create `.env.local`):

```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=rzp_test_...    # optional override for testing
```

---

## ▶️ How to Run Locally

Prerequisites:
- Node.js 18+ (LTS recommended)
- npm or yarn
- MongoDB Atlas connection (or local MongoDB)

**Frontend**

```bash
# from repo root
npm install
npm run dev         # starts Vite dev server (http://localhost:5173)
```

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # or create .env with variables above
npm run dev            # nodemon / dev server on PORT (default 5000)
```

Notes:
- Frontend calls the backend using `src/services/baseUrl.js` or `VITE_API_URL`.
- Ensure both frontend and backend are running and that `VITE_API_URL` points to your backend during development.

---

## 🚀 Deployment (Vercel & Render)

**Frontend (Vercel)**
1. Connect your GitHub repo to Vercel.
2. Set `Build Command` → `npm run build` and `Output Directory` → `dist`.
3. Add environment variable `VITE_API_URL` to point to your backend URL.

**Backend (Render)**
1. Create a new Web Service on Render, connect to repo's `backend/` folder.
2. Set the build command: `npm install` and start command: `npm start` or `npm run dev` for staging.
3. Add environment variables (MongoDB URI, JWT_SECRET, Razorpay keys) in the Render dashboard.

DNS and CORS
- Configure CORS in backend to allow your frontend origin.
- Use HTTPS endpoints in production.

---

## 🗄 Database Setup (MongoDB Atlas)

1. Create a free MongoDB Atlas cluster.
2. Create a database user and whitelist your IP (or 0.0.0.0/0 for dev).
3. Copy the connection string and set `MONGODB_URI` in backend `.env`.
4. Run any seed scripts if provided: `node backend/scripts/migrate_db.js` or `npm run seed`.

---

## 🔐 Admin Access

- There is a `backend/scripts/createAdmin.js` helper to create an admin user for development.
- In production, create an admin via a secure admin-onboarding workflow or seed the DB manually.

---

## 💳 Payment Gateway (Razorpay) Setup

1. Create a Razorpay account and get `KEY_ID` and `KEY_SECRET` (test mode available).
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`.
3. Frontend uses the public key to open checkout; backend must verify signature using the secret in `/api/payment/verify-payment`.
4. Test using Razorpay test cards and sandbox modes.

---

## 🛡 Security Features

- JWT-based authentication with `Authorization: Bearer <token>` for protected routes.
- `protect` middleware validates tokens; `adminOnly` middleware restricts admin APIs.
- Server-side payment signature verification to prevent spoofed payments.
- Input validation and error handling in controllers (recommend adding JOI/zod for stricter validation).
- CORS and rate-limiting advised for production.

---

## 📱 Mobile & Desktop Compatibility

- Mobile-first responsive UI built with Tailwind CSS. Components are tested across common breakpoints.
- Recommended browsers: latest Chrome, Firefox, Safari, Edge.

---

## 🖼 Screenshots

Add screenshots to `/public/screenshots/` and reference them here:

![Home](/public/screenshots/home.png)
![Product](/public/screenshots/product.png)
![Cart](/public/screenshots/cart.png)
![Admin](/public/screenshots/admin.png)

---

## 🔭 Future Enhancements

- Stronger input validation (Joi/Zod) and centralized error middleware
- Webhooks for payment and order lifecycle events
- Improved unit and integration test coverage (Jest, Supertest)
- Image CDN + optimized media pipeline
- Internationalization (i18n) and multi-currency support
- CI/CD pipelines and automated deployments

---

## 🧰 Troubleshooting

- 401 on API calls: check `JWT_SECRET` consistency and token storage in `localStorage`.
- Razorpay signature errors: ensure server uses the correct secret and the payload matches Razorpay docs.
- CORS errors: add frontend origin to backend CORS whitelist.
- Production build errors: ensure `VITE_API_URL` is set in environment variables.

---

## 🤝 Contribution Guidelines

1. Fork the repository and create a feature branch: `feature/your-feature`.
2. Keep changes small and focused; run tests locally.
3. Submit a pull request with a clear description and link to any relevant issue.
4. Follow the repository's code style (ESLint + Prettier). Add tests for new behavior.

---

## 📜 License

This project is open-source. Choose an appropriate license (MIT recommended). Example:

```
MIT License
Copyright (c) 2026 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
```

---

## ❤️ Credits

- Original project scaffold and architecture by the SkyMart authors.
- Built with open-source technologies: React, Express, MongoDB, Razorpay.

---

## 📌 Final Notes

This repository is production-ready as a reference; before going live, review security settings, rotate secrets, enable SSL, add monitoring/logging, and create data backups. If you want, I can also:

- Add automated tests (Jest + Supertest)
- Add CI/CD configuration for Vercel / Render
- Harden security (rate limiting, helmet, stricter input validation)

Thank you for using this project — great choice for a modern MERN showcase.
