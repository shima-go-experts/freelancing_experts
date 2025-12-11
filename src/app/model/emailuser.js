import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String, // optional if OTP-only login
    },
  },
  { timestamps: true }
);

export default mongoose.models.Emailuser ||
  mongoose.model("Emailuser", UserSchema);
