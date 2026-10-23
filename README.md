# 🌌 InkVerse — Manga & Manhwa Library, Ordering & Rental Platform

> **Web Technology (WT) Project Assignment**  
> An ultra-modern, responsive Manga & Manhwa Library web application where users can **Order / Buy** physical and digital editions, **Rent** digital volumes with flexible duration tracking, perform **Simulated Real-time Payments** across multiple payment gateways (Credit/Debit Card, UPI QR, Wallets, COD), and track **Recent Orders & Active Rentals** with persistent LocalStorage state.

---

## 🌟 Key Features

### 1. 📖 Manga & Manhwa Vault Catalog
- **Dual Formats**: Full support for Japanese Manga (e.g., *One Piece*, *Berserk*, *Jujutsu Kaisen*, *Chainsaw Man*) and Korean Manhwa / Webtoons (e.g., *Solo Leveling*, *Omniscient Reader's Viewpoint*, *Tower of God*, *The Beginning After The End*).
- **Search & Filter**: Real-time debounced title/author search, format tabs, and dynamic genre pills (*Action, Fantasy, Dark Fantasy, Murim, Supernatural, Sports, Comedy*).
- **Sorting**: Sort by Popularity, Highest Rating, Price (Low to High / High to Low), and Newest.
- **Interactive Reader**: In-app reader supporting Webtoon vertical scrolling and Manga page flip modes, chapter switching, and zoom controls.

### 2. 🛒 Buy & Order System
- **Edition Choices**: Select between *Standard Paperback*, *Deluxe Collector's Hardcover*, and *Digital e-Book*.
- **Cart Management**: Add to cart, adjust quantities, or trigger instant "Buy Now".
- **Dynamic Pricing**: Automatic subtotal, taxes (8%), and free shipping threshold ($50+).

### 3. ⏳ Flexible Rental System
- **Rental Passes**: Rent any title for **7 Days**, **14 Days** (10% discount), or **30 Days** (25% discount).
- **Active Countdown Tracker**: Dynamic calculation of days remaining until rental expiry.
- **Rental Actions**: Extend rental (+7 days) or return early from the user dashboard.

### 4. 💳 Multi-Gateway Payment System
- **Interactive 3D Card Visualizer**: Live flip-on-CVV credit card preview with real-time cardholder and number formatting.
- **UPI & QR Code**: Instant QR code visualization and UPI ID verification.
- **Promo / Coupon Engine**: Supports promotional codes:
  - `OTAKU20` — 20% discount storewide
  - `WELCOME10` — $5.00 off
  - `MANHWA50` — 15% discount
  - `FREESHIP` — Free shipping
- **Printable Tax Invoice**: Generates official order receipt with transaction ID and breakdown.

### 5. 💾 Full Data Persistence (Local Database)
- Automatically saves cart items, wishlist, user profile, placed orders, and active rentals into `localStorage`.
- Includes pre-seeded sample orders and rentals for instant demonstration.
- Allows users/admins to add custom Manga or Manhwa to the library.

---

## 🚀 Quick Start / Local Setup

### Option 1: Direct Browser
Simply double-click `index.html` to open and run the application in any modern web browser.

### Option 2: Local HTTP Server (Python)
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000`.

### Option 3: Node / Serve
```bash
npx serve .
```

---

## 📦 Deployment to Vercel

The application is pre-configured with `vercel.json` for zero-configuration deployment to Vercel.

```bash
npx vercel
```

---

## 🛠 Tech Stack
- **HTML5 & Semantic Markup**
- **Tailwind CSS (Dark theme with cyberpunk anime accents)**
- **Vanilla JavaScript (ES6+ Modules, Object-Oriented Controllers)**
- **Lucide Icons**
- **Canvas Confetti**
- **LocalStorage Data Store**
