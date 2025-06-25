"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth.controller"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const constant_1 = require("../utils/constant");
const rateLimiters_1 = require("../middlewares/rateLimiters");
const router = (0, express_1.Router)();
router.post("/register", rateLimiters_1.registerLimiter, (0, express_async_handler_1.default)(authController.register));
router.post("/verificationCode", rateLimiters_1.registerLimiter, (0, express_async_handler_1.default)(authController.vrificationCode));
router.post("/login", rateLimiters_1.loginLimiter, (0, express_async_handler_1.default)(authController.login));
router.post("/logout", (0, express_async_handler_1.default)(authController.logout));
router.post("/changePassword", auth_middleware_1.auth, (0, express_async_handler_1.default)(authController.challengePassword));
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_ORIGIN}/login`,
}), (req, res) => {
    const { token, isNewUser } = req.user;
    console.log(isNewUser);
    res.cookie(constant_1.ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    if (isNewUser) {
        return res.redirect(`${process.env.CLIENT_ORIGIN}/updatePassword`);
    }
    res.redirect(`${process.env.CLIENT_ORIGIN}/google/callback`);
});
router.post("/forgot-password", rateLimiters_1.forgotPasswordLimiter, (0, express_async_handler_1.default)(authController.forgotPassword));
router.post("/reset-password/:userId/:token", (0, express_async_handler_1.default)(authController.resetPassword));
exports.default = router;
