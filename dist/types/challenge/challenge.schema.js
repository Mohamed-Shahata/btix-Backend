"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChallengeSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.createChallengeSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(20),
    point: zod_1.z.number(),
    marathonId: zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), { message: "Invalid Challenge ID" }),
    deadline: zod_1.z.coerce.date()
});
