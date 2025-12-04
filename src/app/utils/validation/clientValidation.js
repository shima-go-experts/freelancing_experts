import { z } from "zod";

export const ClientValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  contactPerson: z.string().min(3, "Contact person name is required."),
  email: z.string().email("Invalid email format."),
  phone: z.object({
    countryCode: z.string().min(1, "Country code is required."),
    number: z.string().min(5, "Phone number is too short.")
  }),
  country: z.string().min(2, "Country is required."),
  kycDocuments: z.array(
    z.object({
      docType: z.string(),
      docUrl: z.string().url("Document URL must be valid")
    })
  ).optional(),
});
