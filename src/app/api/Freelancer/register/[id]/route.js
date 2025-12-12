import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/helper/dbConnect";
import { uploadFile } from "@/app/utils/cloudinary";
import FreelancerProfile from "@/app/model/FreelancerProfile";

// ------------------------------
// Helper: upload single file
// ------------------------------
const uploadSingle = async (file, folder) => {
  if (!file) return null;
  const uploaded = await uploadFile(file, folder);
  return uploaded ? { url: uploaded.url, public_id: uploaded.public_id } : null;
};

// ------------------------------
// Helper: upload front + back
// ------------------------------
const uploadDouble = async (front, back, folder) => {
  const f = front ? await uploadSingle(front, folder) : null;
  const b = back ? await uploadSingle(back, folder) : null;

  return {
    front: f?.url || null,
    back: b?.url || null,
    front_public_id: f?.public_id || null,
    back_public_id: b?.public_id || null,
  };
};

// =========================
// UPDATE FREELANCER (PUT)
// =========================
export async function PUT(req, context) {
  let session;

  try {
    await dbConnect();

    const { id } = await context.params; // ✅ IMPORTANT

    session = await mongoose.startSession();
    session.startTransaction();

    const form = await req.formData();

    const existing = await FreelancerProfile.findById(id).session(session);

    if (!existing) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Basic fields
    const payload = {
      full_name: form.get("full_name") || existing.full_name,
      email: form.get("email") || existing.email,
      bio: form.get("bio") ?? existing.bio,
      skills: form.get("skills")
        ? form.get("skills").split(",")
        : existing.skills,

      experience_years: form.get("experience_years")
        ? Number(form.get("experience_years"))
        : existing.experience_years,

      hourly_rate: form.get("hourly_rate")
        ? Number(form.get("hourly_rate"))
        : existing.hourly_rate,

      linkedin_url: form.get("linkedin_url") || existing.linkedin_url,
      portfolio_website: form.get("portfolio_website") || existing.portfolio_website,
      full_address: form.get("full_address") || existing.full_address,

      aadhar_or_passport_number:
        form.get("aadhar_or_passport_number") || existing.aadhar_or_passport_number,

      pan_or_dl_number:
        form.get("pan_or_dl_number") || existing.pan_or_dl_number,
    };

    // File uploads
    // const freelancer_photo = await uploadSingle(
    //   form.get("freelancer_photo"),
    //   "freelancer/photo"
    // );

    // if (freelancer_photo) {
    //   payload.freelancer_photo = freelancer_photo.url;
    // }

    const aadhar = await uploadDouble(
      form.get("aadhar_or_passport_front"),
      form.get("aadhar_or_passport_back"),
      "freelancer/kyc/aadhar_passport"
    );

    if (aadhar.front) payload.aadhar_or_passport_front = aadhar.front;
    if (aadhar.back) payload.aadhar_or_passport_back = aadhar.back;

    const pan_dl = await uploadDouble(
      form.get("pan_or_driving_license_front"),
      form.get("pan_or_driving_license_back"),
      "freelancer/kyc/pan_dl"
    );

    if (pan_dl.front) payload.pan_or_driving_license_front = pan_dl.front;
    if (pan_dl.back) payload.pan_or_driving_license_back = pan_dl.back;

    const selfie = await uploadSingle(form.get("selfie_url"), "freelancer/kyc/selfie");
    if (selfie) payload.selfie_url = selfie.url;

    // Experience certificates
    const certs = [...existing.experience_certificates];
    for (const key of form.keys()) {
      if (key.startsWith("experience_certificate")) {
        const uploaded = await uploadSingle(form.get(key), "freelancer/experience");
        if (uploaded) certs.push(uploaded.url);
      }
    }

    payload.experience_certificates = certs;

    const updated = await FreelancerProfile.findByIdAndUpdate(id, payload, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { success: true, message: "Freelancer updated", data: updated },
      { status: 200 }
    );

  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// =========================
// DELETE FREELANCER
// =========================
export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;
    
    console.log("Incoming ID:", id);

const exists = await FreelancerProfile.findById(id);
console.log("Found in DB:", exists ? true : false);

console.log("DB URL:", process.env.MONGODB_URI);
console.log("Collection Name:", FreelancerProfile.collection.collectionName);


    const deleted = await FreelancerProfile.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Freelancer deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// =========================
// GET SINGLE FREELANCER
// =========================
export async function GET(req, context) {
  try {

    await dbConnect();

   const { id } = await context.params;

    const freelancer = await FreelancerProfile.findById(id);

    if (!freelancer) {
      return NextResponse.json(
        { success: false, message: "Freelancer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: freelancer },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
