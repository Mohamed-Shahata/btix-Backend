"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.RolesTeam = exports.JoinStatus = exports.RolesType = void 0;
var RolesType;
(function (RolesType) {
    RolesType["ADMIN"] = "admin";
    RolesType["MEMBER"] = "member";
    RolesType["LEADER"] = "leader";
})(RolesType || (exports.RolesType = RolesType = {}));
var JoinStatus;
(function (JoinStatus) {
    JoinStatus["PENDING"] = "pending";
    JoinStatus["ACCEPTED"] = "accepted";
    JoinStatus["REJECTED"] = "rejected";
    JoinStatus["NULL"] = "null";
})(JoinStatus || (exports.JoinStatus = JoinStatus = {}));
var RolesTeam;
(function (RolesTeam) {
    RolesTeam["MEMBER"] = "member";
    RolesTeam["LEADER"] = "leader";
})(RolesTeam || (exports.RolesTeam = RolesTeam = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
