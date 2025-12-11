import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    otp: {
      type: String, // hashed OTP
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // ⏳ expires after 5 minutes
    },
  },
  { timestamps: true }
);

export default mongoose.models.OTP ||
  mongoose.model("OTP", OTPSchema);
