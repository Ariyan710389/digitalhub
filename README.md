# DigitalHub — Digital Products & Services E-Commerce Platform

A production-oriented e-commerce website built specifically for selling digital products, AI subscriptions, software licenses, online courses, and professional digital services in Bangladesh.

![Design System: Ultra-Dark Neon Tech](https://img.shields.io/badge/Theme-Ultra--Dark%20Neon%20Tech-00D9FF?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)
![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-1B2A45?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css)
![Bangladesh MFS](https://img.shields.io/badge/Payments-bKash%20%7C%20Nagad%20%7C%20Rocket%20%7C%20COD-pink?style=for-the-badge)

---

## 🌟 Key Features

### 1. Ultra-Dark Neon Tech Design System
- **Main Background**: `#050812` (pure deep space)
- **Secondary Background**: `#080D1B`
- **Header & Navigation**: `#070B16`
- **Product Cards**: `#0B1224`
- **Elevated Panels**: `#101A30`
- **Neon Accents**: Cyan `#00D9FF`, Electric Blue `#2563FF`, Neon Purple `#8B3DFF`
- **Neon Gradient**: `linear-gradient(110deg, #00D9FF, #2563FF, #8B3DFF)`

### 2. Storefront & Customer Journeys
- **Two-row Header**: Brand Logo, centered search bar, real-time live cart drawer trigger with item count badge, authentication links, and social channels.
- **Hero Carousel**: Promotional slider with glowing 3D device visuals, animated category badges (`AI`, `</>`, `Courses`, `Marketing`), and direct CTA actions.
- **Category Navigation**: 7 dedicated digital product categories matching mockup design.
- **Dynamic Product Cards with Variations**:
  - Live variation dropdown (1 Month, 1 Year, 5 Pages, Lifetime Access, etc.).
  - Automatic price and discount recalculation upon changing variations.
  - Snapshot pricing preserved in order history.
- **Special Offer Banner**: Stats counters (10K+ Happy Customers, 500+ Digital Products, 99% Satisfaction Rate).
- **Slide-out Cart Drawer & Full Cart Page**: Quantity increment/decrement, remove item, subtotal and instant free delivery indicators.
- **Checkout Flow**:
  - Guest and logged-in customer support.
  - Full Bangladesh validation (01XXXXXXXX phone validation, name, email).
  - Selective payment methods: **bKash**, **Nagad**, **Rocket**, **Cash on Delivery**.
  - Dynamic receiving numbers with one-click copy.
  - Transaction ID (TrxID) and sender number collection.
- **Order Tracking**: Real-time status display (`PAYMENT_UNDER_REVIEW`, `PAID`, `PROCESSING`, `COMPLETED`), delivery notes, and purchase receipt.

### 3. Dedicated Admin Dashboard (`/admin`)
- **Real-time Overview**:
  - Confirmed Revenue (calculated strictly from verified `PAID` or `COMPLETED` orders).
  - Total Orders and pending fulfillment count.
  - Active catalog count and registered customer base.
- **Product & Variation Creator (`/admin/products/new`)**:
  - Add new digital subscriptions, software licenses, course packages, or downloads.
  - Configure multi-tiered variations (Plans, Durations) with custom regular & sale prices (৳ BDT) and automated SKU generation.
  - Real-time stock status and storefront publish toggling.
- **Category Management (`/admin/categories`)**:
  - Create and edit categories with icons, slugs, and display ordering.
  - Active status switches and live product count badges.
- **Manual Payment Verification System (`/admin/payments`)**:
  - Filter by `Pending Review`, `Approved`, `Rejected`, or `All`.
  - Inspect Transaction ID (TrxID), sender number, customer contact, and order amount.
  - One-click **Approve** (marks order as `PAID`) or **Reject** (marks order as `FAILED`).
  - Full audit logging of administrator actions.
- **Order Management (`/admin/orders`)**:
  - Filter orders by status or search by customer name/email/TrxID.
  - Inline status update dropdown.
- **Dynamic Payment Settings (`/admin/settings`)**:
  - Change bKash receiving number, Nagad number, and Rocket receiving number directly from the dashboard.
  - Update payment instructions and toggle method active status **without touching code**.
  - Immediate reflection on customer checkout.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Seed
1. Clone or navigate to the project directory:
   ```bash
   cd digitalhub
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and apply Prisma schema:
   ```bash
   npx prisma db push
   ```
4. Run the seed script to populate products, categories, payment methods, and admin user:
   ```bash
   npx tsx prisma/seed.ts
   ```
5. Run the production build or development server:
   ```bash
   # Production build test:
   npm run build
   npm run start

   # Or Development mode:
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Seed User Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@digitalhub.com` | `Admin@12345` | Storefront + `/admin` Dashboard |
| **Customer** | `customer@gmail.com` | `Customer@12345` | Storefront + `/account` Dashboard |

---

## 💰 Monetary Representation

To avoid floating point arithmetic errors, all monetary values in DigitalHub are stored in the database as **integers in Paisa** (1 BDT = 100 Paisa).
- ৳1,200 is stored as `120000`
- ৳4,999 is stored as `499900`
- Handled seamlessly with utility functions: `formatPrice()`, `paisaToNumber()`, and `numberToPaisa()`.

---

## 🛡️ Security & Integrity Highlights
- **Server-side Price & Stock Validation**: Cart prices sent from the client are never trusted. All line items are re-queried from the database and calculated server-side during checkout.
- **Payment Verification Integrity**: Manual mobile payments are never marked as verified solely because a user entered a transaction ID. Orders with submitted TrxIDs enter `PAYMENT_UNDER_REVIEW` until an admin verifies the payment.
- **Password Security**: Passwords hashed using bcrypt (10 salt rounds).
- **Protected Digital Routes**: Admin dashboard and customer account routes are secured via NextAuth JWT session validation.
- **Audit Logs**: All admin approvals, rejections, and setting modifications are tracked in the `AuditLog` database table.
