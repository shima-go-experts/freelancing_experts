import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import Client from "@/app/model/Client";
import { z } from "zod";
import cloudinary from "@/app/utils/cloudinary";

// Validation schema
const ClientValidationSchema = z.object({
  name: z.string().min(3),
  contactPerson: z.string().min(3),
  email: z.string().email(),
  phone: z.object({
    countryCode: z.string().min(1),
    number: z.string().min(5),
  }),
  country: z.string().min(2),
  kycDocuments: z.array(
    z.object({
      docType: z.string(),
      docUrl: z.string().url(),
    })
  ).optional(),
  photo: z.string().optional(),
});

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    // Await params in App Router
    const { id: clientId } = await params;

    if (!clientId) {
      return NextResponse.json({ success: false, message: "Client ID is required" }, { status: 400 });
    }

    const contentType = req.headers.get("content-type") || "";
    let body = {};

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
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

      const file = formData.get("photo");
      if (file && typeof file === "object") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: "clients" }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
          stream.end(buffer);
        });
        body.photo = result.secure_url;
      }
    } else {
      return NextResponse.json({ success: false, message: "Unsupported content type" }, { status: 415 });
    }

    const validation = ClientValidationSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Validation failed", errors: validation.error.issues }, { status: 422 });
    }

    const updatedClient = await Client.findByIdAndUpdate(clientId, { $set: validation.data }, { new: true, runValidators: true });

    if (!updatedClient) {
      return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedClient }, { status: 200 });
  } catch (error) {
    console.error("Client Update Error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Duplicate field value detected" }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
