"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = void 0;
const statusCode_1 = require("../utils/statusCode");
const team_model_1 = __importDefault(require("../models/team.model"));
const getLeaderboard = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalTeams = await team_model_1.default.countDocuments();
    const teams = await team_model_1.default.find()
        .sort({ totalPoints: -1 })
        .skip(skip)
        .limit(limit);
    const totalPages = Math.ceil(totalTeams / limit);
    res.status(statusCode_1.Status.OK).json({
        success: true,
        currentPage: page,
        totalPages,
        totalTeams,
        results: teams.length,
        teams
    });
};
exports.getLeaderboard = getLeaderboard;
