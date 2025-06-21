"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionAceptOrRejectSchema = exports.submissionSolutionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.submissionSolutionSchema = zod_1.z.object({
    challengeId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), { message: "Invalid Challenge ID" }),
    teamId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), { message: "Invalid Team ID" }),
    submissionLink: zod_1.z.string().startsWith("https://github.com/"),
    notes: zod_1.z.string().optional()
});
exports.submissionAceptOrRejectSchema = zod_1.z.object({
    notesFromLeader: zod_1.z.string().optional()
});
