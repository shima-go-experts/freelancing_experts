// import { dbConnect } from "@/app/helper/dbConnect";
// import Freelancer from "@/app/model/Freelancer";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const body = await request.json();
//     const { name, email, phone, gender, skills, password } = body;

//     // Check if email already exists
//     const exists = await Freelancer.findOne({ email });
//     if (exists) {
//       return Response.json(
//         { message: "Email already registered" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new freelancer
//     const newFreelancer = await Freelancer.create({
//       name,
//       email,
//       phone,
//       gender,
//       skills,
//       password: hashedPassword
//     });

//     return Response.json(
//       { message: "Freelancer registered", data: newFreelancer },
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
// import mongoose from "mongoose";
// import dbConnect from "@/app/helper/dbConnect";
// import FreelancerProfile from "@/app/model/FreelancerProfile";
// import { uploadFile } from "@/app/utils/cloudinary";

// // =========================
// // File upload helpers
// // =========================
// const uploadSingle = async (file, folder) => {
//   if (!file) return null;
//   const upload = await uploadFile(file, folder);
//   return { url: upload.url, public_id: upload.public_id };
// };

// const uploadDouble = async (front, back, folder) => {
//   const f = front ? await uploadSingle(front, folder) : null;
//   const b = back ? await uploadSingle(back, folder) : null;
//   return {
//     front: f?.url || null,
//     back: b?.url || null,
//     front_public_id: f?.public_id || null,
//     back_public_id: b?.public_id || null
//   };
// };

// // =========================
// // CREATE FREELANCER (POST)
// // =========================
// export async function POST(req) {
//   let session;
//   try {
//     await dbConnect();
//     session = await mongoose.startSession();
//     session.startTransaction();

//     const form = await req.formData();

//     // -----------------------------
//     // Basic Fields
//     // -----------------------------
//     const full_name = form.get("full_name");
//     const email = form.get("email");
//     const bio = form.get("bio") || "";
//     const skills = form.get("skills") ? form.get("skills").split(",") : [];
//     const experience_years = Number(form.get("experience_years") || 0);
//     const hourly_rate = Number(form.get("hourly_rate") || 0);
//     const linkedin_url = form.get("linkedin_url") || "";
//     const portfolio_website = form.get("portfolio_website") || "";
//     const full_address = form.get("full_address") || "";

//     // -----------------------------
//     // KYC Numbers (New Fields)
//     // -----------------------------
//     const aadhar_or_passport_number = form.get("aadhar_or_passport_number") || "";
//     const pan_or_dl_number = form.get("pan_or_dl_number") || "";

//     // -----------------------------
//     // Check email logical uniqueness
//     // -----------------------------
//     const exists = await FreelancerProfile.findOne({ email }).session(session);
//     if (exists) {
//       await session.abortTransaction();
//       session.endSession();
//       return NextResponse.json({
//         success: false,
//         message: "Email already registered"
//       }, { status: 409 });
//     }

//     // -----------------------------
//     // Upload Files
//     // -----------------------------
//     const freelancer_photo = await uploadSingle(form.get("freelancer_photo"), "freelancer/photo");

//     const aadhar_or_passport = await uploadDouble(
//       form.get("aadhar_or_passport_front"),
//       form.get("aadhar_or_passport_back"),
//       "freelancer/kyc/aadhar_passport"
//     );

//     const pan_or_dl = await uploadDouble(
//       form.get("pan_or_driving_license_front"),
//       form.get("pan_or_driving_license_back"),
//       "freelancer/kyc/pan_dl"
//     );

//     const selfie_url = await uploadSingle(form.get("selfie_url"), "freelancer/kyc/selfie");

//     // Multiple certificates
//     const experience_certificates = [];
//     for (const key of form.keys()) {
//       if (key.startsWith("experience_certificate")) {
//         const uploaded = await uploadSingle(form.get(key), "freelancer/experience");
//         if (uploaded) experience_certificates.push(uploaded.url);
//       }
//     }

//     // -----------------------------
//     // Validate mandatory uploads
//     // -----------------------------
//     if (
//       !freelancer_photo ||
//       !aadhar_or_passport.front ||
//       !aadhar_or_passport.back ||
//       !pan_or_dl.front ||
//       !pan_or_dl.back ||
//       !selfie_url ||
//       experience_certificates.length === 0
//     ) {
//       await session.abortTransaction();
//       session.endSession();
//       return NextResponse.json({
//         success: false,
//         message: "All KYC documents, selfie, photo, and at least one experience certificate are required"
//       }, { status: 400 });
//     }

//     // -----------------------------
//     // Save Freelancer
//     // -----------------------------
//     const payload = {
//       full_name,
//       email,
//       freelancer_photo: freelancer_photo.url,
//       bio,
//       skills,
//       experience_years,
//       hourly_rate,
//       linkedin_url,
//       portfolio_website,
//       full_address,

//       aadhar_or_passport_number,
//       aadhar_or_passport_front: aadhar_or_passport.front,
//       aadhar_or_passport_back: aadhar_or_passport.back,

//       pan_or_dl_number,
//       pan_or_driving_license_front: pan_or_dl.front,
//       pan_or_driving_license_back: pan_or_dl.back,

//       selfie_url: selfie_url.url,
//       experience_certificates,
//       kyc_status: "Pending"
//     };

