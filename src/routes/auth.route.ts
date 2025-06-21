import { Router } from "express";
import * as authController from "../controllers/auth.controller"
import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post("/register", expressAsyncHandler(authController.register));

router.post("/verificationCode", expressAsyncHandler(authController.vrificationCode));

router.post("/login", expressAsyncHandler(authController.login));

router.post("/logout", expressAsyncHandler(authController.logout));


export default router;