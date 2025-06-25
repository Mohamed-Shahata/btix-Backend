import { Request, Response } from "express";
import { loginServices, registerServices } from "../services/auth.services";
import { ACCESS_TOKEN, PRODUCTION, USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import { Status } from "../utils/statusCode";
import { changePasswordSchema, loginSchema, registerSchema, forgotPasswordSchema, vrificationCodeSchema } from "../types/user/user.schema";
import { AppError } from "../utils/errorHandlerClass";
import User from "../models/user.model";
import { JWTType } from "../types/user/user.type";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sendMail } from "../utils/mailer";

export const register = async (req: Request, res: Response): Promise<void> => {

  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors)
  }
  const validationData = result.data;

  await registerServices(validationData);

  res.status(Status.OK).json({
    success: true,
    message: "Check your email"

  });
};

export const vrificationCode = async (req: Request, res: Response): Promise<void> => {

  const result = vrificationCodeSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors)
  }
  const { verificationCode, email } = result.data;

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);


  if (String(user.verificationCode) !== String(verificationCode))
    throw new AppError("Code is wrong, try again", Status.NOT_FOUND);


  user.verificationCode = null;
  user.isVerified = true;
  user.save();

  res.status(Status.CREATED).json({
    success: true,
    message: "User created success"

  });
};


export const login = async (req: Request, res: Response): Promise<void> => {

  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors)
  }
  const validationData = result.data;


  const { user, accessToken } = await loginServices(validationData);

  res.cookie(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
  })

  user.password = "";

  res.status(Status.OK).json({
    success: true,
    message: "logged successfully",
    user,
    accessToken
  });
};


export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie(ACCESS_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === PRODUCTION,
    sameSite: "none"
  });

  res.status(Status.OK).json({
    success: true,
    message: "logout successfully"
  });

};


export const challengePassword = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  const result = changePasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors)
  }
  const { password } = result.data;


  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt)

  user.password = hashPassword;
  await user.save();

  res.status(Status.OK).json({
    success: true,
    message: "change password success"
  });

}





export const forgotPassword = async (req: Request, res: Response) => {

  const result = forgotPasswordSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors)
  }
  const { email } = result.data;

  const user = await User.findOne({ email });
  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  user.resetPasswordToken = randomBytes(32).toString("hex");
  await user.save();

  const Link = `${process.env.CLIENT_ORIGIN}/ResetPassword/${user._id}/${user.resetPasswordToken}`;

  sendMail({ to: user.email, subject: "Reset Password", template: "forgot-password.ejs", data: { username: user.username, Link } })

  res.status(Status.OK).json({
    success: true,
    message: "Password reset link sent to your email, please check your inbox"
  })
};


export const resetPassword = async (req: Request, res: Response) => {

  const { userId, token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ _id: userId, resetPasswordToken: token });

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  if (!token)
    throw new AppError("Token expire", Status.NOT_FOUND);


  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);


  user.password = hashPassword;
  user.resetPasswordToken = null;
  await user.save();

  res.status(Status.OK).json({
    success: true,
    message: "change passsword successfully"
  })
}