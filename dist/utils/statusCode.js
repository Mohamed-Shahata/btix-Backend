"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["OK"] = 200] = "OK";
    Status[Status["CREATED"] = 201] = "CREATED";
    Status[Status["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    Status[Status["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    Status[Status["FORBIDDEN"] = 403] = "FORBIDDEN";
    Status[Status["NOT_FOUND"] = 404] = "NOT_FOUND";
    Status[Status["CONFLICT"] = 409] = "CONFLICT";
    Status[Status["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(Status || (exports.Status = Status = {}));
