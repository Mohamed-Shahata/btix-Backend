"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChallengeById = exports.getChallengesForMarathon = exports.createChallenge = void 0;
const statusCode_1 = require("../utils/statusCode");
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const constant_1 = require("../utils/constant");
const challenge_schema_1 = require("../types/challenge/challenge.schema");
const challenges_model_1 = __importDefault(require("../models/challenges.model"));
const marathon_model_1 = __importDefault(require("../models/marathon.model"));
//
const createChallenge = async (req, res) => {
    const marathon = await marathon_model_1.default.findById(req.body.marathonId);
    if (!marathon)
        throw new errorHandlerClass_1.AppError("Marathon Not Found", statusCode_1.Status.NOT_FOUND);
    const result = challenge_schema_1.createChallengeSchema.safeParse(req.body);
    if (!result.success)
        throw new errorHandlerClass_1.AppError(constant_1.VALIDATION_ERROR, statusCode_1.Status.BAD_REQUEST, result.error.flatten().fieldErrors);
    const { title, description, point, marathonId, deadline } = result.data;
    const DateNow = new Date();
    if (deadline < DateNow || deadline > marathon.endDate)
        throw new errorHandlerClass_1.AppError("Deadline must be within marathon period", statusCode_1.Status.BAD_REQUEST);
    const newChallenge = await challenges_model_1.default.create({
        title, description, point, marathonId, deadline
    });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        message: "Created challenge successfully",
        newChallenge
    });
};
exports.createChallenge = createChallenge;
const getChallengesForMarathon = async (req, res) => {
    const marathon = await marathon_model_1.default.findById(req.params.marathonId);
    if (!marathon)
        throw new errorHandlerClass_1.AppError("Marathon Not Found", statusCode_1.Status.NOT_FOUND);
    const challenges = await challenges_model_1.default.find({ marathonId: marathon._id });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        challenges
    });
};
exports.getChallengesForMarathon = getChallengesForMarathon;
const getChallengeById = async (req, res) => {
    const challenge = await challenges_model_1.default.findById(req.params.id);
    if (!challenge)
        throw new errorHandlerClass_1.AppError("Challenge Not Found", statusCode_1.Status.NOT_FOUND);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        challenge
    });
};
exports.getChallengeById = getChallengeById;
