"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.vrificationCode = exports.register = void 0;
const auth_services_1 = require("../services/auth.services");
const constant_1 = require("../utils/constant");
const statusCode_1 = require("../utils/statusCode");
const user_schema_1 = require("../types/user/user.schema");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const result = user_schema_1.registerSchema.safeParse(req.body);
    if (!result.success) {
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    }
    const validationData = result.data;
    await (0, auth_services_1.registerServices)(validationData);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Check your email"
    });
};
exports.register = register;
const vrificationCode = async (req, res) => {
    const result = user_schema_1.vrificationCodeSchema.safeParse(req.body);
    if (!result.success) {
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    }
    const { verificationCode, email } = result.data;
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    console.log(typeof (verificationCode), verificationCode);
    console.log(user);
    console.log(typeof (user.verificationCode), user.verificationCode);
    // console.log(String(user.verificationCode) !== String(verificationCode))
    if (String(user.verificationCode) !== String(verificationCode))
        throw new errorHandlerClass_1.AppError("Code is wrong, try again", statusCode_1.Status.NOT_FOUND);
    user.verificationCode = null;
    user.isVerified = true;
    user.save();
    res.status(statusCode_1.Status.CREATED).json({
        success: true,
        message: "User created success"
    });
};
exports.vrificationCode = vrificationCode;
const login = async (req, res) => {
    const result = user_schema_1.loginSchema.safeParse(req.body);
    if (!result.success) {
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    }
    const validationData = result.data;
    const { user, accessToken } = await (0, auth_services_1.loginServices)(validationData);
    // res.cookie(ACCESS_TOKEN, accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    // })
    user.password = "";
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "logged successfully",
        user,
        accessToken
    });
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie(constant_1.ACCESS_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === constant_1.PRODUCTION,
        sameSite: "strict"
    });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "logout successfully"
    });
};
exports.logout = logout;
const genrateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};
