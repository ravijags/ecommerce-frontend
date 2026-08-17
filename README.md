<div align="center">

<br />

<p align="center">
  <img src="https://img.shields.io/badge/PREMIA-Everything%20Premium.%20Delivered.-C9A84C?style=for-the-badge&labelColor=0f172a&color=C9A84C" alt="PREMIA" height="36" />
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0f172a" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white&labelColor=0f172a" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white&labelColor=0f172a" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white&labelColor=0f172a" />
  <img src="https://img.shields.io/badge/Razorpay-Live-02042B?style=flat-square&logo=razorpay&logoColor=white&labelColor=0f172a" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white&labelColor=0f172a" />
</p>

<h1>PREMIA</h1>

<p align="center">
  <strong>A production-ready, full-stack e-commerce platform built with the MERN stack.</strong><br />
  Real payments. Real orders. Real admin panel. Nothing fake.
</p>

<p align="center">
  <a href="https://ecommerce-frontend-six-blush.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐 Live Demo-Visit Site-C9A84C?style=for-the-badge&labelColor=0f172a" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/ravijags/ecommerce-v2" target="_blank">
    <img src="https://img.shields.io/badge/⚙️ Backend-Repository-0f172a?style=for-the-badge&labelColor=334155" />
  </a>
</p>

<br />

</div>

---

## What is PREMIA?

PREMIA is a full-stack e-commerce platform for premium products — built entirely from scratch using the MERN stack.

It handles everything a real store needs: product browsing, cart management, live Razorpay payment processing, order tracking, and a complete 7-page admin panel for store management. Every feature works in production. No mocks. No placeholders.

---

## Live URLs

| Service | URL |
|--------|-----|
| 🛍️ Storefront | https://ecommerce-frontend-six-blush.vercel.app |
| ⚙️ Admin Panel | https://ecommerce-frontend-six-blush.vercel.app/admin |
| 🔌 Backend API | https://ecommerce-v2-y8jy.onrender.com |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│        React 18 + Vite · Framer Motion · React Router           │
│   ┌──────────────────────┐    ┌──────────────────────────────┐  │
│   │  Customer Storefront │    │       Admin Panel (7 pages)  │  │
│   │  Home · Cart · Order │    │  Dashboard · Analytics ·     │  │
│   │  Wishlist · Account  │    │  Orders · Products · Users   │  │
│   └──────────┬───────────┘    └──────────────────────────────┘  │
└──────────────┼──────────────────────────────────────────────────┘
               │ HTTPS REST API · JWT in Authorization header
┌──────────────▼──────────────────────────────────────────────────┐
│                         SERVER LAYER                             │
│                  Node.js + Express                               │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│  │   Auth   │ │ Products │ │  Orders  │ │      Payment       │ │
│  │  Routes  │ │  Routes  │ │  Routes  │ │      Routes        │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘ │
│                                                                   │
│     Middleware: JWT Auth · Rate Limiter · CORS · Helmet          │
└──────────────────┬──────────────────────────┬────────────────────┘
                   │                          │
       ┌───────────▼──────────┐   ┌──────────▼──────────┐
       │    MongoDB Atlas      │   │   Razorpay Gateway  │
       │                      │   │                      │
       │  Users · Products    │   │  Create Order        │
       │  Orders · Cart       │   │  Verify HMAC Sig     │
       └──────────────────────┘   └──────────────────────┘
