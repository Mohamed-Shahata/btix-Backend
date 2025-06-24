import { Request, Response } from "express";
import { Status } from "../utils/statusCode";
import Team from "../models/team.model";


export const getLeaderboard = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;

  const totalTeams = await Team.countDocuments();
  const teams = await Team.find()
    .sort({ totalPoints: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalTeams / limit);

  res.status(Status.OK).json({
    success: true,
    currentPage: page,
    totalPages,
    totalTeams,
    results: teams.length,
    teams
  });
}