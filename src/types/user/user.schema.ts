import { z } from "zod";
import { Gender } from "./user.enum";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  password: z.string().min(8)
})

export const vrificationCodeSchema = z.object({
  verificationCode: z.string(),
  email: z.string().email(),
})

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type vrificationCodeInput = z.infer<typeof vrificationCodeSchema>;