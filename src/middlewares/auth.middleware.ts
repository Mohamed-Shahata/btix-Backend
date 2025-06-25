import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorHandlerClass";
import { Status } from "../utils/statusCode";
import { JwtPayloadDecoded } from "../types/user/user.interface";
import { RolesType } from "../types/user/user.enum";
import User from "../models/user.model";
import { USER_NOT_FOUND } from "../utils/constant";


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    console.log(token)
    if (!token)
      return next(new AppError("Token format invalid", Status.UNAUTHORIZED))

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadDecoded;

    const user = await User.findById(decoded.id);
    if (!user)
      return next(new AppError(USER_NOT_FOUND, Status.NOT_FOUND))

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    return next(new AppError("Invalid or expired token", Status.UNAUTHORIZED));
  }
};

export const authorizedRoles = (...roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!roles.includes(user?.role!)) {
      throw new AppError("Access denied", Status.FORBIDDEN)
    }
    next();
  }
};

// notes (req.user?.id !== req.params.id && req.user?.role !== RolesType.ADMIN)
export const CheckAccountOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.id !== req.params.id && req.user?.role !== RolesType.ADMIN)
    throw new AppError("Access denied", Status.FORBIDDEN)

  next();
}

export const authorizedRolesTeam = (...roles: Array<string | null>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);
    }


    if (user.role === RolesType.ADMIN) {
      return next();
    }

    if (!roles.includes(user.roleInTeam)) {
      throw new AppError("Access denied", Status.FORBIDDEN);
    }

    next();
  };
};