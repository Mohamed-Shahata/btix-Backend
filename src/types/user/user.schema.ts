import { z } from "zod";
import { Gender } from "./user.enum";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const registerSchema = z.object({
  username: z.string().min(2).max(20),
  email: z.string().email(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  password: z.string().min(8)
})

export const vrificationCodeSchema = z.object({
  verificationCode: z.string(),
  email: z.string().email(),
})

export const updateUserSchema = z.object({
  username: z.string().min(2).max(20).optional(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
  bio: z.string().min(2).max(200).optional(),
  job: z.string().min(2).max(100).optional(),
  address: z.string().min(2).max(100).optional(),
  githubAccount: z.string().startsWith("https://github.com/").optional(),
});


export const changePasswordSchema = z.object({
  password: z.string().min(8)
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})


export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type vrificationCodeInput = z.infer<typeof vrificationCodeSchema>;
export type updateUserSchemaInput = z.infer<typeof updateUserSchema>;
export type changePasswordSchemaInput = z.infer<typeof changePasswordSchema>;
export type forgotPasswordSchemaSchemaInput = z.infer<typeof forgotPasswordSchema>;