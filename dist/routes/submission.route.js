"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submissionController = __importStar(require("../controllers/submission.controller"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_enum_1 = require("../types/user/user.enum");
const router = (0, express_1.Router)();
router.post("/:challengeId", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRolesTeam)(user_enum_1.RolesTeam.LEADER), (0, express_async_handler_1.default)(submissionController.submitSolution));
router.get("/requests", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.LEADER), (0, express_async_handler_1.default)(submissionController.getAllSubmissions));
//notes
router.get("/:teamId", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.LEADER, user_enum_1.RolesType.MEMBER), (0, express_async_handler_1.default)(submissionController.getTeamSubmissions));
router.post("/:id/accept", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.LEADER), (0, express_async_handler_1.default)(submissionController.acceptSubmission));
router.post("/:id/reject", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.LEADER), (0, express_async_handler_1.default)(submissionController.rejecttSubmission));
exports.default = router;
