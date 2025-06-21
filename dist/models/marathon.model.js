"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const marathonSchema = new mongoose_1.Schema({
    title: {
        type: String, required: true, minlength: 2
    },
    description: {
        type: String, required: true, minlength: 20
    },
    startDate: {
        type: Date, required: true
    },
    endDate: {
        type: Date, required: true
    },
    isActive: {
        type: Boolean, default: false
    }
}, {
    timestamps: true
});
const Marathon = (0, mongoose_1.model)("Marathon", marathonSchema);
exports.default = Marathon;
