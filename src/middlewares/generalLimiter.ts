import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
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
