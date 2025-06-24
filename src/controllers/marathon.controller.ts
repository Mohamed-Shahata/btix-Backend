import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import { Status } from "../utils/statusCode";
import { createMarathonSchema } from "../types/marathon/marathon.schema";
import Marathon from "../models/marathon.model";
import User from "../models/user.model";
import Team from "../models/team.model";


export const createMarathon = async (req: Request, res: Response, next: NextFunction) => {

  const result = createMarathonSchema.safeParse(req.body);

  if (!result.success)
    throw next(new AppError(VALIDATION_ERROR, Status.NOT_FOUND, result.error.flatten().fieldErrors))

  const { title, description, startDate, endDate, isActive } = result.data;


  if (new Date(startDate).getTime() < Date.now()) {
    throw new AppError("Start date must not be in the past", Status.BAD_REQUEST);
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError("End date must be after start date.", Status.BAD_REQUEST);
  }

  const marathon = await Marathon.create({
    title, description, startDate, endDate, isActive
  });

  res.status(Status.OK).json({
    success: true,
    message: "Created Marathon successfully",
    marathon
  });
}

export const leaveMarathon = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  await Team.findByIdAndUpdate(user.teamId, { $set: { marathonId: null } });

  res.status(Status.OK).json({
    success: true,
    message: "Leave marathon success"
  });
}

export const joinMarathon = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  const marathon = await Marathon.findById(req.params.marathonId)

  if (!marathon)
    throw new AppError("Marathon Not Found", Status.NOT_FOUND);

  if (!user)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND);

  await Team.findByIdAndUpdate(user.teamId, { $set: { marathonId: marathon._id } });

  res.status(Status.OK).json({
    success: true,
    message: "Leave marathon success"
  });
}

export const getAllMarathon = async (req: Request, res: Response) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const totalMarathons = await Marathon.countDocuments();
  const marathons = await Marathon.find()
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalMarathons / limit);

  res.status(Status.OK).json({
    success: true,
    currentPage: page,
    totalPages,
    totalMarathons,
    results: marathons.length,
    marathons
  });
}

export const getSingleMarathon = async (req: Request, res: Response) => {

  const marathon = await Marathon.findById(req.params.id);

  if (!marathon)
    throw new AppError("Marathon Not Found", Status.NOT_FOUND);

  res.status(Status.OK).json({
    success: true,
    marathon
  });
}