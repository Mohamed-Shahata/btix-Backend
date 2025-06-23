import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model';
import { RolesType } from '../types/user/user.enum';
import { AppError } from '../utils/errorHandlerClass';
import { Status } from '../utils/statusCode';


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0]?.value) {
          return done(new AppError('No email found in Google profile', Status.BAD_REQUEST), false);
        }
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            email: profile.emails?.[0].value,
            username: profile.displayName,
            role: RolesType.MEMBER,
            verificationCode: null,
            isVerified: true,
            password: null
          });
        }

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        );

        return done(null, { id: String(user._id), role: user.role, token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// إعداد serialize/deserialize (اختياري لو مش مستخدم sessions)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;