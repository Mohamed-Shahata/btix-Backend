import { z } from "zod";

export const createMarathonSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  isActive: z.boolean(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date()
}).refine((data) => data.startDate < data.endDate, {
  message: "Start date must be before end date"
})

export type createMarathonInput = z.infer<typeof createMarathonSchema>;