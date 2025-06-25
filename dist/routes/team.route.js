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
const teamController = __importStar(require("../controllers/team.controller"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_enum_1 = require("../types/user/user.enum");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.MEMBER, user_enum_1.RolesType.ADMIN), (0, express_async_handler_1.default)(teamController.createTeam));
router.get("/myTeam", auth_middleware_1.auth, (0, express_async_handler_1.default)(teamController.getMyTeam));
router.put("/join/:teamId", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.MEMBER), (0, express_async_handler_1.default)(teamController.joinTeam));
router.put("/leave/:teamId", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRoles)(user_enum_1.RolesType.MEMBER), (0, express_async_handler_1.default)(teamController.leaveTeam));
router.get("/:teamId/requests", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRolesTeam)(user_enum_1.RolesTeam.LEADER), (0, express_async_handler_1.default)(teamController.getRequestJoinTeam));
router.get("/requests/me", auth_middleware_1.auth, (0, express_async_handler_1.default)(teamController.getAllJoinRequestWithMe));
router.post("/:teamId/requests/:requestId/accept", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRolesTeam)(user_enum_1.RolesTeam.LEADER), (0, express_async_handler_1.default)(teamController.acceptJoinTeam));
router.post("/:teamId/requests/:requestId/reject", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRolesTeam)(user_enum_1.RolesTeam.LEADER), (0, express_async_handler_1.default)(teamController.rejectJoinTeam));
router.get("/:id", auth_middleware_1.auth, (0, express_async_handler_1.default)(teamController.getTeam));
router.get("/", auth_middleware_1.auth, (0, express_async_handler_1.default)(teamController.getAllTeam));
router.delete("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorizedRolesTeam)(user_enum_1.RolesTeam.LEADER), (0, express_async_handler_1.default)(teamController.deleteTeam));
exports.default = router;
