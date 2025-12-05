// import mongoose from "mongoose";
// const ProjectSchema = new mongoose.Schema({
//   clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   title: String,
//   description: String,
//   status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" }
// }, { timestamps: true });

// export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);



import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
