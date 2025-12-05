// import { z } from "zod";

// export const ProjectValidationSchema = z.object({
//   title: z.string().min(3, "Project title is required"),
//   budget: z.number().min(1, "Budget must be greater than 0"),
//   status: z.enum(["open", "in_progress", "completed", "cancelled"]).optional(),
//   freelancer: z.string().optional(),
// });


import { z } from "zod";

export const ProjectValidation = z.object({
  title: z.string().min(3),
  description: z.string().min(10),

  clientId: z.string().min(1),
  organizationId: z.string().min(1),

  budget: z.object({
    amount: z.number().min(1),
    type: z.enum(["fixed", "hourly"]).default("fixed"),
  }),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
