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
import leaderboardsRoutes from "./routes/leaderboard.route";
import errorHandler from "./utils/errorHandler";
import "./cronJobs/deleteOld";
import './config/passport';
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { generalLimiter } from "./middlewares/generalLimiter";


connextion_db();
config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://btix-frontend.vercel.app"
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));


app.set('trust proxy', true);


// Middlewares
app.use(cookieParser());
app.use(compression())
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));


// Routes
app.use("/auth", authRoutes);
app.use("/users", generalLimiter, usersRoutes);
app.use("/teams", generalLimiter, teamsRoutes);
app.use("/marathons", generalLimiter, marathonsRoutes);
app.use("/challenges", generalLimiter, challengesRoutes);
app.use("/submissions", generalLimiter, submissionsRoutes);
app.use("/leaderboards", generalLimiter, leaderboardsRoutes);

// Error Handler
app.use(errorHandler);

export default app;