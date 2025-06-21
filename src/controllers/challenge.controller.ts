import { Request, Response } from "express";
import { Status } from "../utils/statusCode";
import { getUserServices } from "../services/user.services";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import { createChallengeSchema } from "../types/challenge/challenge.schema";
import Challenge from "../models/challenges.model";
import Marathon from "../models/marathon.model";

//
export const createChallenge = async (req: Request, res: Response) => {

  const marathon = await Marathon.findById(req.body.marathonId);

  if (!marathon)
    throw new AppError("Marathon Not Found", Status.NOT_FOUND);



  const result = createChallengeSchema.safeParse(req.body);

  if (!result.success)
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors);

  const { title, description, point, marathonId, deadline } = result.data;

  // const deadlineDate = new Date(deadline);

  // if (deadline < marathon.startDate || deadline > marathon.endDate)
  //   throw new AppError("Deadline must be within marathon period", Status.BAD_REQUEST);

  const newChallenge = await Challenge.create({
    title, description, point, marathonId, deadline
  })

  res.status(Status.OK).json({
    success: true,
    message: "Created challenge successfully",
    newChallenge
  })
}

export const getChallengesForMarathon = async (req: Request, res: Response) => {

  const marathon = await Marathon.findById(req.params.marathonId);

  if (!marathon)
    throw new AppError("Marathon Not Found", Status.NOT_FOUND);

  const challenges = await Challenge.find({ marathonId: marathon._id });

  res.status(Status.OK).json({
    success: true,
    challenges
  })
}

export const getChallengeById = async (req: Request, res: Response) => {

  const challenge = await Challenge.findById(req.params.id);

  if (!challenge)
    throw new AppError("Challenge Not Found", Status.NOT_FOUND);


  res.status(Status.OK).json({
    success: true,
    challenge
  })
}