```

---

## Features

### 🛍️ Storefront
- Cinematic hero with animated product glow and counter stats
- 194+ products across 15 categories with real data
- Search, category filter, sort by price / rating / discount
- Product detail with sticky image gallery and animated rating bars
- Frequently Bought Together section
- Wishlist — persistent, move to cart in one click
- Cart with quantity controls, coupon system, savings display
- Live Razorpay checkout with HMAC signature verification
- Order tracking with animated status timeline
- Recently viewed products

### 👤 Customer Account
- JWT authentication — register, login, forgot password, reset password
- Edit profile — name, email, phone number
- Order history with expandable items and print invoice
- Saved addresses
- Wishlist management

### ⚙️ Admin Panel

| Page | Key Features |
|------|-------------|
| **Dashboard** | Revenue stats, 14-day bar chart, order status breakdown, top categories, low stock alerts |
| **Analytics** | Revenue + orders line charts, date range 7d/14d/30d/90d, top products by revenue, category breakdown |
| **Orders** | Search, status filter tabs, expandable rows, bulk status update, order detail page with timeline |
| **Products** | Sortable table, CSV export, pagination 20/page, bulk delete, add/edit modal with image upload |
| **Users** | Customer cards with stats, admin-protected delete |
| **Coupons** | Create/edit/delete codes, % and ₹ discount types, usage tracking, integrates with cart at checkout |
| **Settings** | Store config, shipping/tax rates, Razorpay key management, notification toggles |

### 📱 Mobile
- Bottom navigation — Home, Search, Wishlist, Cart, Account
- Filled gold active state icons
- Dark top bar matching hero
- Touch-optimized layouts throughout
- Mobile admin panel with hamburger sidebar

---

## Tech Stack

### Frontend
| Package | Purpose |
|---------|---------|
| `react@18` | UI framework |
| `vite@5` | Build tool |
| `framer-motion` | Animations |
| `react-router-dom@6` | Client routing |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icon library |

### Backend
| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth |
| `bcryptjs` | Password hashing |
| `razorpay` | Payment SDK |
| `helmet` | Security headers |
| `express-rate-limit` | Rate limiting |
| `express-mongo-sanitize` | NoSQL injection prevention |
| `resend` | Transactional email |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting + CDN |
| Render | Backend hosting |
| MongoDB Atlas | Database |
| Razorpay | Payment processing |

---

## Payment Flow

```
1. User clicks "Proceed to Checkout"
           │
           ▼
2. POST /api/orders
   Body: { items, totalAmount, shippingAddress }
   → Creates order in MongoDB
   → Returns: { orderId }
           │
           ▼
3. POST /api/payment/create-order
   Body: { orderId }
   → Calls Razorpay API
   → Returns: { razorpayOrderId, amount, keyId }
           │
           ▼
4. Razorpay popup opens
   → User pays via UPI / Card / Net Banking
           │
           ▼ (on payment success)
5. POST /api/payment/verify
   Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
   → Verifies HMAC SHA256 signature
   → Marks order as paid in MongoDB
           │
           ▼
6. User redirected to /orders
```

---

## API Reference

### Auth
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/update` | Yes | Update profile |
| POST | `/api/auth/forgot-password` | No | Send reset email |
| POST | `/api/auth/reset-password` | No | Reset password |

### Products
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/api/products` | No | All products |
| GET | `/api/products/:id` | No | Single product |
| POST | `/api/admin/products` | Admin | Add product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/orders` | Yes | Place order |
| GET | `/api/orders` | Yes | My orders |
| GET | `/api/orders/:id` | Yes | Single order |
| PUT | `/api/orders/:id/cancel` | Yes | Cancel order |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/:id` | Admin | Update status |

### Payment
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/payment/create-order` | Yes | Create Razorpay session |
| POST | `/api/payment/verify` | Yes | Verify payment signature |

---

## Database Schema

### User
```js
{
  name:      String,          // required
  email:     String,          // required, unique
  password:  String,          // bcrypt hashed, never returned
  phone:     String,
  role:      'user' | 'admin',
  createdAt: Date
}
```

### Product
```js
{
  name:          String,      // required
  brand:         String,
  category:      String,
  price:         Number,      // sale price in INR
  originalPrice: Number,      // MRP
  discount:      Number,      // percentage
  stock:         Number,
  image:         String,      // URL
  description:   String,
  rating:        Number,      // 0-5
  createdAt:     Date
}
```

### Order
```js
{
  user:            ObjectId,  // ref: User
  items: [{
    product:       ObjectId,  // ref: Product
    quantity:      Number,
    price:         Number     // snapshot at time of order
  }],
  totalAmount:     Number,
  shippingAddress: String,
  status:          'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus:   'pending' | 'paid',
  paymentId:       String,    // Razorpay payment ID
  razorpayOrderId: String,    // Razorpay order ID
  createdAt:       Date
}
```

