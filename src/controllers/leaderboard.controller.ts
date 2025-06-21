import { Request, Response } from "express";
import Marathon from "../models/marathon.model";
import { AppError } from "../utils/errorHandlerClass";
import { Status } from "../utils/statusCode";
import Team from "../models/team.model";


export const getLeaderboard = async (req: Request, res: Response) => {

  const teams = await Team.find().sort({ totalPoints: -1 });



  res.status(Status.OK).json({
    success: true,
    teams
  })
}