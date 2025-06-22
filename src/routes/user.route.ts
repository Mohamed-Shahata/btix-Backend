import { Router } from "express";
import * as userController from "../controllers/user.controller"
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRoles, CheckAccountOwner } from "../middlewares/auth.middleware";
import { RolesType } from "../types/user/user.enum";

const router = Router();


router.get("/me", auth, expressAsyncHandler(userController.getMe));

router.get("/", auth, authorizedRoles(RolesType.ADMIN), expressAsyncHandler(userController.getAllUsers));

router.get("/:id", auth, expressAsyncHandler(userController.getUser));

router.put("/:id", auth, CheckAccountOwner, expressAsyncHandler(userController.updateUser));


export default router;