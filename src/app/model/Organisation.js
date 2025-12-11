// import mongoose from "mongoose";

// const OrganisationSchema = new mongoose.Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     name: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Organisation ||
//   mongoose.model("Organisation", OrganisationSchema);



// import mongoose from "mongoose";

// const OrganisationSchema = new mongoose.Schema(
//   {
    
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     // KYC MANAGEMENT
//     kyc: {
//       status: {
//         type: String,
//         enum: ["pending", "verified", "rejected"],
//         default: "pending",
//       },

//       documents: [
//         {
//           type: { type: String }, // PAN / GST / Certification
//           url: String,
//           uploadedAt: { type: Date, default: Date.now },
//         },
//       ],

//       verifiedAt: {
//         type: Date,
//       },
//     },

//     // SYSTEM FLAGS
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "inactive",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Organization ||
//   mongoose.model("Organisation", OrganisationSchema);



// import mongoose from "mongoose";

// const OrganisationSchema = new mongoose.Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true
//     },

//     companyLandlineNo: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6
//     },

//     // CLOUDINARY IMAGE FIELDS
  
//     // Company Logo (Single Image)
//     logo: {
//       url: { type: String, trim: true },
//       public_id: { type: String, trim: true }
//     },

//     officeWebsiteLink: {
//       type: String,
//       trim: true
//     },

//     linkedinLink: {
//       type: String,
//       trim: true
//     },

//     // Organization Photos (Max 10 Images)
//     organizationPhotos: {
//       type: [
//         {
//           url: { type: String, required: true },
//           public_id: { type: String, required: true },
//           uploadedAt: { type: Date, default: Date.now }
//         }
//       ],
//       validate: {
//         validator: function (val) {
//           return val.length <= 10;
//         },
//         message: "Maximum 10 organization photos allowed"
//       }
//     },

//     // -------------------------
//     // KYC MANAGEMENT
//     // -------------------------

//     kyc: {
//       status: {
//         type: String,
//         enum: ["pending", "verified", "rejected"],
//         default: "pending"
//       },

//       documents: [
//         {
//           type: { type: String, trim: true },
//           url: { type: String, trim: true },
//           public_id: { type: String, trim: true },
//           uploadedAt: { type: Date, default: Date.now }
//         }
//       ],

//       verifiedAt: {
//         type: Date
//       }
//     },

//     // -------------------------
//     // SYSTEM FLAGS
//     // -------------------------

//     isVerified: {
//       type: Boolean,
//       default: false
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "inactive"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Organisation ||
//   mongoose.model("Organisation", OrganisationSchema);




// import mongoose from "mongoose";

// // ----------------------------
// // Sub-schema for Documents
// // ----------------------------
// const DocumentSchema = new mongoose.Schema({
//   front: { type: String, required: true, trim: true },
//   back: { type: String, required: true, trim: true },
//   front_public_id: { type: String, required: true, trim: true },
//   back_public_id: { type: String, required: true, trim: true }
// });

// // ----------------------------
// // Sub-schema for optional Documents
// // ----------------------------

// const OptionalDocumentSchema = new mongoose.Schema({
//   front: { type: String, trim: true },
//   back: { type: String, trim: true },
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
//   url: { type: String, required: true, trim: true },
//   public_id: { type: String, required: true, trim: true },
//   uploadedAt: { type: Date, default: Date.now }
// });

// // ----------------------------
// // Main Organisation + KYC Schema
// // ----------------------------
// const OrganisationSchema = new mongoose.Schema({
//   // Organisation Info
//   CompanyName: { type: String, required: true, trim: true },
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





 import mongoose from "mongoose";

// ----------------------------
// Sub-schema for Documents
// ----------------------------
const DocumentSchema = new mongoose.Schema({
  front: { type: String, required: false, trim: true },
  back: { type: String, required: false, trim: true },
  front_public_id: { type: String, required: false, trim: true },
  back_public_id: { type: String, required: false, trim: true }
});

// ----------------------------
// Sub-schema for optional Documents
// ----------------------------
const OptionalDocumentSchema = new mongoose.Schema({
  front: { type: String, trim: true },
  back: { type: String, trim: true },
  front_public_id: { type: String, trim: true },
  back_public_id: { type: String, trim: true }
});

// ----------------------------
// Sub-schema for Address
// ----------------------------
const AddressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: false, trim: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, required: false, trim: true },
  state: { type: String, required: false, trim: true },
  country: { type: String, required: false, trim: true },
  pincode: { type: String, required: false, trim: true }
});

// ----------------------------
// Sub-schema for Images
// ----------------------------
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: false, trim: true },
  public_id: { type: String, required: false, trim: true },
  uploadedAt: { type: Date, default: Date.now }
});

// ----------------------------
// Main Organisation + KYC Schema
// ----------------------------
const OrganisationSchema = new mongoose.Schema({

  // Organisation Info
  CompanyName: { type: String, required: false, trim: true },
  businessEmail: { 
    type: String, 
    required: false, 
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
  },

  typeOfOrganisation: {
    type: String,
    enum: ["private", "public", "proprietory", "partnership", "startup", "ltp", "pvt ltd", "opc pvt ltd", "other"],
    required: false
  },
  registrationNumber: { 
    type: String, 
    trim: true,
    required: function() {
      return ["pvt ltd", "opc pvt ltd", "private"].includes(this.typeOfOrganisation);
    }
  },

  // ----------------------------
  // 👉 Added Fields Here
  // ----------------------------

  gstNumber: { 
    type: String, 
    required: false, 
    trim: true 
  },

  gstProof: { 
    type: DocumentSchema, 
    required: false
  },

  businessNumber: { 
    type: String, 
    trim: true 
  },

  businessWebsite: { 
    type: String, 
    trim: true 
  },

  linkedin: { 
    type: String, 
    trim: true 
  },

  // ----------------------------

  // KYC Documents
  directorPan: { type: DocumentSchema, required: true },
  directorAadhar: { type: OptionalDocumentSchema },
  directorDl: { type: OptionalDocumentSchema },
  directorPassport: { type: OptionalDocumentSchema },

  // Company Logo (required for KYC)
  logo: { type: ImageSchema, required: true },

  // Company Photos (Max 10)
  companyPhotos: { 
    type: [ImageSchema],
    validate: {
      validator: val => val.length <= 10,
      message: "Maximum 10 company photos allowed"
    }
  },

  // Employer Address
  employerAddress: { type: AddressSchema, required: false },

  // Employer Address Proof (required for KYC)
  employerAddressProof: { type: ImageSchema, required: false },

  // Status & Rejection Reason
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  rejectionReason: { type: String, default: null }

}, { timestamps: true });

OrganisationSchema.index({ status: 1 });

export default mongoose.models.Organisation || mongoose.model("Organisation", OrganisationSchema);
