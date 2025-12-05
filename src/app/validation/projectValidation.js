import { z } from "zod";

export const ProjectValidationSchema = z.object({
  title: z.string().min(3, "Project title is required"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
  freelancer: z.string().optional(),
});
