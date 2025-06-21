import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import connextion_db from "./config/db-connection";
import authRoutes from "./routes/auth.route";
import usersRoutes from "./routes/user.route";
import teamsRoutes from "./routes/team.route";
import marathonsRoutes from "./routes/marathon.route";
import challengesRoutes from "./routes/challenge.route";
import submissionsRoutes from "./routes/submission.route";
import leaderboardsRoutes from "./routes/leaderboard..route";
import errorHandler from "./utils/errorHandler";
import "./cronJobs/deleteOld";

config();

connextion_db();

const app = express();

// CORS Configuration
app.use(cors({
  origin: true, // أو (origin: '*') لو بدون credentials
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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