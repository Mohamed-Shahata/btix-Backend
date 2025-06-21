import cron from "node-cron";
import Marathon from "../models/marathon.model";
import Challenge from "../models/challenges.model";
import Team from "../models/team.model";

cron.schedule("0 * * * *", async () => {
  const now = new Date();

  try {
    const expiredMarathons = await Marathon.find({ endDate: { $lt: now } });

    if (expiredMarathons.length === 0)
      return;

    const updateTeams = expiredMarathons.map((marathon) => {
      Team.updateMany(
        { marathonId: marathon._id },
        { $set: { marathonId: null } }
      )
    })

    await Promise.all(updateTeams);

    const deleteMarathonId = expiredMarathons.map((m) => m._id);
    await Marathon.deleteMany({ _id: { $in: deleteMarathonId } });


    await Challenge.deleteMany({ deadline: { $lt: now } });

    console.log("Old marathons deleted");
    console.log("Old challenge deleted");
  } catch (error) {
    console.log("error cron job: ", error)
  }
});