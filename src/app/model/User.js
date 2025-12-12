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

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: null,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Invalid mobile number"],
    },

    altMobileOrWhatsApp: {
      type: String,
      trim: true,
      default: null,
      match: [/^[0-9]{10}$/, "Invalid alternate number"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // --- START: FIELDS FOR FORGOT PASSWORD ---
    resetPasswordToken: {
      type: String,
      select: false, // Ensures token is not sent in normal queries
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // Ensures expiration is not sent in normal queries
    },
    // --- END: FIELDS FOR FORGOT PASSWORD ---

    role: {
      type: String,
      required: true,
      enum: ["admin", "organization", "client", "freelancer", "user"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);