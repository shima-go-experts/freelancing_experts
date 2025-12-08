// import { dbConnect } from "@/app/helper/dbConnect";
// import Organisation from "@/app/model/Organisation";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { registrationNumber, name, email, phone, password } =
//       await request.json();

//     // Check if email or registration number already exists
//     const exists = await Organisation.findOne({
//       $or: [{ email }, { registrationNumber }],
//     });

//     if (exists) {
//       return Response.json(
//         { message: "Organisation already registered" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create organisation
//     const newOrg = await Organisation.create({
//       registrationNumber,
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//     });

//     return Response.json(
//       { message: "Organisation registered", data: newOrg },
//       { status: 201 }
//     );
//   } catch (error) {
//     return Response.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { uploadBufferToCloudinary } from "@/utils/uploadToCloudinary";
// import { upload } from "@/utils/multer";
// import Organisation from "@/app/model/Organisation";
// import dbConnect from "@/app/helper/dbConnect";
// import bcrypt from "bcryptjs";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Middleware wrapper for multer
// function runMiddleware(req, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, {}, (result) => {
//       if (result instanceof Error) return reject(result);
//       return resolve(result);
//     });
//   });
// }

// export async function POST(req) {
//   try {
//     await dbConnect();

//     // Accept logo, 10 photos, and KYC documents
//     await runMiddleware(
//       req,
//       upload.fields([
//         { name: "logo", maxCount: 1 },
//         { name: "organizationPhotos", maxCount: 10 },
//         { name: "kycDocuments", maxCount: 10 } // NEW
//       ])
//     );

//     const formData = req.body;
//     const files = req.files;

//     const {
//       registrationNumber,
//       name,
//       email,
//       companyLandlineNo,
//       password,
//       officeWebsiteLink,
//       linkedinLink,
//       kycStatus, // NEW
//       kycTypes // CSV List (ex: "GST,Pan,Udyam") → frontend will send this
//     } = formData;

//     // ------------------------------------------
//     // Validate duplicate email
//     // ------------------------------------------
//     const exists = await Organisation.findOne({ email });
//     if (exists) {
//       return NextResponse.json(
//         { success: false, message: "Email already registered" },
//         { status: 400 }
//       );
//     }

//     // ------------------------------------------
//     // Hash password
//     // ------------------------------------------
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ------------------------------------------
//     // Upload Logo
//     // ------------------------------------------
//     let logoData = {};
//     if (files?.logo?.length > 0) {
//       const uploadedLogo = await uploadBufferToCloudinary(
//         files.logo[0].buffer,
//         "organisation/logo"
//       );

//       logoData = {
//         url: uploadedLogo.secure_url,
//         public_id: uploadedLogo.public_id,
//       };
//     }

//     // ------------------------------------------
//     // Upload Multiple Organization Photos
//     // ------------------------------------------
//     let orgPhotos = [];

//     if (files?.organizationPhotos?.length > 0) {
//       for (const photo of files.organizationPhotos) {
//         const uploadedPhoto = await uploadBufferToCloudinary(
//           photo.buffer,
//           "organisation/photos"
//         );

//         orgPhotos.push({
//           url: uploadedPhoto.secure_url,
//           public_id: uploadedPhoto.public_id,
//           uploadedAt: new Date(),
//         });
//       }
//     }

//     // ------------------------------------------
//     // Upload KYC DOCUMENTS
//     // ------------------------------------------
//     let kycDocs = [];

//     if (files?.kycDocuments?.length > 0) {
//       const kycTypesArray = kycTypes?.split(",") || [];

//       for (let i = 0; i < files.kycDocuments.length; i++) {
//         const doc = files.kycDocuments[i];

//         const uploadedDoc = await uploadBufferToCloudinary(
//           doc.buffer,
//           "organisation/kyc"
//         );

//         kycDocs.push({
//           type: kycTypesArray[i] || "Document",
//           url: uploadedDoc.secure_url,
//           public_id: uploadedDoc.public_id,
//           uploadedAt: new Date(),
//         });
//       }
//     }

//     // ------------------------------------------
//     // CREATE ORGANISATION ENTRY
//     // ------------------------------------------
//     const newOrg = await Organisation.create({
//       registrationNumber,
//       name,
//       email,
//       companyLandlineNo,
//       password: hashedPassword,
//       logo: logoData,
//       officeWebsiteLink,
//       linkedinLink,
//       organizationPhotos: orgPhotos,

//       // NEW
//       kyc: {
//         status: kycStatus || "pending",
//         documents: kycDocs,
//         verifiedAt: null,
//       },

//       // NEW
//       isVerified: false,
//       status: "inactive",
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Organisation registered successfully",
//         data: newOrg,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


