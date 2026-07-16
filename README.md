# 🌱 AgriVest

An advanced, AI-powered farmland investment platform that transforms agricultural assets into data-driven, investable tokens using the global **AGV** currency system.

---

## 🚀 Key Features

- **Fractional Farmland Investment:** Invest globally using AGV tokens pegged 1:1 with USD.
- **Social Trading & Leaderboards:** Follow top-performing portfolios and get real-time toast notifications for new trades.
- **AI-Powered Crop Analysis:** Advanced machine learning algorithms predict yield and evaluate soil health.
- **IoT-Based Farm Monitoring:** Real-time telemetry nodes track moisture, health, and efficiency.
- **Dynamic Dashboards:** Dense 12-column layouts for pro-level analytics, drawing tools on candlestick charts, and performance tables.
- **Automated KYC & Security:** Blockchain-inspired data hashing and secure OTP login timers.

---

## 🛠 Tech Stack

**Frontend Architecture**
- React 18 & Next.js 14 App Router
- Tailwind CSS (Custom Green Aesthetics & Glassmorphism)
- Recharts (Interactive Financial Data Visualization)
- Framer Motion (Micro-animations and Page Transitions)
- Lucide React (Consistent iconography)

**Backend & Data Layer**
- Node.js & Next.js API Routes
- MongoDB (Database: `agrivest_db`)
- JWT & OTP Authentication (In-memory TTL caching)
- Native Crypto Hash Security

---

## 📊 Contributor Leaderboard

We love our community! Here is a visual representation of recent project contributions based on commit history:

```markdown
User           | Commits | Activity Graph
---------------|---------|--------------------------------------------------
Darkness2758   | 11      | ████████████████ (39%)
Khushi Bera    | 8       | ███████████ (29%)
Rishita        | 5       | ███████ (18%)
royrhea        | 4       | ██████ (14%)
```

---

## ⚙️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/khushi2758/Agri-Vest.git
   cd Agri-Vest
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory and add your MongoDB connection string and JWT secret.
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agrivest_db
   JWT_SECRET=your_super_secret_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📈 System Workflow & Architecture

1. **Investor Flow:**
   Registers securely via OTP → Completes KYC → Funds Wallet with AGV → Browses Marketplace → Invests or Follows Top Performers.
2. **Farmer Flow:**
   Lists Agricultural Asset → Connects IoT Sensors → Receives Funding → Updates Crop Status.
3. **Data Pipeline:**
   IoT Sensors → AI Engine → Dashboard Visualization → Revenue Profit Sharing calculations.

---

## 🔒 Security Best Practices

- All passwords and critical user data are hashed using `crypto` HMAC-SHA256.
- OTPs expire strictly after 10 minutes.
- API endpoints are protected by bearer token verification.
- Cross-Site Scripting (XSS) protections enabled on all React forms.

---

## 🌐 Global Currency Strategy (AGV)

The platform operates on **AGV**, a unified digital token. 
1 AGV is strictly pegged to $1 USD. A fractional service fee is deducted during initial conversion to fund technology education initiatives for rural farmers globally.

---
