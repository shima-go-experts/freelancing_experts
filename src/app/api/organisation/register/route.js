// import { NextResponse } from "next/server";
// import dbConnect from "@/app/helper/dbConnect";
// import OrganisationKyc from "@/app/model/OrganisationKyc";
// import Organisation from "@/app/model/Organisation";
// import { uploadFile } from "@/app/utils/cloudinary";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // -------------------------------
// // Helper: Upload single image
// // -------------------------------
// const uploadSingle = async (file, folder) => {
//   if (!file) return { url: null, public_id: null };
//   const upload = await uploadFile(file, folder);
//   return { url: upload.url, public_id: upload.public_id };
// };

// // -------------------------------
// // Helper: Upload front + back
// // -------------------------------
// const uploadDouble = async (frontFile, backFile, folder) => {
//   const front = await uploadSingle(frontFile, folder);
//   const back = await uploadSingle(backFile, folder);

//   return {
//     front: front.url,
//     back: back.url,
//     front_public_id: front.public_id,
//     back_public_id: back.public_id,
//   };
// };

// // ---------------------------------------------------
// // MAIN KYC SUBMISSION / UPDATE ROUTE
// // ---------------------------------------------------
// export async function POST(req) {
//   try {
//     await dbConnect();

//     const formData = await req.formData();

//     // ------------------------------
//     // BASIC ORGANISATION INFO
//     // ------------------------------
//     const typeOfOrganisation = formData.get("typeOfOrganisation");
//     const businessEmail = formData.get("businessEmail");
//     const registrationNumber = formData.get("registrationNumber") || null;
//     const status = formData.get("status") || "pending";
//     const rejectionReason = formData.get("rejectionReason") || null;

//     // Employer Address
//     const employerAddress = {
//       addressLine1: formData.get("addressLine1"),
//       addressLine2: formData.get("addressLine2") || "",
//       city: formData.get("city"),
//       state: formData.get("state"),
//       country: formData.get("country"),
//       pincode: formData.get("pincode"),
//     };

//     // ------------------------------
//     // CREATE ORGANISATION FIRST
//     // ------------------------------
//     const organisation = await Organisation.create({
//       typeOfOrganisation,
//       businessEmail,
//       registrationNumber,
//       employerAddress,
//       kycStatus: "submitted",
//     });

//     const organisationId = organisation._id; // NEW ID GENERATED

//     // --------------------------------
//     // KYC NUMBERS
//     // --------------------------------
//     const directorPanNumber = formData.get("directorPanNumber") || null;
//     const directorDlNumber = formData.get("directorDlNumber") || null;
//     const directorAadharNumber = formData.get("directorAadharNumber") || null;
//     const directorPassportNumber = formData.get("directorPassportNumber") || null;

//     // --------------------------------
//     // REQUIRED PAN UPLOAD
//     // --------------------------------
//     const directorPanFront = formData.get("directorPanFront");
//     const directorPanBack = formData.get("directorPanBack");

//     if (!directorPanFront || !directorPanBack) {
//       return NextResponse.json(
//         { success: false, message: "Director PAN (front & back) required" },
//         { status: 400 }
//       );
//     }

//     // --------------------------------
//     // OPTIONAL FILES
//     // --------------------------------
//     const directorDlFront = formData.get("directorDlFront");
//     const directorDlBack = formData.get("directorDlBack");

//     const directorAadharFront = formData.get("directorAadharFront");
//     const directorAadharBack = formData.get("directorAadharBack");

//     const directorPassportFront = formData.get("directorPassportFront");
//     const directorPassportBack = formData.get("directorPassportBack");

//     const logoFile = formData.get("logo");
//     const addressProofFile = formData.get("addressProof");

//     // --------------------------------
//     // COMPANY PHOTOS (MAX 10)
//     // --------------------------------
//     const companyPhotos = [];
//     for (let i = 0; i < 10; i++) {
//       const photo = formData.get(`companyPhoto${i}`);
//       if (photo && typeof photo === "object") {
//         const uploaded = await uploadSingle(photo, "kyc/company/photos");
//         companyPhotos.push({
//           url: uploaded.url,
//           public_id: uploaded.public_id,
//           uploadedAt: new Date(),
//         });
//       }
//     }

//     // --------------------------------
//     // UPLOAD ALL DOCUMENTS
//     // --------------------------------
//     const directorPan = await uploadDouble(
//       directorPanFront,
//       directorPanBack,
//       "kyc/director/pan"
//     );

//     const directorDl =
//       directorDlFront && directorDlBack
//         ? await uploadDouble(directorDlFront, directorDlBack, "kyc/director/dl")
//         : { front: null, back: null, front_public_id: null, back_public_id: null };

//     const directorAadhar =
//       directorAadharFront && directorAadharBack
//         ? await uploadDouble(
//             directorAadharFront,
//             directorAadharBack,
//             "kyc/director/aadhar"
//           )
//         : { front: null, back: null, front_public_id: null, back_public_id: null };

//     const directorPassport =
//       directorPassportFront && directorPassportBack
//         ? await uploadDouble(
//             directorPassportFront,
//             directorPassportBack,
//             "kyc/director/passport"
//           )
//         : { front: null, back: null, front_public_id: null, back_public_id: null };

//     const logo =
//       logoFile && typeof logoFile === "object"
//         ? await uploadSingle(logoFile, "kyc/logo")
//         : null;

