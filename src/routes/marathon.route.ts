import { Router } from "express";
import * as marathonController from "../controllers/marathon.controller"
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRoles, authorizedRolesTeam } from "../middlewares/auth.middleware";
import { RolesTeam, RolesType } from "../types/user/user.enum";

const router = Router();


router.post("/", auth, authorizedRoles(RolesType.ADMIN, RolesType.MEMBER), expressAsyncHandler(marathonController.createMarathon));

router.post("/leave", auth, authorizedRolesTeam(RolesTeam.LEADER), expressAsyncHandler(marathonController.leaveMarathon));

router.post("/join/:marathonId", auth, authorizedRolesTeam(RolesTeam.LEADER), expressAsyncHandler(marathonController.joinMarathon));

router.get("/", expressAsyncHandler(marathonController.getAllMarathon));

router.get("/:id", expressAsyncHandler(marathonController.getSingleMarathon));


export default router;