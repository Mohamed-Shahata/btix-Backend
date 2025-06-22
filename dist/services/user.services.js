"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserServices = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getUserServices = (id) => {
    return user_model_1.default.findById(id).populate({
        path: "teamId",
        select: "marathonId name"
    });
};
exports.getUserServices = getUserServices;
