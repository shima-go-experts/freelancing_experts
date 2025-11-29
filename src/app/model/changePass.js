import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    changePassword: { type: Boolean, default: true } // used internally
  },
  { timestamps: true }
);

export default mongoose.models.Adminpass || mongoose.model("Adminpass", AdminSchema);
