"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleMarathon = exports.getAllMarathon = exports.joinMarathon = exports.leaveMarathon = exports.createMarathon = void 0;
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const constant_1 = require("../utils/constant");
const statusCode_1 = require("../utils/statusCode");
const marathon_schema_1 = require("../types/marathon/marathon.schema");
const marathon_model_1 = __importDefault(require("../models/marathon.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const team_model_1 = __importDefault(require("../models/team.model"));
const createMarathon = async (req, res, next) => {
    const result = marathon_schema_1.createMarathonSchema.safeParse(req.body);
    if (!result.success)
        throw next(new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.NOT_FOUND, result.error.flatten().fieldErrors));
    const { title, description, startDate, endDate, isActive } = result.data;
    if (new Date(startDate).getTime() < Date.now()) {
        throw new errorHandlerClass_1.AppError("Start date must not be in the past", statusCode_1.Status.BAD_REQUEST);
    }
    if (new Date(startDate) >= new Date(endDate)) {
        throw new errorHandlerClass_1.AppError("End date must be after start date.", statusCode_1.Status.BAD_REQUEST);
    }
    const marathon = await marathon_model_1.default.create({
        title, description, startDate, endDate, isActive
    });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Created Marathon successfully",
        marathon
    });
};
exports.createMarathon = createMarathon;
const leaveMarathon = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    await team_model_1.default.findByIdAndUpdate(user.teamId, { $set: { marathonId: null } });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Leave marathon success"
    });
};
exports.leaveMarathon = leaveMarathon;
const joinMarathon = async (req, res) => {
    const user = await user_model_1.default.findById(req.user?.id);
    const marathon = await marathon_model_1.default.findById(req.params.marathonId);
    if (!marathon)
        throw new errorHandlerClass_1.AppError("Marathon Not Found", statusCode_1.Status.NOT_FOUND);
    if (!user)
        throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
    await team_model_1.default.findByIdAndUpdate(user.teamId, { $set: { marathonId: marathon._id } });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Leave marathon success"
    });
};
exports.joinMarathon = joinMarathon;
const getAllMarathon = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalMarathons = await marathon_model_1.default.countDocuments();
    const marathons = await marathon_model_1.default.find()
        .skip(skip)
        .limit(limit);
    const totalPages = Math.ceil(totalMarathons / limit);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        currentPage: page,
        totalPages,
        totalMarathons,
        results: marathons.length,
        marathons
    });
};
exports.getAllMarathon = getAllMarathon;
const getSingleMarathon = async (req, res) => {
    const marathon = await marathon_model_1.default.findById(req.params.id);
    if (!marathon)
        throw new errorHandlerClass_1.AppError("Marathon Not Found", statusCode_1.Status.NOT_FOUND);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        marathon
    });
};
exports.getSingleMarathon = getSingleMarathon;
