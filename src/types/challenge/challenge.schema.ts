import mongoose from "mongoose";
import { z } from "zod";

export const createChallengeSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  point: z.number(),
  marathonId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid Challenge ID" }),
  deadline: z.coerce.date()
});

export type createChallengeInput = z.infer<typeof createChallengeSchema>;