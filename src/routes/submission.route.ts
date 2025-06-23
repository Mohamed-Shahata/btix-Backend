import { Router } from "express";
import * as submissionController from "../controllers/submission.controller"
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRoles, authorizedRolesTeam } from "../middlewares/auth.middleware";
import { RolesTeam, RolesType } from "../types/user/user.enum";

const router = Router();


router.post("/:challengeId", auth, authorizedRolesTeam(RolesTeam.LEADER), expressAsyncHandler(submissionController.submitSolution));

router.get("/requests", auth, authorizedRoles(RolesType.LEADER), expressAsyncHandler(submissionController.getAllSubmissions));
//notes
router.get("/:teamId", auth, authorizedRoles(RolesType.LEADER, RolesType.MEMBER), expressAsyncHandler(submissionController.getTeamSubmissions));

router.post("/:id/accept", auth, authorizedRoles(RolesType.LEADER), expressAsyncHandler(submissionController.acceptSubmission));

router.post("/:id/reject", auth, authorizedRoles(RolesType.LEADER), expressAsyncHandler(submissionController.rejecttSubmission));


export default router;