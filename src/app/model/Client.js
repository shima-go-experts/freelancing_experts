// import mongoose from "mongoose";

// const ClientSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     phone: {
//       type: String,
//       required: true
//     },
//     role: {
//       type: String,
//       default: "client"
//     },
//     status: {
//       type: String,
//       enum: ["active", "blocked"],
//       default: "active"
//     },
//     isVerified: {
//       type: Boolean,
//       default: false
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Client || mongoose.model("Client", ClientSchema);




import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // Company / client name

    contactPerson: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      countryCode: { type: String, required: true, trim: true }, // "+91"
      number: { type: String, required: true, trim: true },       // "9876543210"
    },

    country: { type: String, required: true, trim: true },

    kycStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    kycDocuments: [
      {
        docType: { type: String, trim: true }, // "PAN", "Passport", etc.
        docUrl: { type: String, trim: true },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Client ||
  mongoose.model("Client", ClientSchema);
