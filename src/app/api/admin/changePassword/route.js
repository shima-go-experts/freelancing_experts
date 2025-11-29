// /app/api/admin/change-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/helper/dbConnect";
import changePass from "@/app/model/changePass"; // your model

export async function POST(req) {
  try {
    await connectDB();

    const { email, oldPassword, newPassword } = await req.json();

    // Find admin in the database
    const admin = await changePass.findOne({ email });
    if (!admin) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    admin.password = hashed;
    admin.changePassword = false; // mark as changed
    await admin.save();

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
