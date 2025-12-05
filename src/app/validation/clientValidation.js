export const ClientValidationSchema = z.object({
  name: z.string().min(3),
  contactPerson: z.string().min(3),
  email: z.string().email(),
  phone: z.object({
    countryCode: z.string(),
    number: z.string(),
  }),
  country: z.string(),
  
  kycDocuments: z.array(
    z.object({
      docType: z.string(),
      docUrl: z.string().url(),
    })
  ).optional(),
   kycStatus: z.enum(["pending", "submitted", "verified", "rejected"]),
  photo: z.string().optional(),
});
