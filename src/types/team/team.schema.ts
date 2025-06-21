import mongoose from "mongoose";
import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(5),
  maxMembers: z.number().min(2).max(4),
  marathonId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid Marthon ID" })
});

export type createTeamInput = z.infer<typeof createTeamSchema>;