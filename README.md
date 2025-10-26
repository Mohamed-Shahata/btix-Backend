# 🧩 btix Backend

Backend system built with **Node.js**, **TypeScript**, and **Express**, designed with modular architecture for scalability, performance, and security.

---

## 🚀 Tech Stack

- **Runtime:** Node.js (LTS)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT & Google OAuth 2.0 (Passport.js)
- **Validation:** Zod
- **Mail Service:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting, bcryptjs
- **Scheduling:** node-cron
- **View Engine:** EJS (for mail templates or server-side rendering)
- **Dev Tools:**
  - Nodemon
  - ts-node-dev
  - Concurrently
  - Copyfiles

---

## 📁 Project Structure

```bash
btix-Backend/
│
├── src/
│   ├── config/          # Environment, database, and app configs
│   ├── modules/         # Feature-based modules (e.g., users, auth, etc.)
│   ├── services/        # Business logic and integrations
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth, error handling, etc.
│   ├── utils/           # Helpers, constants, and utilities
│   ├── jobs/            # Cron jobs and schedulers
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
│
├── dist/                # Compiled JS output (after build)
├── .env                 # Environment variables
├── package.json
├── nodemon.json
└── tsconfig.json
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/btix-backend.git
cd btix-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file in the root folder and add the following:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/btix
JWT_SECRET=<your-secret>
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
MAIL_USER=<your-email>
MAIL_PASS=<your-password>
NODE_ENV=development
```

### 4️⃣ Run the project

#### Development mode
```bash
npm run dev
```

#### Production build
```bash
npm run build
npm start
```

---

## 🔐 Features

- Modular and scalable architecture
- JWT authentication with refresh tokens
- Google OAuth 2.0 integration
- Role-based access control
- Secure password hashing with bcrypt
- Email verification & password reset via Nodemailer
- Centralized error handling
- Request validation with Zod
- Rate limiting and Helmet security headers
- Cron jobs with node-cron

---

## 🧰 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Run development server with Nodemon |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the production build |
| `npm run copyfiles` | Copy static/config files after build |

---

## 📬 Contact

**Author:** Mohamed Shehata 
**Email:** [mohamedmrslan@gmail.com]  
**License:** ISC

