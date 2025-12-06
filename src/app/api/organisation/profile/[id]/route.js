import { NextResponse } from "next/server";
import { dbConnect } from "@/app/helper/dbConnect";
import Organisation from "@/app/model/Organisation";

// ======================================================
// GET SINGLE ORGANIZATION
// ======================================================
export async function GET(request, context) {
  try {
    await dbConnect();

    const params = await context.params;   // ✅ FIX
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const organisation = await Organisation.findById(id).select("-password");

    if (!organisation) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: organisation },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT UPDATE ORGANIZATION
// ======================================================
export async function PUT(request, context) {
  try {
    await dbConnect();

    const params = await context.params;   // ✅ FIX
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData = {};

    // BASIC
    if (body.registrationNumber) updateData.registrationNumber = body.registrationNumber;
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;

    // PASSWORD
    if (body.password) updateData.password = body.password;

    // ADDRESS
    if (body.address) {
      updateData.address = {
        street: body.address.street || "",
        city: body.address.city || "",
        state: body.address.state || "",
        zip: body.address.zip || "",
        country: body.address.country || "",
      };
    }

    // CONTACT PERSON
    if (body.contactPerson) {
      updateData.contactPerson = {
        name: body.contactPerson.name || "",
        email: body.contactPerson.email || "",
        phone: body.contactPerson.phone || "",
      };
    }

    // KYC
    if (body.kyc) {
      updateData.kyc = {
        status: body.kyc.status || "pending",
        verifiedAt: body.kyc.status === "verified" ? new Date() : null,
        documents: body.kyc.documents || [],
      };

      // Auto-update status flags
      if (body.kyc.status === "verified") {
        updateData.status = "active";
        updateData.isVerified = true;
      } else if (body.kyc.status === "rejected") {
        updateData.status = "inactive";
        updateData.isVerified = false;
      }
    }

    // FLAGS
    if (typeof body.isVerified === "boolean") updateData.isVerified = body.isVerified;
    if (body.status) updateData.status = body.status;

    // UPDATE
    const updatedOrg = await Organisation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedOrg) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Organization updated successfully",
        data: updatedOrg,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
