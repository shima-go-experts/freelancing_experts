// import mongoose from "mongoose";

// const OrganisationSchema = new mongoose.Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Organisation ||
//   mongoose.model("Organisation", OrganisationSchema);


import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema(
  {
    
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, required: true },
    },

    contactPerson: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    // KYC MANAGEMENT
    kyc: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },

      documents: [
        {
          type: { type: String }, // PAN / GST / Certification
          url: String,
          uploadedAt: { type: Date, default: Date.now },
        },
      ],

      verifiedAt: {
        type: Date,
      },
    },

    // SYSTEM FLAGS
    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Organization ||
  mongoose.model("Organisation", OrganisationSchema);
