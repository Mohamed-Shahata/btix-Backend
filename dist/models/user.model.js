"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../types/user/user.enum");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String, required: true, minlength: 2
    },
    email: {
        type: String, required: true, unique: true
    },
    gender: {
        type: String, enum: user_enum_1.Gender, default: user_enum_1.Gender.MALE
    },
    verificationCode: {
        type: String, default: null
    },
    points: {
        type: Number, default: 0
    },
    bio: {
        type: String, default: ""
    },
    job: {
        type: String, default: ""
    },
    address: {
        type: String, default: ""
    },
    githubAccount: {
        type: String, default: ""
    },
    isVerified: {
        type: Boolean, default: false
    },
    password: {
        type: String, minlength: 8
    },
    teamId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    resetPasswordToken: {
        type: String, default: ""
    },
    roleInTeam: {
        type: String, enum: user_enum_1.RolesTeam, default: null
    },
    role: {
        type: String, enum: user_enum_1.RolesType, default: user_enum_1.RolesType.MEMBER
    }
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
