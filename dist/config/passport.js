"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const user_enum_1 = require("../types/user/user.enum");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const statusCode_1 = require("../utils/statusCode");
const genrateTokens_1 = require("../utils/genrateTokens");
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        if (!profile.emails || !profile.emails[0]?.value) {
            return done(new errorHandlerClass_1.AppError('No email found in Google profile', statusCode_1.Status.BAD_REQUEST), false);
        }
        let user = await user_model_1.default.findOne({ email: profile.emails[0].value });
        let isNewUser = false;
        if (!user) {
            user = await user_model_1.default.create({
                email: profile.emails?.[0].value,
                username: profile.displayName,
                role: user_enum_1.RolesType.MEMBER,
                verificationCode: null,
                isVerified: true,
                password: null
            });
            isNewUser = true;
        }
        const token = (0, genrateTokens_1.genrateToken)({ id: user._id, role: user.role });
        return done(null, { id: String(user._id), role: user.role, token, isNewUser });
    }
    catch (err) {
        return done(err, false);
    }
}));
// إعداد serialize/deserialize (اختياري لو مش مستخدم sessions)
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
