import { Router } from "express";
import * as authController from "../controllers/auth.controller"
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { PRODUCTION } from "../utils/constant";

const router = Router();


router.post("/register", expressAsyncHandler(authController.register));

router.post("/verificationCode", expressAsyncHandler(authController.vrificationCode));

router.post("/login", expressAsyncHandler(authController.login));

router.post("/logout", expressAsyncHandler(authController.logout));


router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.NODE_ENV === PRODUCTION ? process.env.CLIENT_ORIGIN : process.env.CLIENT_LOCAL,
  }),
  (req: any, res) => {

    const { token } = req.user;
    res.redirect(`${process.env.CLIENT_ORIGIN}/google/callback?token=${token}`);
  }
);

export default router;