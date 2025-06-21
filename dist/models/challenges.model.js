"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const challengeSchema = new mongoose_1.Schema({
    title: {
        type: String, required: true, minlength: 2
    },
    description: {
        type: String, required: true, minlength: 20
    },
    point: {
        type: Number, required: true
    },
    marathonId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Marathon", required: true
    },
    deadline: {
        type: Date
    }
}, {
    timestamps: true
});
const Challenge = (0, mongoose_1.model)("Challenge", challengeSchema);
exports.default = Challenge;