//     const employerAddressProof =
//       addressProofFile && typeof addressProofFile === "object"
//         ? await uploadSingle(addressProofFile, "kyc/addressProof")
//         : null;

//     // --------------------------------
//     // SAVE KYC DETAILS INTO KYC TABLE
//     // --------------------------------
//     const kycPayload = {
//       // organisationId,
//       typeOfOrganisation,
//       businessEmail,
//       registrationNumber,
//       employerAddress,
//       directorPan: { ...directorPan, number: directorPanNumber },
//       directorDl: { ...directorDl, number: directorDlNumber },
//       directorAadhar: { ...directorAadhar, number: directorAadharNumber },
//       directorPassport: { ...directorPassport, number: directorPassportNumber },
//       logo,
//       companyPhotos,
//       employerAddressProof,
//       status,
//       rejectionReason,
//     };

//     const kycRecord = await OrganisationKyc.create(kycPayload);

//     // --------------------------------
//     // RESPONSE
//     // --------------------------------
//     return NextResponse.json({
//       success: true,
//       message: "Organisation registered + KYC submitted successfully",
//       data: {
//         organisation,
//         kyc: kycRecord,
//       },
//     });
//   } catch (error) {
//     console.error("KYC Registration Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/helper/dbConnect";
import Organisation from "@/app/model/Organisation";
import { uploadFile } from "@/app/utils/cloudinary";

// Upload single file
const uploadSingle = async (file, folder) => {
  if (!file) return null;
  const upload = await uploadFile(file, folder);
  return { url: upload.url, public_id: upload.public_id };
};

// Upload front + back
const uploadDouble = async (front, back, folder) => {
  const f = front ? await uploadSingle(front, folder) : null;
  const b = back ? await uploadSingle(back, folder) : null;

  return {
    front: f?.url || null,
    back: b?.url || null,
    front_public_id: f?.public_id || null,
    back_public_id: b?.public_id || null
  };
};

export async function POST(req) {
  let session;
  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    const form = await req.formData();


    

    // Basic organisation fields
     const name = form.get("name");
    const businessEmail = form.get("businessEmail");

// Duplicate email check
const existingEmail = await Organisation.findOne({ businessEmail }).session(session);
if (existingEmail) {
  await session.abortTransaction();
  session.endSession();
  return NextResponse.json({
    success: false,
    message: `Business email "${businessEmail}" already exists.`,
  }, { status: 400 });
}



    const typeOfOrganisation = form.get("typeOfOrganisation");
    const registrationNumber = form.get("registrationNumber") || null;

    // Check if registrationNumber already exists
if (registrationNumber) {
  const existingOrg = await Organisation.findOne({ registrationNumber }).session(session);
  if (existingOrg) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({
      success: false,
      message: `Registration number "${registrationNumber}" already exists.`,
    }, { status: 400 });
  }
}


    // Required checks
    if (!name || !businessEmail || !typeOfOrganisation) {
      return NextResponse.json(
        { success: false, message: "Name, businessEmail & typeOfOrganisation are required." },
        { status: 400 }
      );
    }

    // Address
    const employerAddress = {
      addressLine1: form.get("addressLine1"),
      addressLine2: form.get("addressLine2") || "",
      city: form.get("city"),
      state: form.get("state"),
      country: form.get("country"),
      pincode: form.get("pincode"),
    };

    // Mandatory uploads
    const directorPan = await uploadDouble(
      form.get("directorPanFront"),
      form.get("directorPanBack"),
      "kyc/director/pan"
    );

    const logo = await uploadSingle(form.get("logo"), "kyc/logo");
    const employerAddressProof = await uploadSingle(form.get("addressProof"), "kyc/addressProof");

    if (!directorPan.front || !directorPan.back) {
      return NextResponse.json(
        { success: false, message: "Director PAN front & back required" },
        { status: 400 }
      );
    }

    if (!logo) {
      return NextResponse.json(
        { success: false, message: "Company logo required" },
        { status: 400 }
      );
    }

    if (!employerAddressProof) {
      return NextResponse.json(
        { success: false, message: "Employer address proof required" },
        { status: 400 }
      );
    }

    // Optional docs
    const directorDl = await uploadDouble(
      form.get("directorDlFront"),
      form.get("directorDlBack"),
      "kyc/director/dl"
    );

    const directorAadhar = await uploadDouble(
      form.get("directorAadharFront"),
      form.get("directorAadharBack"),
      "kyc/director/aadhar"
    );

    const directorPassport = await uploadDouble(
      form.get("directorPassportFront"),
      form.get("directorPassportBack"),
      "kyc/director/passport"
    );

    // Company photos
    const companyPhotos = [];
    for (const key of form.keys()) {
      if (key.startsWith("companyPhoto")) {
        const uploaded = await uploadSingle(form.get(key), "kyc/company/photos");
        companyPhotos.push(uploaded);
      }
    }

    // Final payload saved into Organisation
    const payload = {
      name,
      businessEmail,
      typeOfOrganisation,
      registrationNumber,
      employerAddress,
      directorPan,
      directorDl,
      directorAadhar,
      directorPassport,
      logo,
      employerAddressProof,
      companyPhotos,
      status: "pending",
      rejectionReason: null
    };

    const org = await Organisation.create([payload], { session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      message: "Organisation KYC submitted successfully",
      data: org[0],
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const organisations = await Organisation.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "All organisations fetched successfully",
      data: organisations,
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}