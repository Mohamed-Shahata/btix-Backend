import { Request, Response } from "express";
import { submissionAceptOrRejectSchema, submissionSolutionSchema } from "../types/submission/submission.schema";
import { AppError } from "../utils/errorHandlerClass";
import { USER_NOT_FOUND, VALIDATION_ERROR } from "../utils/constant";
import { Status } from "../utils/statusCode";
import Submission from "../models/submission.model";
import Challenge from "../models/challenges.model";
import Team from "../models/team.model";
import { JoinStatus } from "../types/user/user.enum";
import Marathon from "../models/marathon.model";
import { sendMail } from "../utils/mailer";
import User from "../models/user.model";


export const submitSolution = async (req: Request, res: Response) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  const team = await Team.findById(req.body.teamId);


  if (!challenge)
    throw new AppError("Challenge Not Found", Status.NOT_FOUND)

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND)

  if (String(team.marathonId) !== String(challenge.marathonId))
    throw new AppError("Cannot submission this marathon", Status.BAD_REQUEST)

  const marathon = await Marathon.findById(team.marathonId);

  if (!marathon)
    throw new AppError("Cannot submission this marathon", Status.BAD_REQUEST)

  if (!marathon.isActive) {
    throw new AppError("Cannot submission because marathon is not active now", Status.BAD_REQUEST)
  }

  const pendingSub = await Submission.findOne({
    teamId: team._id, $or: [{ status: JoinStatus.PENDING }, { status: JoinStatus.ACCEPTED }],
    challengeId: challenge._id
  });

  if (team.maxMembers === 0)
    throw new AppError("The team must have at least two members", Status.BAD_REQUEST)

  if (pendingSub) {
    if (pendingSub.status === JoinStatus.ACCEPTED) {
      throw new AppError("You have already sent it before and got accepted", Status.BAD_REQUEST)
    } else {
      throw new AppError("You have already sent it, and yout request is still being processed", Status.BAD_REQUEST)
    }
  }

  const result = submissionSolutionSchema.safeParse({
    submissionLink: req.body.submissionLink,
    teamId: team._id?.toString(),
    challengeId: challenge._id?.toString(),
    notes: req.body.notes
  });

  if (!result.success)
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors);

  const { challengeId, submissionLink, teamId, notes } = result.data;

  const newSolution = await Submission.create({
    challengeId, submissionLink, teamId, notes
  });

  res.status(Status.CREATED).json({
    success: true,
    message: "Created solution successfully",
    newSolution
  })
}

export const getTeamSubmissions = async (req: Request, res: Response) => {

  const team = await Team.findById(req.params.teamId);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND)

  const submissionsForTeam = await Submission.find({ teamId: team._id });

  res.status(Status.OK).json({
    success: true,
    submissions: submissionsForTeam
  })
};

export const getAllSubmissions = async (req: Request, res: Response) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = { status: JoinStatus.PENDING };

  const totalSubmissions = await Submission.countDocuments(filter);

  const submissions = await Submission.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "teamId",
      select: "name",
    });

  const totalPages = Math.ceil(totalSubmissions / limit);

  res.status(Status.OK).json({
    success: true,
    currentPage: page,
    totalPages,
    totalSubmissions,
    results: submissions.length,
    submissions,
  });
};

export const acceptSubmission = async (req: Request, res: Response) => {

  const submission = await Submission.findById(req.params.id);

  const result = submissionAceptOrRejectSchema.safeParse({ notesFromLeader: req.body.notesFromLeader });

  if (!result.success)
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors);

  const { notesFromLeader } = result.data;

  if (!submission)
    throw new AppError("Submission Not Found", Status.NOT_FOUND)

  const team = await Team.findById(submission.teamId);

  const challenge = await Challenge.findById(submission.challengeId);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND)

  if (!challenge)
    throw new AppError("Challenge Not Found", Status.NOT_FOUND)

  submission.status = JoinStatus.ACCEPTED;
  submission.notesFromLeader = notesFromLeader;
  submission.save();

  team.totalPoints += challenge.point;
  await team.save();

  await Promise.all(team.members.map(async (membId) => {
    const user = await User.findById(membId).select("points");
    if (user && typeof user.points === "number") {
      user.points += Math.floor(team.totalPoints / team.maxMembers) || 0;
      await user.save();
    }
  }));


  const userTeamLeader = await User.findById(team.leader).select("email");

  if (!userTeamLeader)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND)

  sendMail({
    to: userTeamLeader.email,
    subject: "Accepted challenge",
    template: "acceptedChallenge.ejs",
    data: {
      points: challenge.point,
      notes: notesFromLeader
    }
  })

  res.status(Status.CREATED).json({
    success: true,
    message: "Accepted successfully"
  })
};

export const rejecttSubmission = async (req: Request, res: Response) => {

  const submission = await Submission.findById(req.params.id);

  const result = submissionAceptOrRejectSchema.safeParse({ notesFromLeader: req.body.notesFromLeader });

  if (!result.success)
    throw new AppError(VALIDATION_ERROR, Status.BAD_REQUEST, result.error.flatten().fieldErrors);

  const { notesFromLeader } = result.data;


  if (!submission)
    throw new AppError("Submission Not Found", Status.NOT_FOUND)

  const team = await Team.findById(submission.teamId);

  if (!team)
    throw new AppError("Team Not Found", Status.NOT_FOUND)


  submission.status = JoinStatus.REJECTED;
  submission.notesFromLeader = notesFromLeader;
  submission.save();

  const userTeamLeader = await User.findById(team.leader).select("email");

  if (!userTeamLeader)
    throw new AppError(USER_NOT_FOUND, Status.NOT_FOUND)

  sendMail({
    to: userTeamLeader.email,
    subject: "Rejected challenge",
    template: "rejectedChallenge.ejs",
    data: {
      notes: notesFromLeader
    }
  })

  res.status(Status.CREATED).json({
    success: true,
    message: "Rejected successfully"
  })
};