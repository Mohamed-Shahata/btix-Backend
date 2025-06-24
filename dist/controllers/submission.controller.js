"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejecttSubmission = exports.acceptSubmission = exports.getAllSubmissions = exports.getTeamSubmissions = exports.submitSolution = void 0;
const submission_schema_1 = require("../types/submission/submission.schema");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const constant_1 = require("../utils/constant");
const statusCode_1 = require("../utils/statusCode");
const submission_model_1 = __importDefault(require("../models/submission.model"));
const challenges_model_1 = __importDefault(require("../models/challenges.model"));
const team_model_1 = __importDefault(require("../models/team.model"));
const user_enum_1 = require("../types/user/user.enum");
const marathon_model_1 = __importDefault(require("../models/marathon.model"));
const mailer_1 = require("../utils/mailer");
const user_model_1 = __importDefault(require("../models/user.model"));
const submitSolution = async (req, res) => {
    const challenge = await challenges_model_1.default.findById(req.params.challengeId);
    const team = await team_model_1.default.findById(req.body.teamId);
    if (!challenge)
        throw new errorHandlerClass_1.AppError("Challenge Not Found", statusCode_1.Status.NOT_FOUND);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    if (String(team.marathonId) !== String(challenge.marathonId))
        throw new errorHandlerClass_1.AppError("Cannot submission this marathon", statusCode_1.Status.BAD_REQUEST);
    const marathon = await marathon_model_1.default.findById(team.marathonId);
    if (!marathon)
        throw new errorHandlerClass_1.AppError("Cannot submission this marathon", statusCode_1.Status.BAD_REQUEST);
    if (!marathon.isActive) {
        throw new errorHandlerClass_1.AppError("Cannot submission because marathon is not active now", statusCode_1.Status.BAD_REQUEST);
    }
    const pendingSub = await submission_model_1.default.findOne({
        teamId: team._id, $or: [{ status: user_enum_1.JoinStatus.PENDING }, { status: user_enum_1.JoinStatus.ACCEPTED }],
        challengeId: challenge._id
    });
    if (team.maxMembers === 0)
        throw new errorHandlerClass_1.AppError("The team must have at least two members", statusCode_1.Status.BAD_REQUEST);
    if (pendingSub) {
        if (pendingSub.status === user_enum_1.JoinStatus.ACCEPTED) {
            throw new errorHandlerClass_1.AppError("You have already sent it before and got accepted", statusCode_1.Status.BAD_REQUEST);
        }
        else {
            throw new errorHandlerClass_1.AppError("You have already sent it, and yout request is still being processed", statusCode_1.Status.BAD_REQUEST);
        }
    }
    const result = submission_schema_1.submissionSolutionSchema.safeParse({
        submissionLink: req.body.submissionLink,
        teamId: team._id?.toString(),
        challengeId: challenge._id?.toString(),
        notes: req.body.notes
    });
    if (!result.success)
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    const { challengeId, submissionLink, teamId, notes } = result.data;
    const newSolution = await submission_model_1.default.create({
        challengeId, submissionLink, teamId, notes
    });
    res.status(statusCode_1.Status.CREATED).json({
        success: true,
        message: "Created solution successfully",
        newSolution
    });
};
exports.submitSolution = submitSolution;
const getTeamSubmissions = async (req, res) => {
    const team = await team_model_1.default.findById(req.params.teamId);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    const submissionsForTeam = await submission_model_1.default.find({ teamId: team._id });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        submissions: submissionsForTeam
    });
};
exports.getTeamSubmissions = getTeamSubmissions;
const getAllSubmissions = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const filter = { status: user_enum_1.JoinStatus.PENDING };
    const totalSubmissions = await submission_model_1.default.countDocuments(filter);
    const submissions = await submission_model_1.default.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
        path: "teamId",
        select: "name",
    });
    const totalPages = Math.ceil(totalSubmissions / limit);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        currentPage: page,
        totalPages,
        totalSubmissions,
        results: submissions.length,
        submissions,
    });
};
exports.getAllSubmissions = getAllSubmissions;
const acceptSubmission = async (req, res) => {
    const submission = await submission_model_1.default.findById(req.params.id);
    const result = submission_schema_1.submissionAceptOrRejectSchema.safeParse({ notesFromLeader: req.body.notesFromLeader });
    if (!result.success)
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    const { notesFromLeader } = result.data;
    if (!submission)
        throw new errorHandlerClass_1.AppError("Submission Not Found", statusCode_1.Status.NOT_FOUND);
    const team = await team_model_1.default.findById(submission.teamId);
    const challenge = await challenges_model_1.default.findById(submission.challengeId);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    if (!challenge)
        throw new errorHandlerClass_1.AppError("Challenge Not Found", statusCode_1.Status.NOT_FOUND);
    submission.status = user_enum_1.JoinStatus.ACCEPTED;
    submission.notesFromLeader = notesFromLeader;
    submission.save();
    team.totalPoints += challenge.point;
    await team.save();
    await Promise.all(team.members.map(async (membId) => {
        const user = await user_model_1.default.findById(membId).select("points");
        if (user && typeof user.points === "number") {
            user.points += Math.floor(challenge.point / team.members.length) || 0;
            await user.save();
        }
    }));
    const userTeamLeader = await user_model_1.default.findById(team.leader).select("email");
    if (!userTeamLeader)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    (0, mailer_1.sendMail)({
        to: userTeamLeader.email,
        subject: "Accepted challenge",
        template: "acceptedChallenge.ejs",
        data: {
            points: challenge.point,
            notes: notesFromLeader
        }
    });
    res.status(statusCode_1.Status.CREATED).json({
        success: true,
        message: "Accepted successfully"
    });
};
exports.acceptSubmission = acceptSubmission;
const rejecttSubmission = async (req, res) => {
    const submission = await submission_model_1.default.findById(req.params.id);
    const result = submission_schema_1.submissionAceptOrRejectSchema.safeParse({ notesFromLeader: req.body.notesFromLeader });
    if (!result.success)
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    const { notesFromLeader } = result.data;
    if (!submission)
        throw new errorHandlerClass_1.AppError("Submission Not Found", statusCode_1.Status.NOT_FOUND);
    const team = await team_model_1.default.findById(submission.teamId);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    submission.status = user_enum_1.JoinStatus.REJECTED;
    submission.notesFromLeader = notesFromLeader;
    submission.save();
    const userTeamLeader = await user_model_1.default.findById(team.leader).select("email");
    if (!userTeamLeader)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    (0, mailer_1.sendMail)({
        to: userTeamLeader.email,
        subject: "Rejected challenge",
        template: "rejectedChallenge.ejs",
        data: {
            notes: notesFromLeader
        }
    });
    res.status(statusCode_1.Status.CREATED).json({
        success: true,
        message: "Rejected successfully"
    });
};
exports.rejecttSubmission = rejecttSubmission;
