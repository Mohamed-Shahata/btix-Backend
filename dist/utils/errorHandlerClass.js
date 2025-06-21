"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status, error) {
        super(message);
        this.status = status || 500;
        this.error = error || {};
    }
}
exports.AppError = AppError;
