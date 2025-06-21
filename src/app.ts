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


config({ path: ".env.development" });

// Connection DB
connextion_db();

const app = express();

// Middelwares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://btix-frontend-git-main-mohameds-projects-f5551999.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
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