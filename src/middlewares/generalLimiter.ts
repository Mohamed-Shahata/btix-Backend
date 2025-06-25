
import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true, // بيستخدم الـ headers الحديثة (مثل X-Forwarded-For)
  legacyHeaders: false,  // يمنع headers القديمة
  message: 'Too many requests, please try again later.',
});
