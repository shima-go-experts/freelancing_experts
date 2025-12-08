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



// import mongoose from "mongoose";

// const OrganisationSchema = new mongoose.Schema(
//   {
    
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     // KYC MANAGEMENT
//     kyc: {
//       status: {
//         type: String,
//         enum: ["pending", "verified", "rejected"],
//         default: "pending",
//       },

//       documents: [
//         {
//           type: { type: String }, // PAN / GST / Certification
//           url: String,
//           uploadedAt: { type: Date, default: Date.now },
//         },
//       ],

//       verifiedAt: {
//         type: Date,
//       },
//     },

//     // SYSTEM FLAGS
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "inactive",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Organization ||
//   mongoose.model("Organisation", OrganisationSchema);



import mongoose from "mongoose";

const OrganisationSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    companyLandlineNo: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // CLOUDINARY IMAGE FIELDS
  
    // Company Logo (Single Image)
    logo: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true }
    },

    officeWebsiteLink: {
      type: String,
      trim: true
    },

    linkedinLink: {
      type: String,
      trim: true
    },

    // Organization Photos (Max 10 Images)
    organizationPhotos: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now }
        }
      ],
      validate: {
        validator: function (val) {
          return val.length <= 10;
        },
        message: "Maximum 10 organization photos allowed"
      }
    },

    // -------------------------
    // KYC MANAGEMENT
    // -------------------------

    kyc: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
      },

      documents: [
        {
          type: { type: String, trim: true },
          url: { type: String, trim: true },
          public_id: { type: String, trim: true },
          uploadedAt: { type: Date, default: Date.now }
        }
      ],

      verifiedAt: {
        type: Date
      }
    },

    // -------------------------
    // SYSTEM FLAGS
    // -------------------------

    isVerified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Organisation ||
  mongoose.model("Organisation", OrganisationSchema);
