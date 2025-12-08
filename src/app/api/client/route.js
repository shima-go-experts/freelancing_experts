// // Handles POST request to create a new Client.

// import { NextResponse } from "next/server";
// import connectDB from "@/app/helper/db";
// import Client from "@/app/model/Client";
// import { z } from 'zod';

// // Validation Schema
// const ClientSchema = z.object({
//     name: z.string().min(3, "Name must be at least 3 characters."),
//     email: z.string().email("Invalid email format.").optional(),
//     contactPerson: z.string().min(3, "Contact person name is required."),
//     idType: z.enum(['Passport', 'National ID', 'Driver License']).optional(),
//     idNumber: z.string().optional(),
// });

// export async function POST(req) {
//     await connectDB();

//     try {
//         const body = await req.json();

//         // Validate data
//         const validation = ClientSchema.safeParse(body);
//         if (!validation.success) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Validation failed",
//                     errors: validation.error.issues
//                 },
//                 { status: 422 }
//             );
//         }

//         const client = await Client.create({
//             ...validation.data,
//             kycStatus: "pending",
//         });

//         return NextResponse.json(
//             { success: true, data: client },
//             { status: 201 }
//         );

//     } catch (error) {
//         if (error.code === 11000) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Client already exists (duplicate email or identifier)"
//                 },
//                 { status: 409 }
//             );
//         }

//         console.error("Client Create Error:", error);

//         return NextResponse.json(
//             { success: false, message: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }


// app/api/admin/clients/route.js 


import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import Client from "@/app/model/Client";
import { z } from "zod";
import cloudinary from "@/app/utils/cloudinary";

// ======================= Validation Schema =======================
const ClientValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  contactPerson: z.string().min(3, "Contact person name is required."),
  email: z.string().email("Invalid email format."),
  phone: z.object({
    countryCode: z.string().min(1, "Country code is required."),
    number: z.string().min(5, "Phone number is too short."),
  }),
  country: z.string().min(2, "Country is required."),
  kycDocuments: z
    .array(
      z.object({
        docType: z.string(),
        docUrl: z.string().url("Document URL must be valid"),
      })
    )
    .optional(),
  photo: z.string().optional(), // URL of profile photo
});

// ======================= POST Route =======================
export async function POST(req) {
  await dbConnect();

  try {
    const contentType = req.headers.get("content-type") || "";
    let body = {};

    // ---------- Case 1: JSON ----------
    if (contentType.includes("application/json")) {
      body = await req.json();
    } 
    // ---------- Case 2: Multipart Form Data ----------
    else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      body = {
        name: formData.get("name"),
        contactPerson: formData.get("contactPerson"),
        email: formData.get("email"),
        country: formData.get("country"),
        phone: {
          countryCode: formData.get("phone[countryCode]"),
          number: formData.get("phone[number]"),
        },
        kycDocuments: JSON.parse(formData.get("kycDocuments") || "[]"),
      };

      // Upload photo if exists
      const file = formData.get("photo");
      if (file && typeof file === "object") {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "clients" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

        body.photo = result.secure_url;
      }
    } 
    else {
      return NextResponse.json(
        { success: false, message: "Unsupported content type" },
        { status: 415 }
      );
    }

    // ---------- Validate ----------
    const validation = ClientValidationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        },
        { status: 422 }
      );
    }

    // ---------- Create Client ----------
    const client = await Client.create({
      ...validation.data,
      kycStatus: "pending", // default
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error("Client Create Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Client already exists (duplicate email or identifier)",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ======================= GET Route =======================
export async function GET(req) {
  await dbConnect();

  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: clients }, { status: 200 });
  } catch (error) {
    console.error("Client GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
