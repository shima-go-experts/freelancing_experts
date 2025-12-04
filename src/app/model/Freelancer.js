import mongoose from "mongoose";

const FreelancerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Freelancer ||
  mongoose.model("Freelancer", FreelancerSchema);
