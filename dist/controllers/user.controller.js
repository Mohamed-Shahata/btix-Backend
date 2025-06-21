"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getAllUsers = exports.getMe = void 0;
const statusCode_1 = require("../utils/statusCode");
const user_services_1 = require("../services/user.services");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const constant_1 = require("../utils/constant");
const user_model_1 = __importDefault(require("../models/user.model"));
const getMe = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id).select("email username roleInTeam teamId role gender").populate({
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
        user: {
            _id: user?._id,
            username: user?.username,
            email: user?.email,
            role: user?.role
        }
    });
};
exports.getUser = getUser;
