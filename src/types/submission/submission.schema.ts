import mongoose from "mongoose";
import { z } from "zod";

export const submissionSolutionSchema = z.object({
  challengeId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid Challenge ID" }),
  teamId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid Team ID" }),
  submissionLink: z.string().startsWith("https://github.com/"),
  notes: z.string().optional()
});

export type submissionSolutionInput = z.infer<typeof submissionSolutionSchema>;

export const submissionAceptOrRejectSchema = z.object({
  notesFromLeader: z.string().optional()
});

export type submissionAceptOrRejectInput = z.infer<typeof submissionAceptOrRejectSchema>;