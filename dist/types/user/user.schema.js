"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vrificationCodeSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const user_enum_1 = require("./user.enum");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    gender: zod_1.z.enum([user_enum_1.Gender.MALE, user_enum_1.Gender.FEMALE]),
    password: zod_1.z.string().min(8)
});
exports.vrificationCodeSchema = zod_1.z.object({
    verificationCode: zod_1.z.string(),
    email: zod_1.z.string().email(),
});
