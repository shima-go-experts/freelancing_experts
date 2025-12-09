// import mongoose from "mongoose";

// const OrganisationKycSchema = new mongoose.Schema(
//   {
//     // Reference to Organisation
//     organisationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organisation",
//       required: true,
//       unique: true // already creates a unique index
//     },

//     // Type of Organisation
//     typeOfOrganisation: {
//       type: String,
//       enum: ["private", "public", "proprietory", "partnership", "startup", "ltp", "pvt ltd", "opc pvt ltd", "other"],
//       required: true
//     },

//     // Business email with format validation
//     businessEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
//     },

//     // Optional registration number
//     registrationNumber: {
//       type: String,
//       trim: true,
//       default: null
//     },

//     //---------------------------------
//     // Director Identity Documents (Front + Back)
//     //---------------------------------
//     directorPan: {
//       front: { type: String, required: true, validate: /\.(jpg|jpeg|png)$/i },
//       back: { type: String, required: true, validate: /\.(jpg|jpeg|png)$/i },
//       front_public_id: { type: String, required: true },
//       back_public_id: { type: String, required: true }
//     },

//     directorDl: {
//       front: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       back: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       front_public_id: { type: String },
//       back_public_id: { type: String }
//     },

//     directorAadhar: {
//       front: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       back: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       front_public_id: { type: String },
//       back_public_id: { type: String }
//     },

//     directorPassport: {
//       front: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       back: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       front_public_id: { type: String },
//       back_public_id: { type: String }
//     },

//     //---------------------------------
//     // Organisation Logo (Single Image)
//     //---------------------------------
//     logo: {
//       url: { type: String, trim: true },
//       public_id: { type: String, trim: true }
//     },

//     //---------------------------------
//     // Company Photos (Up to 10 Images)
//     //---------------------------------
// companyPhotos: {
//   type: [
//     {
//       url: {
//         type: String,
//         required: true,
//         validate: {
//           validator: (v) => /\.(jpg|jpeg|png)(\?.*)?$/i.test(v),
//           message: props => `${props.value} is not a valid image URL`
//         }
//       },
//       public_id: { type: String, required: true },
//       uploadedAt: { type: Date, default: Date.now }
//     }
//   ],
//   validate: {
//     validator: function (val) {
//       return val.length <= 10; // max 10 photos
//     },
//     message: "Maximum 10 company photos allowed"
//   }
// },


//     //---------------------------------
//     // Employer Address
//     //---------------------------------
//     employerAddress: {
//       addressLine1: { type: String, required: true },
//       addressLine2: { type: String },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       country: { type: String, required: true },
//       pincode: { type: String, required: true }
//     },

//     //---------------------------------
//     // Employer Address Proof
//     //---------------------------------
//     employerAddressProof: {
//       url: { type: String, validate: /\.(jpg|jpeg|png)$/i },
//       public_id: { type: String }
//     },

//     //---------------------------------
//     // Status & Rejection Reason
//     //---------------------------------
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending"
//     },

//     rejectionReason: { type: String, default: null }
//   },
//   { timestamps: true }
// );

// // Indexes for performance
// // OrganisationKycSchema.index({ organisationId: 1 }); // removed duplicate index
// OrganisationKycSchema.index({ status: 1 });

// export default mongoose.models.OrganisationKyc ||
//   mongoose.model("OrganisationKyc", OrganisationKycSchema);




// import mongoose from "mongoose";

// // ----------------------------
// // Sub-schema for Documents
// // ----------------------------
// const DocumentSchema = new mongoose.Schema({
//   front: { 
//     type: String, 
//     required: true, 
//     trim: true, 
//     validate: {
//       validator: v => /\.(jpg|jpeg|png)$/i.test(v),
//       message: "Front document must be a JPG or PNG image"
//     }
//   },
//   back: { 
//     type: String, 
//     required: true, 
//     trim: true, 
//     validate: {
//       validator: v => /\.(jpg|jpeg|png)$/i.test(v),
//       message: "Back document must be a JPG or PNG image"
//     }
//   },
//   front_public_id: { type: String, required: true, trim: true },
//   back_public_id: { type: String, required: true, trim: true }
// });

// // ----------------------------
// // Sub-schema for optional Documents
// // ----------------------------
// const OptionalDocumentSchema = new mongoose.Schema({
//   front: { 
//     type: String, 
//     trim: true, 
//     validate: {
//       validator: v => !v || /\.(jpg|jpeg|png)$/i.test(v),
//       message: "Front document must be a JPG or PNG image"
//     }
//   },
//   back: { 
//     type: String, 
//     trim: true, 
//     validate: {
//       validator: v => !v || /\.(jpg|jpeg|png)$/i.test(v),
//       message: "Back document must be a JPG or PNG image"
//     }
//   },
//   front_public_id: { type: String, trim: true },
//   back_public_id: { type: String, trim: true }
// });

// // ----------------------------
// // Sub-schema for Address
// // ----------------------------
// const AddressSchema = new mongoose.Schema({
//   addressLine1: { type: String, required: true, trim: true },
//   addressLine2: { type: String, trim: true },
//   city: { type: String, required: true, trim: true },
//   state: { type: String, required: true, trim: true },
//   country: { type: String, required: true, trim: true },
//   pincode: { type: String, required: true, trim: true }
// });

// // ----------------------------
// // Sub-schema for Images
// // ----------------------------
// const ImageSchema = new mongoose.Schema({
//   url: { 
//     type: String, 
//     required: true, 
//     trim: true, 
//     validate: {
//       validator: v => /\.(jpg|jpeg|png)$/i.test(v),
//       message: "Image must be a JPG or PNG file"
//     }
//   },
//   public_id: { type: String, required: true, trim: true },
//   uploadedAt: { type: Date, default: Date.now }
// });

// // ----------------------------
// // Main Organisation + KYC Schema
// // ----------------------------
// const OrganisationSchema = new mongoose.Schema({
//   // Organisation Info
//   name: { type: String, required: true, trim: true },
//   businessEmail: { 
//     type: String, 
//     required: true, 
//     trim: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
//   },
//   typeOfOrganisation: {
//     type: String,
//     enum: ["private", "public", "proprietory", "partnership", "startup", "ltp", "pvt ltd", "opc pvt ltd", "other"],
//     required: true
//   },
//   registrationNumber: { 
//     type: String, 
//     trim: true,
//     required: function() {
//       // Conditionally required for certain organisation types
//       return ["pvt ltd", "opc pvt ltd", "private"].includes(this.typeOfOrganisation);
//     }
//   },

//   // KYC Documents
//   directorPan: { type: DocumentSchema, required: true },
//   directorAadhar: { type: OptionalDocumentSchema },
//   directorDl: { type: OptionalDocumentSchema },
//   directorPassport: { type: OptionalDocumentSchema },

//   // Company Logo (required for KYC)
//   logo: { type: ImageSchema, required: true },

//   // Company Photos (Max 10)
//   companyPhotos: { 
//     type: [ImageSchema],
//     validate: {
//       validator: val => val.length <= 10,
//       message: "Maximum 10 company photos allowed"
//     }
//   },

//   // Employer Address
//   employerAddress: { type: AddressSchema, required: true },

//   // Employer Address Proof (required for KYC)
//   employerAddressProof: { type: ImageSchema, required: true },

//   // Status & Rejection Reason
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//   rejectionReason: { type: String, default: null }

// }, { timestamps: true });

// // Index for quick lookup of pending KYC
// OrganisationSchema.index({ status: 1 });

// export default mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);
