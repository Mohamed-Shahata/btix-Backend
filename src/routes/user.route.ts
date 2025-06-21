import { Router } from "express";
import * as userController from "../controllers/user.controller"
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRoles } from "../middlewares/auth.middleware";
import { RolesType } from "../types/user/user.enum";

const router = Router();


router.get("/me", auth, expressAsyncHandler(userController.getMe));

router.get("/", auth, authorizedRoles(RolesType.ADMIN), expressAsyncHandler(userController.getAllUsers));

router.get("/:id", auth, expressAsyncHandler(userController.getUser));


export default router;