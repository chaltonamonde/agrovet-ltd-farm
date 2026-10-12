# 🌾 Agrovet Ltd (agrovet.ltd) — Kenya Certified Farm Inputs Storefront

Production-ready e-commerce platform and real-time order logistics management system tailored for Kenyan agricultural producers and farmers.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), semantic mobile-first HTML5, modern CSS3 with HSL palettes, CSS grid, and responsive drawer cart. Zero heavy framework overhead for instant loading on 2G/3G mobile networks across rural Kenya.
- **Backend**: Node.js, Express (standalone local server) and Vercel Serverless Functions (`api/*.js`).
- **Database**: PostgreSQL (with connection pooling via `pg`, indexed lookup keys, and automated schema migration).
- **Payment Gateway**: Safaricom Daraja M-Pesa API (Lipa Na M-Pesa Online STK Push, Buy Goods Till Number & Paybill support, verified webhook reconciliation, and query fallback).
- **Transactional Alerts**: Resend REST API sending itemized HTML order confirmations to customers and merchant admins (`jjjanuaries@gmail.com`).
- **Security**: Bcrypt password hashing, cryptographic HMAC SHA256 HttpOnly sessions, sliding-window rate limiting, and strict domain-isolated CORS.

---

## 📁 Repository Structure

```
├── api/                       # Vercel Serverless Functions
│   ├── _cors.js               # Centralized origin validation & CORS protection
│   ├── _db.js                 # PostgreSQL connection pool & query executor
│   ├── _notify.js             # Transactional email generator & Resend dispatcher
│   ├── _rate-limit.js         # Sliding-window flood protection & brute-force lockout
│   ├── admin.js               # Admin authentication & server-side route guard
│   ├── health.js              # System health, uptime & DB ping diagnostic route
│   ├── mpesa-callback.js      # Safaricom Daraja webhook receiver with amount validation
│   ├── mpesa-query.js         # Daraja STK Query API fallback for delayed callbacks
│   ├── mpesa-stk.js           # Initiates M-Pesa STK Push on customer handset
│   ├── order-status.js        # Real-time storefront payment status polling
│   ├── orders.js              # Customer order persistence & admin order updates
│   └── public-config.js       # Dynamic contact & till config synchronization
├── database/
│   └── schema.sql             # PostgreSQL schema definition & indexed lookup keys
├── templates/
│   ├── admin-dashboard.html   # Full server-side operational management dashboard
│   └── admin-login.html       # Cryptographic authentication gate for administrators
├── js/
│   ├── app.js                 # Storefront catalog, cart, and M-Pesa checkout controller
│   ├── contact.js             # Client-side contact and Till synchronization
│   └── data.js                # Certified Kenyan agricultural catalog & county delivery fees
├── css/
│   └── style.css              # Mobile-first responsive styling
├── scripts/
│   ├── backup-db.js           # Automated timestamped database export utility
│   ├── init-db.js             # Database schema initialization script
│   ├── lint.js                # Cross-platform JavaScript syntax checker
│   ├── test-db-and-auth.js    # Security & server-side route guard verification suite
│   ├── test-serverless-backend.js # End-to-end Daraja STK Push & Webhook integration suite
│   ├── test-order-status-polling.js # Real-time payment polling suite
│   ├── test-rate-limits-and-notifications.js # Rate limiter & transactional email suite
│   └── verify-daraja-credentials.js # Live Safaricom Daraja credentials & OAuth handshake verifier
├── backups/                   # Directory for database snapshots (gitignored)
├── vercel.json                # Vercel deployment, rewrites, and security headers config
├── server.js                  # Local development & LAN mobile testing server
└── package.json               # Project manifest, dependencies, and lifecycle scripts
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js v18+ or v20+
- PostgreSQL local instance or Supabase database

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your database URL and Safaricom Daraja credentials:
```ini
DATABASE_URL="postgresql://user:password@127.0.0.1:5432/agrovet_db"
ADMIN_USERNAME="Chalton"
ADMIN_PASSWORD="your-strong-password"
SESSION_SECRET="your-64-char-random-session-secret"
DARAJA_ENV="sandbox"
DARAJA_CONSUMER_KEY="your-consumer-key"
DARAJA_CONSUMER_SECRET="your-consumer-secret"
DARAJA_BUSINESS_SHORTCODE="174379"
DARAJA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
MPESA_TILL_NUMBER="174379"
```

### 4. Initialize Database
```bash
npm run db:init
```

### 5. Start Development Server
```bash
npm run dev
```
The server binds to `0.0.0.0:3000` to allow access from both your PC and mobile devices on the same Wi-Fi network:
- **Local PC**: `http://localhost:3000`
- **Mobile Device (Wi-Fi)**: `http://<YOUR-LAN-IP>:3000`
- **Admin Portal**: `http://<YOUR-LAN-IP>:3000/admin`

---

## 🧪 Automated Verification & Testing

Run the full automated test and verification suite:

```bash
# 1. Run JavaScript Syntax Linting
npm run lint

# 2. Verify Production Build Check
npm run build

# 3. Security, Route Guards & Bcrypt Authentication Suite
npm test

# 4. Daraja STK Push & Webhook Callback Integration Suite
npm run test:backend

# 5. Real-Time Storefront Polling Suite
npm run test:polling

# 6. Rate Limiting, Brute-Force Lockout & Email Generation Suite
npm run test:security

# 7. Live Safaricom Daraja Handshake Verifier
npm run verify:daraja

# 8. Dependency Vulnerability Audit
npm audit

# 9. Backup PostgreSQL Database
npm run db:backup
```

---

## 💳 Safaricom M-Pesa Payment Flow

1. **Farmer Checkout**: Customer selects county and town hub, enters Safaricom mobile number, and confirms order.
2. **Pending Order Stored**: Order is created in PostgreSQL with status `'Pending STK PIN'`.
3. **STK Push Dispatch**: `/api/mpesa-stk` calls Safaricom Daraja `processrequest` with customer handset number.
4. **Farmer Inputs PIN**: Customer completes authentication on their phone.
5. **Webhook Callback**: Safaricom posts real-time confirmation to `/api/mpesa-callback`.
   - Verifies `ResultCode === 0`.
   - **Amount Verification**: Server checks `paidAmount >= order.total`. If underpaid, flags as `'Partial Payment Flagged'`.
   - **Idempotency Guard**: Atomic update locks order so duplicate webhook retries never send duplicate emails.
   - Marks order as `'Paid'` and stores Safaricom receipt code.
6. **Real-Time Polling**: Customer browser polls `/api/order-status` every 2.5 seconds and immediately renders success modal.
7. **Query Fallback**: If network drops the webhook, `/api/mpesa-query` reconciles status via Safaricom STK Query.
8. **Transactional Alert**: Responsive HTML receipt is dispatched via Resend to merchant admin.

---

## ☁️ Deployment on Vercel

1. Push your repository to GitHub.
2. Link repository to Vercel.
3. In Vercel Project Settings > Environment Variables, add:
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
   - `DARAJA_ENV` (`production`)
   - `DARAJA_CONSUMER_KEY`
   - `DARAJA_CONSUMER_SECRET`
   - `DARAJA_BUSINESS_SHORTCODE`
   - `DARAJA_PASSKEY`
   - `MPESA_TILL_NUMBER`
   - `RESEND_API_KEY`
4. Deploy! Vercel automatically routes `/admin` to `/api/admin` with server-side authentication and static assets with immutable cache headers.
