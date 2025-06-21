"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: {
        type: String, required: true, minlength: 2,
    },
    leader: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true
        }
    ],
    maxMembers: {
        type: Number, default: 0
    },
    marathonId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Marathon", required: true
    },
    totalPoints: {
        type: Number, default: 0
    }
}, {
    timestamps: true
});
const Team = (0, mongoose_1.model)("Team", teamSchema);
exports.default = Team;
