"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJoinRequestWithMe = exports.rejectJoinTeam = exports.acceptJoinTeam = exports.getRequestJoinTeam = exports.deleteTeam = exports.getAllTeam = exports.getMyTeam = exports.getTeam = exports.leaveTeam = exports.joinTeam = exports.createTeam = void 0;
const team_schema_1 = require("../types/team/team.schema");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const constant_1 = require("../utils/constant");
const statusCode_1 = require("../utils/statusCode");
const team_model_1 = __importDefault(require("../models/team.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const joinRequest_model_1 = __importDefault(require("../models/joinRequest.model"));
const user_enum_1 = require("../types/user/user.enum");
const createTeam = async (req, res) => {
    const result = team_schema_1.createTeamSchema.safeParse(req.body);
    if (!result.success)
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    const { name, marathonId, maxMembers } = result.data;
    const user = await user_model_1.default.findById(req.user?.id);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    const team = await team_model_1.default.create({
        name, marathonId, leader: user._id, maxMembers, members: [user._id]
    });
    const updateUser = await user_model_1.default.findByIdAndUpdate(user._id, {
        teamId: team._id, roleInTeam: user_enum_1.RolesTeam.LEADER
    });
    updateUser?.save();
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Created team successfully",
        team
    });
};
exports.createTeam = createTeam;
const joinTeam = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    const team = await team_model_1.default.findById(req.params.teamId);
    const exsitsJoinTeam = await joinRequest_model_1.default.findOne({ status: user_enum_1.JoinStatus.PENDING, userId: user._id });
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    if (exsitsJoinTeam)
        throw new errorHandlerClass_1.AppError("You already sent request join in team", statusCode_1.Status.BAD_REQUEST);
    if (team.members.includes(user?._id))
        throw new errorHandlerClass_1.AppError("You already exsits team", statusCode_1.Status.BAD_REQUEST);
    if (user.teamId !== null)
        throw new errorHandlerClass_1.AppError("You in team", statusCode_1.Status.BAD_REQUEST);
    if (team.members.length >= team.maxMembers)
        throw new errorHandlerClass_1.AppError("Team is full", statusCode_1.Status.BAD_REQUEST);
    const newJoinRequest = await joinRequest_model_1.default.create({
        teamId: team._id, userId: user._id, status: user_enum_1.JoinStatus.PENDING
    });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "You have sent your application correctly",
        newJoinRequest
    });
};
exports.joinTeam = joinTeam;
const leaveTeam = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    const team = await team_model_1.default.findById(req.params.teamId);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    if (user.teamId === null)
        throw new errorHandlerClass_1.AppError("You not in team", statusCode_1.Status.BAD_REQUEST);
    const request = await joinRequest_model_1.default.findOne({
        userId: user._id,
        teamId: team._id
    });
    if (!request)
        throw new errorHandlerClass_1.AppError("You not in team", statusCode_1.Status.BAD_REQUEST);
    await request.deleteOne();
    team.members = team.members.filter((memId) => String(memId) !== String(user._id));
    await team.save();
    user.teamId = null;
    user.roleInTeam = null;
    await user.save();
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Leave team successfully"
    });
};
exports.leaveTeam = leaveTeam;
const getTeam = async (req, res) => {
    const team = await team_model_1.default.findById(req.params.id).select("totalPoints name")
        .populate([{
            path: "leader",
            select: "username"
        }, {
            path: "marathonId",
            select: "-_id title startDate endDate isActive"
        }, {
            path: "members",
            select: "username roleInTeam"
        }]);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        team
    });
};
exports.getTeam = getTeam;
const getMyTeam = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    const team = await team_model_1.default.findOne({ leader: user?._id });
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        team
    });
};
exports.getMyTeam = getMyTeam;
const getAllTeam = async (req, res) => {
    const teams = await team_model_1.default.find();
    res.status(statusCode_1.Status.OK).json({
        success: true,
        teams
    });
};
exports.getAllTeam = getAllTeam;
const deleteTeam = async (req, res) => {
    const team = await team_model_1.default.findByIdAndDelete(req.params.id);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    await user_model_1.default.updateMany({ teamId: team._id }, { $set: { teamId: null, roleInTeam: null } });
    await joinRequest_model_1.default.deleteMany({ teamId: team._id });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Delete team successfully"
    });
};
exports.deleteTeam = deleteTeam;
const getRequestJoinTeam = async (req, res) => {
    const team = await team_model_1.default.findById(req.params.teamId);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    const AllJoinRequest = await joinRequest_model_1.default.find({ teamId: team._id }).populate("userId");
    const requests = AllJoinRequest.filter((request) => request.status === user_enum_1.JoinStatus.PENDING);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        requests
    });
};
exports.getRequestJoinTeam = getRequestJoinTeam;
const acceptJoinTeam = async (req, res) => {
    const team = await team_model_1.default.findById(req.params.teamId);
    const request = await joinRequest_model_1.default.findById(req.params.requestId);
    const user = await user_model_1.default.findById(request?.userId);
    if (!user)
        throw new errorHandlerClass_1.AppError("User Not Found", statusCode_1.Status.NOT_FOUND);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    if (!request)
        throw new errorHandlerClass_1.AppError("Request Not Found", statusCode_1.Status.NOT_FOUND);
    team.members.push(user?._id);
    team.save();
    user.teamId = team._id;
    user.roleInTeam = user_enum_1.RolesTeam.MEMBER;
    user.save();
    request.status = user_enum_1.JoinStatus.ACCEPTED;
    request.save();
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Accepted successfuly"
    });
};
exports.acceptJoinTeam = acceptJoinTeam;
const rejectJoinTeam = async (req, res) => {
    const team = await team_model_1.default.findById(req.params.teamId);
    const request = await joinRequest_model_1.default.findById(req.params.requestId);
    if (!team)
        throw new errorHandlerClass_1.AppError("Team Not Found", statusCode_1.Status.NOT_FOUND);
    if (!request)
        throw new errorHandlerClass_1.AppError("Request Not Found", statusCode_1.Status.NOT_FOUND);
    request.status = user_enum_1.JoinStatus.REJECTED;
    request.save();
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Rejected successfuly"
    });
};
exports.rejectJoinTeam = rejectJoinTeam;
const getAllJoinRequestWithMe = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    const requests = await joinRequest_model_1.default.find({ userId: user._id });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        requests
    });
};
exports.getAllJoinRequestWithMe = getAllJoinRequestWithMe;
