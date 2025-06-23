import { Router } from "express";
import * as authController from "../controllers/auth.controller"
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { auth } from "../middlewares/auth.middleware";

const router = Router();


router.post("/register", expressAsyncHandler(authController.register));

router.post("/verificationCode", expressAsyncHandler(authController.vrificationCode));

router.post("/login", expressAsyncHandler(authController.login));

router.post("/logout", expressAsyncHandler(authController.logout));

router.post("/changePassword", auth, expressAsyncHandler(authController.challengePassword));


router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_ORIGIN}/login`,
  }),
  (req: any, res) => {

    const { token, isNewUser } = req.user;

    console.log(isNewUser)
    if (isNewUser) {
      return res.redirect(`${process.env.CLIENT_ORIGIN}/updatePassword?token=${token}`);
    }

    res.redirect(`${process.env.CLIENT_ORIGIN}/google/callback?token=${token}`);
  }
);


router.post("/forgot-password", expressAsyncHandler(authController.forgotPassword));

router.post("/reset-password/:userId/:token", expressAsyncHandler(authController.resetPassword));


export default router;