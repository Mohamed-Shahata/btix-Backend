import { Request, Response } from "express";
import { Status } from "../utils/statusCode";
import { getUserServices } from "../services/user.services";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import User from "../models/user.model";
import { updateUserSchema } from "../types/user/user.schema";


export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select("email username roleInTeam teamId role gender bio address job githubAccount").populate({
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
    user
  })
}

export const updateUser = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  const result = updateUserSchema.safeParse(req.body);

  if (!result.success)
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors);

  const { username, address, bio, gender, githubAccount, job } = result.data;

  user.username = username || user.username;
  user.address = address || user.address;
  user.bio = bio || user.bio;
  user.gender = gender || user.gender;
  user.githubAccount = githubAccount || user.githubAccount;
  user.job = job || user.job;

  user.save();

  res.status(Status.OK).json({
    success: true,
    message: "Updated successfully"
  });
}