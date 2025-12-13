
// import mongoose from "mongoose";

// const FreelancerProfileSchema = new mongoose.Schema({

//   // =========================
//   // BASIC PROFILE
//   // =========================
//   full_name: { type: String, required: false, trim: true },
//   email: { type: String, required: false, lowercase: true, trim: true },
//   freelancer_photo: { type: String, trim: true },

//   bio: { type: String, trim: true },
//   skills: [{ type: String, trim: true }],
//   experience_years: { type: Number, default: 0, min: 0 },
//   hourly_rate: { type: Number, default: 0, min: 0 },

//   linkedin_url: { type: String, trim: true },
//   portfolio_website: { type: String, trim: true },
//   full_address: { type: String, trim: true },

//   // =========================
//   // KYC DOCUMENTS
//   // =========================
//   aadhar_or_passport_number: { type: String, trim: true },
//   aadhar_or_passport_front: { type: String, required: false },
//   aadhar_or_passport_back: { type: String, required: false },

//   pan_or_dl_number: { type: String, trim: true },
//   pan_or_driving_license_front: { type: String, required: false},
//   pan_or_driving_license_back: { type: String, required: false },

//   selfie_url: { type: String, required: false },

//   experience_certificates: { type: [String], required: false },

//   kyc_status: {
//     type: String,
//     enum: ["Pending", "Verified", "Rejected"],
//     default: "Pending"
//   },

//   // =========================
//   // RATINGS
//   // =========================
//   rating_average: { type: Number, default: 0, min: 0, max: 5 },
//   rating_count: { type: Number, default: 0, min: 0 }

// }, { timestamps: true });

// export default mongoose.models.FreelancerProfile ||
//   mongoose.model("FreelancerProfile", FreelancerProfileSchema);





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
