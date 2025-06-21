"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connextion_db = () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI)
        throw new Error("MONGO_URI is not defined in enviroment variables");
    mongoose_1.default.connect(MONGO_URI)
        .then(() => console.log("connecton db success"))
        .catch((err) => console.log("connecton db error: ", err));
};
exports.default = connextion_db;
