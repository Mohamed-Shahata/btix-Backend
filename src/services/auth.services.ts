import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { JWTType } from "../types/user/user.type";
import { AppError } from "../utils/errorHandlerClass";
import { LoginInput, RegisterInput, registerSchema } from "../types/user/user.schema";
import { sendMail } from "../utils/mailer";

/**
 * 
 * @param body 
 * @returns 
 */
export const registerServices = async (body: RegisterInput) => {

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(body.password, salt)

  const code = Math.floor(100000 + Math.random() * 900000);

  const user = await User.create({ ...body, password: hashPassword, verificationCode: code });

  sendMail({ to: user.email, subject: "welcom", template: "sendVerificationCode.ejs", data: { code } })

}

/**
 * 
 * @param body 
 * @returns 
 */
export const loginServices = async (body: LoginInput) => {

  const user = await User.findOne({ email: body.email }).select("email username roleInTeam teamId role gender password").populate({
    path: "teamId",
    select: "marathonId"
  })
  if (!user) throw new AppError("Email or password is wrnog", 400)

  const isMatch = await bcrypt.compare(body.password, user.password!);
  if (!isMatch) throw new AppError("Email or password is wrnog", 400)

  if (user.isVerified === false)
    throw new AppError("Account is not verified", 400)

  const accessToken = genrateToken({ id: user._id, role: user.role })

  return { user, accessToken }
}


/**
 * 
 * @param payload 
 * @returns 
 */
const genrateToken = (payload: JWTType): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" })
}