"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../types/user/user.enum");
const submissionSchema = new mongoose_1.Schema({
    challengeId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Challenge", required: true
    },
    teamId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Team", required: true
    },
    status: {
        type: String, enum: user_enum_1.JoinStatus, default: user_enum_1.JoinStatus.PENDING // notes
    },
    notes: {
        type: String, default: null
    },
    notesFromLeader: {
        type: String, default: null
    },
    submissionLink: {
        type: String, required: true
    }
}, {
    timestamps: true
});
const Submission = (0, mongoose_1.model)("Submission", submissionSchema);
exports.default = Submission;
