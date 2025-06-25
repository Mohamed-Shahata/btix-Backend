// src/middlewares/rateLimiters.ts

import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
  legacyHeaders: false,  // يمنع headers القديمة
  message: 'Too many requests, please try again later.',
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
  legacyHeaders: false,  // يمنع headers القديمة
  message: 'Too many requests, please try again later.',
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
  legacyHeaders: false,  // يمنع headers القديمة
  message: 'Too many requests, please try again later.',
});
