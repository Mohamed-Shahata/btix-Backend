import express, { NextFunction, Request, Response } from "express";
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
// Custom CORS middleware to set additional headers
const customCors = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Credentials', 1);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Use specific origin in production
  // Another common pattern: Allow dynamic origin
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Proceed to next middleware or route
  next();
};

// Apply built-in CORS middleware (allowing all origins in this case)
app.use(cors());

// Apply custom CORS middleware for additional headers
app.use(customCors);

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