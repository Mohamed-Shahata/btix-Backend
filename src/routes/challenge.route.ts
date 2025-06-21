import { Router } from "express";
import * as challengeController from "../controllers/challenge.controller"
import expressAsyncHandler from "express-async-handler";
import { auth } from "../middlewares/auth.middleware";

const router = Router();


router.post("/", expressAsyncHandler(challengeController.createChallenge));

router.get("/marathon/:marathonId", expressAsyncHandler(challengeController.getChallengesForMarathon));

router.get("/:id", auth, expressAsyncHandler(challengeController.getChallengeById));



export default router;