//     const freelancer = await FreelancerProfile.create([payload], { session });

//     await session.commitTransaction();
//     session.endSession();

//     return NextResponse.json({
//       success: true,
//       message: "Freelancer registered successfully",
//       data: freelancer[0]
//     }, { status: 201 });

//   } catch (error) {
//     if (session) {
//       await session.abortTransaction();
//       session.endSession();
//     }
//     return NextResponse.json({
//       success: false,
//       message: error.message
//     }, { status: 500 });
//   }
// }

// // =========================
// // GET ALL FREELANCERS
// // =========================
// export async function GET() {
//   try {
//     await dbConnect();
//     const freelancers = await FreelancerProfile.find().sort({ createdAt: -1 });

//     return NextResponse.json(
//       { success: true, data: freelancers },
//       { status: 200 }
//     );

//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import FreelancerProfile from "@/app/model/FreelancerProfile";
import { uploadFile } from "@/app/utils/cloudinary";
import mongoose from "mongoose";

// =========================
// File upload helpers
// =========================
const uploadSingle = async (file, folder) => {
  if (!file) return null;
  const upload = await uploadFile(file, folder);
  return { url: upload.url, public_id: upload.public_id };
};

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

// =========================
// CREATE FREELANCER (POST)
// =========================
export async function POST(req) {
  try {
    await dbConnect();
    const form = await req.formData();

    // -----------------------------
    // BASIC FIELDS
    // -----------------------------
    const full_name = form.get("full_name");
    const email = form.get("email");
    const bio = form.get("bio") || "";
    const skills = form.get("skills") ? form.get("skills").split(",") : [];
    const experience_years = Number(form.get("experience_years") || 0);
    const hourly_rate = Number(form.get("hourly_rate") || 0);
    const linkedin_url = form.get("linkedin_url") || "";
    const portfolio_website = form.get("portfolio_website") || "";
    const full_address = form.get("full_address") || "";

    // -----------------------------
    // REFERENCES (IMPORTANT)
    // -----------------------------
    const User = form.get("User");
    const categories = form.getAll("categories");
    const subcategories = form.getAll("subcategories");

    if (!User || !mongoose.Types.ObjectId.isValid(User)) {
      return NextResponse.json(
        { success: false, message: "Valid user ID is required" },
        { status: 400 }
      );
    }

    if (!categories.length) {
      return NextResponse.json(
        { success: false, message: "At least one category is required" },
        { status: 400 }
      );
    }

    // -----------------------------
    // KYC NUMBERS
    // -----------------------------
    const aadhar_or_passport_number = form.get("aadhar_or_passport_number") || "";
    const pan_or_dl_number = form.get("pan_or_dl_number") || "";

    // -----------------------------
    // EMAIL UNIQUE CHECK
    // -----------------------------
    const exists = await FreelancerProfile.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // -----------------------------
    // FILE UPLOADS
    // -----------------------------
    const freelancer_photo = await uploadSingle(form.get("freelancer_photo"), "freelancer/photo");

    const aadhar_or_passport = await uploadDouble(
      form.get("aadhar_or_passport_front"),
      form.get("aadhar_or_passport_back"),
      "freelancer/kyc/aadhar_passport"
    );

    const pan_or_dl = await uploadDouble(
      form.get("pan_or_driving_license_front"),
      form.get("pan_or_driving_license_back"),
      "freelancer/kyc/pan_dl"
    );

    const selfie = await uploadSingle(form.get("selfie_url"), "freelancer/kyc/selfie");

    // -----------------------------
    // EXPERIENCE CERTIFICATES
    // -----------------------------
    const experience_certificates = [];
    for (const key of form.keys()) {
      if (key.startsWith("experience_certificate")) {
        const uploaded = await uploadSingle(form.get(key), "freelancer/experience");
        if (uploaded) experience_certificates.push(uploaded.url);
      }
    }

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (
      !aadhar_or_passport.front ||
      !aadhar_or_passport.back ||
      !pan_or_dl.front ||
      !pan_or_dl.back ||
      !selfie ||
      experience_certificates.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "All KYC documents, selfie and certificates are required" },
        { status: 400 }
      );
    }

    // -----------------------------
    // SAVE FREELANCER
    // -----------------------------
    const payload = {
      User,
      categories,
      subcategories,

      full_name,
      email,
      freelancer_photo: freelancer_photo?.url || null,
      bio,
      skills,
      experience_years,
      hourly_rate,
      linkedin_url,
      portfolio_website,
      full_address,

      aadhar_or_passport_number,
      aadhar_or_passport_front: aadhar_or_passport.front,
      aadhar_or_passport_back: aadhar_or_passport.back,

      pan_or_dl_number,
      pan_or_driving_license_front: pan_or_dl.front,
      pan_or_driving_license_back: pan_or_dl.back,

      selfie_url: selfie.url,
      experience_certificates,
      kyc_status: "Pending"
    };

    const freelancer = await FreelancerProfile.create(payload);

    return NextResponse.json(
      { success: true, message: "Freelancer registered successfully", data: freelancer },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// =========================
// GET ALL FREELANCERS
// =========================
export async function GET() {
  try {
    await dbConnect();
    const freelancers = await FreelancerProfile.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: freelancers },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}