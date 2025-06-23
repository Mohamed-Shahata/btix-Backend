import { Router } from "express";
import * as authController from "../controllers/auth.controller"
import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { PRODUCTION } from "../utils/constant";
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
// process.env.NODE_ENV === PRODUCTION ? process.env.CLIENT_ORIGIN : process.env.CLIENT_LOCAL
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: "https://btix-frontend.vercel.app/login",
  }),
  (req: any, res) => {

    const { token, isNewUser } = req.user;

    if (isNewUser) {
      res.redirect(`https://btix-frontend.vercel.app/updatePassword?token=${token}`);
    } else {
      res.redirect(`https://btix-frontend.vercel.app/google/callback?token=${token}`);
    }


  }
);

export default router;