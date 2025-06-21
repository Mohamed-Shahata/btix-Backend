"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = void 0;
const statusCode_1 = require("../utils/statusCode");
const team_model_1 = __importDefault(require("../models/team.model"));
const getLeaderboard = async (req, res) => {
    const teams = await team_model_1.default.find().sort({ totalPoints: -1 });
    res.status(statusCode_1.Status.OK).json({
        success: true,
        teams
    });
};
exports.getLeaderboard = getLeaderboard;
