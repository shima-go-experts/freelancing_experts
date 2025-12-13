// import mongoose from "mongoose";

// const FreelancerSchema = new mongoose.Schema(
//   {
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

//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       required: true,
//     },

//     skills: {
//       type: [String],
//       required: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
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

// export default mongoose.models.Freelancer ||
//   mongoose.model("Freelancer", FreelancerSchema);



// import mongoose from "mongoose";

// const FreelancerSchema = new mongoose.Schema(
//   {
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

//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       required: true,
//     },

//     country: {
//       type: String,
//       default: "",
//     },

//     skills: {
//       type: [String],
//       required: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     status: {
//       type: String,
//       enum: ["active", "blocked","inactive"],
//       default: "active",
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     // ⭐ KYC DOCUMENTS
//     kycDocuments: [
//       {
//         type: {
//           type: String, // Aadhaar / PAN / Passport
//           required: true,
//         },
//         url: {
//           type: String,
//           required: true,
//         },
//         verified: {
//           type: Boolean,
//           default: false,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Freelancer ||
//   mongoose.model("Freelancer", FreelancerSchema);
// //




import mongoose from "mongoose";

const FreelancerProfileSchema = new mongoose.Schema(
  {
    // =========================
    // LINK TO USER ACCOUNT
    // =========================
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // =========================
    // BASIC PROFILE
    // =========================
    full_name: { type: String, required: false, trim: true },
    email: { type: String, required: false, lowercase: true, trim: true },
    // freelancer_photo: { type: String, trim: true },

    bio: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experience_years: { type: Number, default: 0, min: 0 },
    hourly_rate: { type: Number, default: 0, min: 0 },

    linkedin_url: { type: String, trim: true },
    portfolio_website: { type: String, trim: true },
    full_address: { type: String, trim: true },

    // =========================
    // CATEGORIES & SUBCATEGORIES
    // =========================
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
      },
    ],

    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: false,
      },
    ],

    // =========================
    // KYC DOCUMENTS
    // =========================
    aadhar_or_passport_number: { type: String, trim: true },
    aadhar_or_passport_front: { type: String },
    aadhar_or_passport_back: { type: String },

    pan_or_dl_number: { type: String, trim: true },
    pan_or_driving_license_front: { type: String },
    pan_or_driving_license_back: { type: String },

    selfie_url: { type: String, required: false },

    experience_certificates: { type: [String], required: false },

    kyc_status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    // =========================
    // RATINGS
    // =========================
    rating_average: { type: Number, default: 0, min: 0, max: 5 },
    rating_count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.FreelancerProfile ||
  mongoose.model("FreelancerProfile", FreelancerProfileSchema);
