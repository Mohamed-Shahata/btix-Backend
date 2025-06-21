"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.createTeamSchema = zod_1.z.object({
    name: zod_1.z.string().min(5),
    maxMembers: zod_1.z.number().min(2).max(4),
    marathonId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), { message: "Invalid Marthon ID" })
});
