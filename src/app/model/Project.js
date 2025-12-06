// // import mongoose from "mongoose";
// // const ProjectSchema = new mongoose.Schema({
// //   clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   title: String,
// //   description: String,
// //   status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" }
// // }, { timestamps: true });

// // export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);



// import mongoose from "mongoose";

// const ProjectSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     budget: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["open", "in_progress", "completed", "cancelled"],
//       default: "open",
//     },
//     freelancer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Freelancer",
//       required: false,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Project ||
//   mongoose.model("Project", ProjectSchema);



// import mongoose from "mongoose";

// const ProjectSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },

//     clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },

//     organizationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: true,
//     },

//     freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", default: null },

//     budget: {
//       amount: { type: Number, required: true },
//       type: { type: String, enum: ["fixed", "hourly"], default: "fixed" },
//     },

//     startDate: { type: Date, default: null },
//     endDate: { type: Date, default: null },

//     status: {
//       type: String,
//       enum: ["pending", "approved", "in-progress", "completed", "cancelled"],
//       default: "pending",
//       index: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);


import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      default: null,
    },

    budget: {
      amount: { type: Number, required: true },
      type: {
        type: String,
        enum: ["fixed", "hourly"],
        default: "fixed",
      },
    },

    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },

    status: {
      type: String,
      enum: ["pending", "approved", "in-progress", "completed", "cancelled","rejected"],
      default: "pending",
      index: true,
    },

    // ✅ Added for verification system
    isVerified: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date, default: null },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
