"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarathonSchema = void 0;
const zod_1 = require("zod");
exports.createMarathonSchema = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(20),
    isActive: zod_1.z.boolean(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date()
}).refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date"
});
