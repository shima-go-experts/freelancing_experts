import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/helper/dbConnect";
import Admin from "@/app/model/Admin";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, oldPassword, newPassword } = await req.json();

    // Validate request body
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Email, old password, and new password are required" },
        { status: 400 } // Bad Request
      );
    }

    // Find admin in the database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 } // Not Found
      );
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 401 } // Unauthorized
      );
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update admin password
    admin.password = hashed;
    await admin.save();

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 } // Internal Server Error
    );
  }
}
