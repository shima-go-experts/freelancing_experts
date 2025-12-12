// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// // Prevents model overwrite on hot reload
// export default mongoose.models.User || mongoose.model("User", userSchema);

// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//     },
//   },
//   { timestamps: true }
// );

// // Prevent model overwrite error during hot reload
// export default mongoose.models.User || mongoose.model("User", UserSchema);

// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   roles: { type: String, enum: ["client", "freelancer", "organization", "admin"], required: true },
//   status: { type: String, enum: ["active", "blocked", "deleted"], default: "active" }
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model("User", UserSchema);




// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     middleName: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     mobileNo: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       match: [/^[0-9]{10}$/, "Invalid mobile number"],
//     },

//     altMobileOrWhatsApp: {
//       type: String,
//       trim: true,
//       default: null,
//       match: [/^[0-9]{10}$/, "Invalid alternate number"],
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Invalid email format",
//       ],
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     role: {
//       type: String,
//       required: true,
//       enum: ["admin", "organization", "client", "freelancer", "user"],
//       default: "user",
//     },

//     status: {
//       type: String,
//       enum: ["active", "blocked", "deleted"],
//       default: "active",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User ||
//   mongoose.model("User", UserSchema);



import mongoose from "mongoose";

const FreelancerProfileSchema = new mongoose.Schema(
  {
    // =========================
    // LINK TO USER ACCOUNT
    // =========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
