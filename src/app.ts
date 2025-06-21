import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import connextion_db from "./config/db-connection";
import authRoutes from "./routes/auth.route"
import usersRoutes from "./routes/user.route"
import teamsRoutes from "./routes/team.route"
import marathonsRoutes from "./routes/marathon.route"
import challengesRoutes from "./routes/challenge.route"
import submissionsRoutes from "./routes/submission.route"
import leaderboardsRoutes from "./routes/leaderboard..route"
import errorHandler from "./utils/errorHandler";
import "./cronJobs/deleteOld"


config();

// Connection DB
connextion_db();

const app = express();

// Middelwares
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Max-Age", "1800");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

//   next();
// });

const allowedOrigins = [
  'https://btix-frontend.vercel.app',
  'https://btix-frontend-git-main-mohameds-projects-f5551999.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman or same-origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Origin not allowed by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/teams", teamsRoutes);
app.use("/marathons", marathonsRoutes);
app.use("/challenges", challengesRoutes);
app.use("/submissions", submissionsRoutes);
app.use("/leaderboards", leaderboardsRoutes);

// Error Handler
app.use(errorHandler);

export default app;