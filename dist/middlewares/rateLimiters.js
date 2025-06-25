"use strict";
// src/middlewares/rateLimiters.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordLimiter = exports.loginLimiter = exports.registerLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
    legacyHeaders: false, // يمنع headers القديمة
    message: 'Too many requests, please try again later.',
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
    legacyHeaders: false, // يمنع headers القديمة
    message: 'Too many requests, please try again later.',
});
exports.forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
    legacyHeaders: false, // يمنع headers القديمة
    message: 'Too many requests, please try again later.',
});
