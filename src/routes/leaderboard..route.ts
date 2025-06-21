import { Router } from "express";
import * as leaderboardController from "../controllers/leaderboard.controller"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../middlewares/auth.middleware";

const router = Router();


router.get("/", auth, expressAsyncHandler(leaderboardController.getLeaderboard));


export default router;