"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const marathon_model_1 = __importDefault(require("../models/marathon.model"));
const challenges_model_1 = __importDefault(require("../models/challenges.model"));
const team_model_1 = __importDefault(require("../models/team.model"));
node_cron_1.default.schedule("0 * * * *", async () => {
    const now = new Date();
    try {
        const expiredMarathons = await marathon_model_1.default.find({ endDate: { $lt: now } });
        if (expiredMarathons.length === 0)
            return;
        const updateTeams = expiredMarathons.map((marathon) => {
            team_model_1.default.updateMany({ marathonId: marathon._id }, { $set: { marathonId: null } });
        });
        await Promise.all(updateTeams);
        const deleteMarathonId = expiredMarathons.map((m) => m._id);
        await marathon_model_1.default.deleteMany({ _id: { $in: deleteMarathonId } });
        await challenges_model_1.default.deleteMany({ deadline: { $lt: now } });
        console.log("Old marathons deleted");
        console.log("Old challenge deleted");
    }
    catch (error) {
        console.log("error cron job: ", error);
    }
});
