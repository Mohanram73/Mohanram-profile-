# MOHANRAM R — Personal Portfolio & Headless Admin CMS

A high-performance personal portfolio website and Admin CMS engineered for **MOHANRAM R**, positioned as a **Full Stack Developer | Software Engineer | Electronics & Embedded Systems Enthusiast**.

---

## ⚡ Architecture & Tech Stack

```
Frontend:   React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Recharts
Backend:    Node.js, Express.js, REST API, Server-Sent Events (SSE)
Database:   Relational SQLite (portfolio.db in WAL mode) - Zero configuration needed
Security:   JWT Authentication, Bcrypt Password Hashing, Rate Limiting, Helmet, Honeypot Anti-Spam
Telemetry:  Privacy-First Analytics (Salted SHA-256 IP Hashing, No Cookies, Real-time SSE Alerts)
```

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js (v18 or higher, tested on v22.15.0)
- npm (v10 or higher)

### Option 1: Run Production Server (Everything on Port 5000)
```bash
# From project root:
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

### Option 2: Run Development Mode with Hot Reload
```bash
# Terminal 1: Backend API Server
cd server
node --watch server.js

# Terminal 2: Vite Frontend Dev Server
cd client
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** for live hot-reloading development with automatic API proxying to port 5000.

---

## 🛡️ Admin CMS Portal (`/admin`)

Access the admin dashboard at:
👉 **[http://localhost:5000/admin](http://localhost:5000/admin)**

### Initial Default Credentials:
- **Email:** `admin@mohanram.dev`
- **Password:** `Admin@123#`

*(You can change the password at any time in the CMS under **System & Security**)*

### Admin Capabilities:
1. **Analytics Dashboard**: Real-time traffic metrics, unique visitor counts, 14-day trend charts, device breakdowns (Desktop vs Mobile vs Tablet), top pages, traffic channels, resume downloads, and live SSE visitor alerts.
2. **Profile & Brand**: Update full name, titles, engineering statements, 4-part narrative bio, contact links, and upload profile pictures.
3. **Hero & Canvas**: Configure headline, subtitle, action buttons, background canvas style (Circuit, Tech Mesh, Cyber Pulse), and overlay opacity.
4. **Experience Timeline**: Manage roles (including pre-seeded VDart Associate WordPress Developer role), add/remove responsibilities, tech badges, and contributions.
5. **Skills Matrix**: Organize competencies across 8 engineering categories with qualitative levels (**Professional**, **Strong**, **Working Knowledge**, **Fundamental**).
6. **Projects & Case Studies**: Manage software and hardware projects with full case study breakdowns (Problem, Approach, Architecture, Tech Stack, Features, Challenges, Solution, Result), including the featured **My Temple** application.
7. **Education & Certs**: Manage academic degrees (B.E. in Electronics & Communication) and industry credentials.
8. **Resume Manager**: Upload new PDF resumes, update active versions, and monitor recruiter download counts.
9. **Contact Messages**: Read inbound inquiries, filter by status (Unread, Read, Replied, Archived), log private notes, and launch direct email replies.
10. **Appearance & Themes**: Toggle Dark/Light themes, customize brand accent colors with live hex palettes.
11. **System & Security**: Toggle visitor arrival email alerts, configure custom SMTP relays, manage SEO metadata, and update admin passwords.

---

## 🔒 Privacy & GDPR Compliance

- **Zero Invasive Tracking**: No advertising cookies, fingerprinting, or cross-site tracking scripts.
- **Salted SHA-256 IP Hashing**: Visitor IPs are hashed before database insertion. Raw IP addresses are never persisted.
- **Minimal Telemetry**: Captures only aggregated page views, referrer categories, and general device families.

---

## 📦 Deployment Guide

### Deploying to Render / Railway / Fly.io / VPS:
1. Push this repository to your GitHub account.
2. Build command:
   ```bash
   npm --prefix client run build
   ```
3. Start command:
   ```bash
   node server/server.js
   ```
4. Set optional environment variables:
   - `PORT=5000` (or host provided)
   - `JWT_SECRET=your-random-secret-key`

---

&copy; 2026 Mohanram R. All rights reserved.
