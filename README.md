# 🥭 Mango & Papaya Store

A full-stack e-commerce web application for ordering fresh mangoes and papayas, featuring real-time order tracking, an interactive frontend, customer cart & checkout, and a comprehensive admin management dashboard.

---

## 📁 Project Structure

```
mango-papaya-store/
├── admin/        # Admin dashboard (products, orders, analytics)
├── backend/      # Node.js / Express / TypeScript REST API & WebSockets
├── database/     # Database scripts, schemas, and seed data
├── docs/         # Documentation and project assets
└── frontend/     # Customer-facing storefront (React / TypeScript / Vite)
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your environment variables
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Dashboard Setup
```bash
cd admin
npm install
npm run dev
```

---

## 🔒 Security Note
Never commit `.env` or sensitive API keys/passwords to the repository. Use `.env.example` as a template for team members.
