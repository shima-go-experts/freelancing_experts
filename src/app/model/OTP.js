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
  },
  {
    timestamps: true,        // adds createdAt & updatedAt
  }
);

// TTL index: expire after 5 minutes
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.models.OTP ||
  mongoose.model("OTP", OTPSchema);
