import jwt from "jsonwebtoken";
import { JWTType } from "../types/user/user.type";


export const genrateToken = (payload: JWTType): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" })
}