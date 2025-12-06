import { NextResponse } from "next/server";
import { dbConnect } from "@/app/helper/dbConnect";
import Freelancer from "@/app/model/Freelancer";

export async function GET(request, context) {
  try {
    await dbConnect();

    const params = await context.params;  // ⬅️ REQUIRED FIX
    const { id } = params;

    console.log("Received ID:", id);

    const freelancer = await Freelancer.findById(id).select(
      "name email phone country skills status kycDocuments createdAt"
    );

    if (!freelancer) {
      return NextResponse.json(
        { message: "Freelancer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: freelancer },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await req.json();

    const { isVerified } = body;

    const updated = await Freelancer.findByIdAndUpdate(
      id,
      {
        isVerified: isVerified,
        status: isVerified ? "active" : "inactive",
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Freelancer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}