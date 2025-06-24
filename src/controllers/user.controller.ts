import { Request, Response } from "express";
import { Status } from "../utils/statusCode";
import { getUserServices } from "../services/user.services";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import User from "../models/user.model";
import { updateUserSchema } from "../types/user/user.schema";
import Team from "../models/team.model";
import JoinRequest from "../models/joinRequest.model";


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
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;

  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find()
      .select("username email role createdAt roleInTeam gender")
      .skip(skip)
      .limit(limit),
    User.countDocuments()
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  res.status(Status.OK).json({
    success: true,
    users,
    totalPages,
    currentPage: page,
  });
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

export const deleteUser = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  if (user.teamId) {
    const team = await Team.findById(user.teamId);
    if (team) {
      team.members = team.members.filter((memberId) => String(memberId) !== String(user._id));
      await team.save();
    }

    await JoinRequest.deleteMany({ userId: user._id })
  }

  await User.findByIdAndDelete(user._id);

  res.status(Status.OK).json({
    success: true,
    message: "User deleted successfully",
  });
}