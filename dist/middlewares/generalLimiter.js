"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    // ✅ استخدم IP الحقيقي من X-Forwarded-For
    keyGenerator: (req) => {
        const xForwardedFor = req.headers['x-forwarded-for'];
        const ip = typeof xForwardedFor === 'string'
            ? xForwardedFor.split(',')[0].trim()
            : req.ip;
        return ip || 'unknown';
    }
});
