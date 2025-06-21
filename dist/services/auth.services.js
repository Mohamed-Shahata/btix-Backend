"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginServices = exports.registerServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const mailer_1 = require("../utils/mailer");
/**
 *
 * @param body
 * @returns
 */
const registerServices = async (body) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashPassword = await bcryptjs_1.default.hash(body.password, salt);
    const code = Math.floor(100000 + Math.random() * 900000);
    const user = await user_model_1.default.create({ ...body, password: hashPassword, vrificationCode: code });
    (0, mailer_1.sendMail)({ to: user.email, subject: "welcom", template: "sendVerificationCode.ejs", data: { code } });
};
exports.registerServices = registerServices;
/**
 *
 * @param body
 * @returns
 */
const loginServices = async (body) => {
    const user = await user_model_1.default.findOne({ email: body.email }).select("email username roleInTeam teamId role gender password").populate({
        path: "teamId",
        select: "marathonId"
    });
    if (!user)
        throw new errorHandlerClass_1.AppError("Email or password is wrnog", 400);
    const isMatch = await bcryptjs_1.default.compare(body.password, user.password);
    if (!isMatch)
        throw new errorHandlerClass_1.AppError("Email or password is wrnog", 400);
    if (user.isVerified === false)
        throw new errorHandlerClass_1.AppError("Account is not verified", 400);
    const accessToken = genrateToken({ id: user._id, role: user.role });
    return { user, accessToken };
};
exports.loginServices = loginServices;
/**
 *
 * @param payload
 * @returns
 */
const genrateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};
