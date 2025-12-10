
import mongoose from "mongoose";

const FreelancerProfileSchema = new mongoose.Schema({

  // =========================
  // BASIC PROFILE
  // =========================
  full_name: { type: String, required: false, trim: true },
  email: { type: String, required: false, lowercase: true, trim: true },
  freelancer_photo: { type: String, trim: true },

  bio: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  experience_years: { type: Number, default: 0, min: 0 },
  hourly_rate: { type: Number, default: 0, min: 0 },

  linkedin_url: { type: String, trim: true },
  portfolio_website: { type: String, trim: true },
  full_address: { type: String, trim: true },

  // =========================
  // KYC DOCUMENTS
  // =========================
  aadhar_or_passport_number: { type: String, trim: true },
  aadhar_or_passport_front: { type: String, required: true },
  aadhar_or_passport_back: { type: String, required: true },

  pan_or_dl_number: { type: String, trim: true },
  pan_or_driving_license_front: { type: String, required: true },
  pan_or_driving_license_back: { type: String, required: true },

  selfie_url: { type: String, required: true },

  experience_certificates: { type: [String], required: true },

  kyc_status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending"
  },

  // =========================
  // RATINGS
  // =========================
  rating_average: { type: Number, default: 0, min: 0, max: 5 },
  rating_count: { type: Number, default: 0, min: 0 }

}, { timestamps: true });

export default mongoose.models.FreelancerProfile ||
  mongoose.model("FreelancerProfile", FreelancerProfileSchema);