---

## Local Setup

### Requirements
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Razorpay test account

### Backend
```bash
git clone https://github.com/ravijags/ecommerce-v2
cd ecommerce-v2
npm install
```

Create `.env`:
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RESEND_API_KEY=re_...
```

```bash
npm run dev
# Server running on http://localhost:3000
```

### Frontend
```bash
git clone https://github.com/ravijags/ecommerce-frontend
cd ecommerce-frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

```bash
npm run dev
# App running on http://localhost:5173
```

---

## Project Structure

### Frontend `src/`
```
pages/
├── Home.jsx              # Hero, product grid, filters, sorting
├── ProductDetail.jsx     # Product page, add to cart/wishlist
├── Cart.jsx              # Cart management, coupon, Razorpay
├── Orders.jsx            # Order history with timeline
├── Wishlist.jsx          # Saved products grid
├── Account.jsx           # Profile, addresses, security tabs
├── Login.jsx             # Authentication forms
├── ForgotPassword.jsx    # Password reset email
├── ResetPassword.jsx     # Password reset form
└── admin/
    ├── AdminSidebar.jsx      # Shared sidebar (all pages)
    ├── AdminDashboard.jsx    # Stats, chart, quick actions
    ├── AdminAnalytics.jsx    # Line charts, date range
    ├── AdminOrders.jsx       # Orders table, bulk update
    ├── AdminOrderDetail.jsx  # Order timeline, print invoice
    ├── AdminProducts.jsx     # Products CRUD, CSV export
    ├── AdminUsers.jsx        # Customer management
    ├── AdminCoupons.jsx      # Coupon CRUD
    └── AdminSettings.jsx     # Store configuration

components/
├── Header.jsx            # Desktop nav + mobile top bar
├── Footer.jsx            # Links, payment icons, social
├── BottomNav.jsx         # Mobile bottom navigation
└── ProductCard.jsx       # Reusable product card with tilt
```

### Backend
```
controllers/
├── authController.js     # Register, login, profile, password
├── productController.js  # Product CRUD
├── orderController.js    # Place order, get orders, cancel
└── paymentController.js  # Razorpay create + verify

models/
├── User.js
├── Product.js
└── Order.js

routes/
├── authRoutes.js
├── productRoutes.js
├── orderRoutes.js
├── paymentRoutes.js
├── adminRoutes.js
└── wishlistRoutes.js

middleware/
├── authMiddleware.js     # JWT token verification
├── adminMiddleware.js    # Admin role enforcement
└── rateLimiter.js        # Request rate limiting
```

---

## Technical Decisions

**Why JWT over sessions?**
Frontend on Vercel and backend on Render are different domains. Sessions need a shared store. JWT is stateless — scales horizontally without infrastructure changes.

**Why Razorpay over Stripe?**
Razorpay supports UPI, net banking, and all Indian payment methods natively. No additional KYC for test mode. Designed for the Indian market.

**Why Vercel + Render over a single server?**
Frontend gets Vercel's global CDN edge network. Backend gets Render's managed infrastructure with auto-scaling. Both have generous free tiers suited for a portfolio project.

**Why MongoDB over SQL?**
Product catalogs have varying attributes across categories — a fragrance has different fields than a laptop. MongoDB's flexible schema handles this naturally without complex joins.

---

## What's Next

- [ ] Redis caching for product queries
- [ ] TypeScript migration
- [ ] Unit tests with Jest
- [ ] Email notifications for order status changes
- [ ] Product reviews from customers
- [ ] PWA support for mobile app experience
- [ ] Multi-currency support

---

<div align="center">

**Built from scratch. Every line written. Nothing copied.**

<br />

Made with ♥ in India by **Ravi Jags**

<br />

[![GitHub](https://img.shields.io/badge/GitHub-ravijags-0f172a?style=flat-square&logo=github&logoColor=white)](https://github.com/ravijags)

<br />

<img src="https://img.shields.io/badge/PREMIA-Everything%20Premium.%20Delivered.-C9A84C?style=flat-square&labelColor=0f172a" />

</div>
