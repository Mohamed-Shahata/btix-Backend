"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../types/user/user.enum");
const joinRequestSchema = new mongoose_1.Schema({
    teamId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Team", required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true
    },
    status: {
        type: String, enum: user_enum_1.JoinStatus, default: user_enum_1.JoinStatus.PENDING
    }
}, {
    timestamps: true
});
const JoinRequest = (0, mongoose_1.model)("JoinRequest", joinRequestSchema);
exports.default = JoinRequest;
