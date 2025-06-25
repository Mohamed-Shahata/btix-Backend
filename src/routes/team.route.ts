import { Router } from "express";
import * as teamController from "../controllers/team.controller"
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRoles, authorizedRolesTeam } from "../middlewares/auth.middleware";
import { RolesTeam, RolesType } from "../types/user/user.enum";

const router = Router();


router.post(
  "/",
  auth,
  authorizedRoles(RolesType.MEMBER, RolesType.ADMIN),
  expressAsyncHandler(teamController.createTeam)
);

router.get(
  "/myTeam",
  auth,
  expressAsyncHandler(teamController.getMyTeam)
);

router.put(
  "/join/:teamId",
  auth,
  authorizedRoles(RolesType.MEMBER),
  expressAsyncHandler(teamController.joinTeam)
);

router.put(
  "/leave/:teamId",
  auth,
  authorizedRoles(RolesType.MEMBER),
  expressAsyncHandler(teamController.leaveTeam)
);

router.get(
  "/:teamId/requests",
  auth,
  authorizedRolesTeam(RolesTeam.LEADER),
  expressAsyncHandler(teamController.getRequestJoinTeam)
);



router.get(
  "/requests/me",
  auth,
 expressAsyncHandler(teamController.getAllJoinRequestWithMe)
);

router.post(
  "/:teamId/requests/:requestId/accept",
  auth,
  authorizedRolesTeam(RolesTeam.LEADER),
  expressAsyncHandler(teamController.acceptJoinTeam)
);

router.post(
  "/:teamId/requests/:requestId/reject",
  auth,
  authorizedRolesTeam(RolesTeam.LEADER),
  expressAsyncHandler(teamController.rejectJoinTeam)
);

router.get(
  "/:id",
  auth,
  expressAsyncHandler(teamController.getTeam)
);

router.get(
  "/",
  expressAsyncHandler(teamController.getAllTeam)
);

router.delete(
  "/:id",
  auth,
  authorizedRolesTeam(RolesTeam.LEADER),
  expressAsyncHandler(teamController.deleteTeam)
);




export default router;