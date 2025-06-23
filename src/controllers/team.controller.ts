import { Request, Response } from "express";
import { createTeamSchema } from "../types/team/team.schema";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import { Status } from "../utils/statusCode";
import Team from "../models/team.model";
import User from "../models/user.model";
import { IUserDocument } from "../types/user/user.interface";
import JoinRequest from "../models/joinRequest.model";
import { JoinStatus, RolesTeam } from "../types/user/user.enum";
import { Schema } from "mongoose";


export const createTeam = async (req: Request, res: Response) => {

  const result = createTeamSchema.safeParse(req.body);

  if (!result.success)
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors);

  const { name, marathonId, maxMembers } = result.data;
  const user = await User.findById(req.user?.id);
  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  const team = await Team.create({
    name, marathonId, leader: user._id, maxMembers, members: [user._id]
  });


  const updateUser = await User.findByIdAndUpdate(user._id, {
    teamId: team._id, roleInTeam: RolesTeam.LEADER
  });
  updateUser?.save();

  res.status(Status.OK).json({
    success: true,
    message: "Created team successfully",
    team
  });
}

export const joinTeam = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id) as IUserDocument;
  const team = await Team.findById(req.params.teamId);
  const exsitsJoinTeam = await JoinRequest.findOne({ status: JoinStatus.PENDING, userId: user._id });

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);

  if (exsitsJoinTeam)
    throw new AppError("You already sent request join in team", Status.BAD_REQUEST);

  if (team.members.includes(user?._id as Schema.Types.ObjectId))
    throw new AppError("You already exsits team", Status.BAD_REQUEST);


  if (user.teamId !== null)
    throw new AppError("You in team", Status.BAD_REQUEST);

  if (team.members.length >= team.maxMembers)
    throw new AppError("Team is full", Status.BAD_REQUEST);


  const newJoinRequest = await JoinRequest.create({
    teamId: team._id, userId: user._id, status: JoinStatus.PENDING
  })

  res.status(Status.OK).json({
    success: true,
    message: "You have sent your application correctly",
    newJoinRequest
  });
}

export const leaveTeam = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id) as IUserDocument;
  const team = await Team.findById(req.params.teamId);


  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);


  if (user.teamId === null)
    throw new AppError("You not in team", Status.BAD_REQUEST);

  const request = await JoinRequest.findOne({
    userId: user._id,
    teamId: team._id
  })

  if (!request)
    throw new AppError("You not in team", Status.BAD_REQUEST);

  await request.deleteOne();

  team.members = team.members.filter((memId) => String(memId) !== String(user._id));
  await team.save();

  user.teamId = null;
  user.roleInTeam = null;
  await user.save();



  res.status(Status.OK).json({
    success: true,
    message: "Leave team successfully"
  });
}

export const getTeam = async (req: Request, res: Response) => {

  const team = await Team.findById(req.params.id).select("totalPoints name")
    .populate([{
      path: "leader",
      select: "username"
    }, {
      path: "marathonId",
      select: "-_id title startDate endDate isActive"
    }, {
      path: "members",
      select: "username roleInTeam"
    }])

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);


  res.status(Status.OK).json({
    success: true,
    team
  });
}

export const getMyTeam = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id);

  const team = await Team.findOne({ leader: user?._id });

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);

  res.status(Status.OK).json({
    success: true,
    team
  });
}

export const getAllTeam = async (req: Request, res: Response) => {

  const teams = await Team.find();

  res.status(Status.OK).json({
    success: true,
    teams
  });
}

export const deleteTeam = async (req: Request, res: Response) => {

  const team = await Team.findByIdAndDelete(req.params.id);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);

  await User.updateMany(
    { teamId: team._id },
    { $set: { teamId: null, roleInTeam: null } }
  );

  await JoinRequest.deleteMany({ teamId: team._id })

  res.status(Status.OK).json({
    success: true,
    message: "Delete team successfully"
  });
}


export const getRequestJoinTeam = async (req: Request, res: Response) => {

  const team = await Team.findById(req.params.teamId);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);

  const AllJoinRequest = await JoinRequest.find({ teamId: team._id }).populate("userId")

  const requests = AllJoinRequest.filter((request) => request.status === JoinStatus.PENDING);
  res.status(Status.OK).json({
    success: true,
    requests
  })
}

export const acceptJoinTeam = async (req: Request, res: Response) => {

  const team = await Team.findById(req.params.teamId);
  const request = await JoinRequest.findById(req.params.requestId);
  const user = await User.findById(request?.userId);

  if (!user)
    throw new AppError("User Not Found", Status.NOT_FOUND);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);

  if (!request)
    throw new AppError("Request Not Found", Status.NOT_FOUND);

  team.members.push(user?._id as Schema.Types.ObjectId);
  team.save();

  user.teamId = team._id as Schema.Types.ObjectId;
  user.roleInTeam = RolesTeam.MEMBER;
  user.save();

  request.status = JoinStatus.ACCEPTED;
  request.save();

  res.status(Status.OK).json({
    success: true,
    message: "Accepted successfuly"
  })
}

export const rejectJoinTeam = async (req: Request, res: Response) => {

  const team = await Team.findById(req.params.teamId);
  const request = await JoinRequest.findById(req.params.requestId);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND);

  if (!request)
    throw new AppError("Request Not Found", Status.NOT_FOUND);

  request.status = JoinStatus.REJECTED;
  request.save();

  res.status(Status.OK).json({
    success: true,
    message: "Rejected successfuly"
  })
}

export const getAllJoinRequestWithMe = async (req: Request, res: Response) => {

  const user = await User.findById(req.user?.id);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  const requests = await JoinRequest.find({ userId: user._id });

  res.status(Status.OK).json({
    success: true,
    requests
  })
}