"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const db_connection_1 = __importDefault(require("./config/db-connection"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const team_route_1 = __importDefault(require("./routes/team.route"));
const marathon_route_1 = __importDefault(require("./routes/marathon.route"));
const challenge_route_1 = __importDefault(require("./routes/challenge.route"));
const submission_route_1 = __importDefault(require("./routes/submission.route"));
const leaderboard_route_1 = __importDefault(require("./routes/leaderboard.route"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
require("./cronJobs/deleteOld");
require("./config/passport");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
(0, db_connection_1.default)();
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// CORS Configuration
const allowedOrigins = [
    "https://btix-frontend.vercel.app",
    "http://localhost:3000"
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
// Middlewares
app.use(limiter);
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/auth", auth_route_1.default);
app.use("/users", user_route_1.default);
app.use("/teams", team_route_1.default);
app.use("/marathons", marathon_route_1.default);
app.use("/challenges", challenge_route_1.default);
app.use("/submissions", submission_route_1.default);
app.use("/leaderboards", leaderboard_route_1.default);
// Error Handler
app.use(errorHandler_1.default);
exports.default = app;
