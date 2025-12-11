import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/app/helper/dbConnect";
import OTP from "@/app/model/OTP";
import Emailuser from "@/app/model/emailuser";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Email & OTP are required" }, { status: 400 });
    }

    // Trim input OTP
    const trimmedOTP = otp.trim();

    // Find latest OTP for this email
    const existingOTP = await OTP.findOne({ email });
    if (!existingOTP) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Hash entered OTP
    const hashedOTP = crypto.createHash("sha256").update(trimmedOTP).digest("hex");

    // Compare with stored hash
    if (existingOTP.otp !== hashedOTP) {
      existingOTP.attempts += 1; // optional: track failed attempts
      await existingOTP.save();

      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    // OTP is correct → mark email as verified / create user if not exists
    const user = await Emailuser.findOneAndUpdate(
      { email },
      { emailVerified: true },
      { upsert: true, new: true }
    );

    // Delete OTP after successful verification
    await OTP.deleteMany({ email });

    return NextResponse.json({ success: true, message: "OTP verified successfully", user });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error verifying OTP", error }, { status: 500 });
  }
}
