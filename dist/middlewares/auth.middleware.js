"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedRolesTeam = exports.CheckAccountOwner = exports.authorizedRoles = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandlerClass_1 = require("../utils/errorHandlerClass");
const statusCode_1 = require("../utils/statusCode");
const user_enum_1 = require("../types/user/user.enum");
const user_model_1 = __importDefault(require("../models/user.model"));
const constant_1 = require("../utils/constant");
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader?.startsWith("Bearer "))
            return next(new errorHandlerClass_1.AppError("No token provided", statusCode_1.Status.UNAUTHORIZED));
        const token = authHeader?.split(" ")[1];
        if (!token)
            return next(new errorHandlerClass_1.AppError("Token format invalid", statusCode_1.Status.UNAUTHORIZED));
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.id);
        if (!user)
            return next(new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND));
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errorHandlerClass_1.AppError)
            return next(error);
        return next(new errorHandlerClass_1.AppError("Invalid or expired token", statusCode_1.Status.UNAUTHORIZED));
    }
};
exports.auth = auth;
const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user?.role)) {
            throw new errorHandlerClass_1.AppError("Access denied", statusCode_1.Status.FORBIDDEN);
        }
        next();
    };
};
exports.authorizedRoles = authorizedRoles;
// notes (req.user?.id !== req.params.id && req.user?.role !== RolesType.ADMIN)
const CheckAccountOwner = (req, res, next) => {
    if (req.user?.id !== req.params.id && req.user?.role !== user_enum_1.RolesType.ADMIN)
        throw new errorHandlerClass_1.AppError("Access denied", statusCode_1.Status.FORBIDDEN);
    next();
};
exports.CheckAccountOwner = CheckAccountOwner;
const authorizedRolesTeam = (...roles) => {
    return async (req, res, next) => {
        const user = await user_model_1.default.findById(req.user?.id);
        if (!user)
            throw new errorHandlerClass_1.AppError(constant_1.USER_NOT_FOUND, statusCode_1.Status.NOT_FOUND);
        if (!roles.includes(user?.roleInTeam)) {
            throw new errorHandlerClass_1.AppError("Access denied", statusCode_1.Status.FORBIDDEN);
        }
        next();
    };
};
exports.authorizedRolesTeam = authorizedRolesTeam;
