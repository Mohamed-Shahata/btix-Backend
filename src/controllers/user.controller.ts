import { Request, Response } from "express";
import { Status } from "../utils/statusCode";
import { getUserServices } from "../services/user.services";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND } from "../utils/constant";
import User from "../models/user.model";


export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select("email username roleInTeam teamId role gender").populate({
    path: "teamId",
    select: "marathonId"
  })

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  res.status(Status.OK).json({
    success: true,
    user
  })
}

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("username email role createdAt roleInTeam gender");

  res.status(Status.OK).json({
    success: true,
    users
  })
}

export const getUser = async (req: Request, res: Response) => {

  const user = await getUserServices(req.params.id);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  res.status(Status.OK).json({
    success: true,
    user: {
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      role: user?.role
    }
  })
}