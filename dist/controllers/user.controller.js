"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.getMe = void 0;
const statusCode_1 = require("../utils/statusCode");
const user_services_1 = require("../services/user.services");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const constant_1 = require("../utils/constant");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_schema_1 = require("../types/user/user.schema");
const team_model_1 = __importDefault(require("../models/team.model"));
const joinRequest_model_1 = __importDefault(require("../models/joinRequest.model"));
const getMe = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id).select("email username roleInTeam teamId role gender bio address job githubAccount").populate({
        path: "teamId",
        select: "marathonId"
    });
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        user
    });
};
exports.getMe = getMe;
const getAllUsers = async (req, res) => {
    const users = await user_model_1.default.find().select("username email role createdAt roleInTeam gender");
    res.status(statusCode_1.Status.OK).json({
        success: true,
        users
    });
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    const user = await (0, user_services_1.getUserServices)(req.params.id);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        user
    });
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    const result = user_schema_1.updateUserSchema.safeParse(req.body);
    if (!result.success)
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    const { username, address, bio, gender, githubAccount, job } = result.data;
    user.username = username || user.username;
    user.address = address || user.address;
    user.bio = bio || user.bio;
    user.gender = gender || user.gender;
    user.githubAccount = githubAccount || user.githubAccount;
    user.job = job || user.job;
    user.save();
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Updated successfully"
    });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    if (user.teamId) {
        const team = await team_model_1.default.findById(user.teamId);
        if (team) {
            team.members = team.members.filter((memberId) => String(memberId) !== String(user._id));
            await team.save();
        }
        await joinRequest_model_1.default.deleteMany({ userId: user._id });
    }
    await user_model_1.default.findByIdAndDelete(user._id);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "User deleted successfully",
    });
};
exports.deleteUser = deleteUser;
