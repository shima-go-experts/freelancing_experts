// import { z } from "zod";

// export const ProjectValidationSchema = z.object({
//   title: z.string().min(3, "Project title is required"),
//   budget: z.number().min(1, "Budget must be greater than 0"),
//   status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
//   freelancer: z.string().optional(),
// });


import { z } from "zod";

export const ProjectValidationSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),

  clientId: z.string().min(1, "clientId is required"),
  organizationId: z.string().min(1, "organizationId is required"),
  freelancerId: z.string().optional(),

  budget: z.object({
    amount: z.number().min(1, "Budget amount is required"),
    type: z.enum(["fixed", "hourly"]).default("fixed"),
  }),

  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),

  status: z.enum([
    "pending",
    "approved",
    "in-progress",
    "completed",
    "cancelled",
  ]).default("pending"),

  isVerified: z.boolean().optional(),
  verifiedAt: z.string().optional(),
  verifiedBy: z.string().optional(),
});
