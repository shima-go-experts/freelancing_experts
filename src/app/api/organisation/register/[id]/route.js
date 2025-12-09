// import { NextResponse } from "next/server";
// import dbConnect from "@/app/helper/dbConnect";
// import Organisation from "@/app/model/Organisation";

// export async function GET(req, context) {
//   await dbConnect();

//   try {
//     // ✅ Await params
//     const params = await context.params;
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "Organisation ID is required" },
//         { status: 400 }
//       );
//     }

//     const organisation = await Organisation.findById(id);

//     if (!organisation) {
//       return NextResponse.json(
//         { success: false, message: "Organisation not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: organisation },
//       { status: 200 }
//     );
//   } catch (error) {
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
import { deleteFile } from "@/app/utils/cloudinary"; // Add this import


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

export async function PUT(req, context) {
  let session;
  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Organisation ID is required" },
        { status: 400 }
      );
    }

    const org = await Organisation.findById(id).session(session);
    if (!org) {
      return NextResponse.json(
        { success: false, message: "Organisation not found" },
        { status: 404 }
      );
    }

    const form = await req.formData();

    // Basic fields
    const name = form.get("name") || org.name;
    const businessEmail = form.get("businessEmail") || org.businessEmail;
    const typeOfOrganisation = form.get("typeOfOrganisation") || org.typeOfOrganisation;
    const registrationNumber = form.get("registrationNumber") || org.registrationNumber;

    // Duplicate checks
    const existingEmail = await Organisation.findOne({ businessEmail, _id: { $ne: id } }).session(session);
    if (existingEmail) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({
        success: false,
        message: `Business email "${businessEmail}" already exists.`,
      }, { status: 400 });
    }

    if (registrationNumber) {
      const existingOrg = await Organisation.findOne({ registrationNumber, _id: { $ne: id } }).session(session);
      if (existingOrg) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({
          success: false,
          message: `Registration number "${registrationNumber}" already exists.`,
        }, { status: 400 });
      }
    }

    // Address
    const employerAddress = {
      addressLine1: form.get("addressLine1") || org.employerAddress.addressLine1,
      addressLine2: form.get("addressLine2") || org.employerAddress.addressLine2,
      city: form.get("city") || org.employerAddress.city,
      state: form.get("state") || org.employerAddress.state,
      country: form.get("country") || org.employerAddress.country,
      pincode: form.get("pincode") || org.employerAddress.pincode,
    };

    // KYC uploads
    const directorPan = await uploadDouble(
      form.get("directorPanFront") || org.directorPan.front,
      form.get("directorPanBack") || org.directorPan.back,
      "kyc/director/pan"
    );

    const directorDl = await uploadDouble(
      form.get("directorDlFront") || org.directorDl.front,
      form.get("directorDlBack") || org.directorDl.back,
      "kyc/director/dl"
    );

    const directorAadhar = await uploadDouble(
      form.get("directorAadharFront") || org.directorAadhar.front,
      form.get("directorAadharBack") || org.directorAadhar.back,
      "kyc/director/aadhar"
    );

    const directorPassport = await uploadDouble(
      form.get("directorPassportFront") || org.directorPassport.front,
      form.get("directorPassportBack") || org.directorPassport.back,
      "kyc/director/passport"
    );

    const logo = await uploadSingle(form.get("logo"), "kyc/logo") || org.logo;
    const employerAddressProof = await uploadSingle(form.get("addressProof"), "kyc/addressProof") || org.employerAddressProof;

    // Company photos (replace if any new uploaded)
    const companyPhotos = [...org.companyPhotos];
    for (const key of form.keys()) {
      if (key.startsWith("companyPhoto")) {
        const uploaded = await uploadSingle(form.get(key), "kyc/company/photos");
        companyPhotos.push(uploaded);
      }
    }

    // Update organisation
    org.name = name;
    org.businessEmail = businessEmail;
    org.typeOfOrganisation = typeOfOrganisation;
    org.registrationNumber = registrationNumber;
    org.employerAddress = employerAddress;
    org.directorPan = directorPan;
    org.directorDl = directorDl;
    org.directorAadhar = directorAadhar;
    org.directorPassport = directorPassport;
    org.logo = logo;
    org.employerAddressProof = employerAddressProof;
    org.companyPhotos = companyPhotos;

    await org.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      message: "Organisation updated successfully",
      data: org,
    });

  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req, context) {
  await dbConnect();

  try {
    // ✅ Await params
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Organisation ID is required" },
        { status: 400 }
      );
    }

    const organisation = await Organisation.findById(id);

    if (!organisation) {
      return NextResponse.json(
        { success: false, message: "Organisation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: organisation },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  let session;
  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Organisation ID is required" },
        { status: 400 }
      );
    }

    const org = await Organisation.findById(id).session(session);
    if (!org) {
      return NextResponse.json(
        { success: false, message: "Organisation not found" },
        { status: 404 }
      );
    }

    // Optional: Delete files from Cloudinary
    const filesToDelete = [
      org.logo?.public_id,
      org.employerAddressProof?.public_id,
      org.directorPan?.front_public_id,
      org.directorPan?.back_public_id,
      org.directorDl?.front_public_id,
      org.directorDl?.back_public_id,
      org.directorAadhar?.front_public_id,
      org.directorAadhar?.back_public_id,
      org.directorPassport?.front_public_id,
      org.directorPassport?.back_public_id,
      ...(org.companyPhotos?.map(photo => photo.public_id) || [])
    ].filter(Boolean); // remove nulls

    for (const public_id of filesToDelete) {
      await deleteFile(public_id);
    }

    // Delete organisation
    await Organisation.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      message: "Organisation deleted successfully",
    });

  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}