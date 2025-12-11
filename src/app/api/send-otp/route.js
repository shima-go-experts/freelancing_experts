import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dbConnect from "@/app/helper/dbConnect";
import OTP from "@/app/model/OTP";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Remove any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save hashed OTP
    await OTP.create({
      email,
      otp: hashedOTP,
    });

    // SMTP Transporter (YOUR SERVER)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,      // mail.doorstephub.com
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,    // support@doorstephub.com
        pass: process.env.EMAIL_PASS,    // SMTP password
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"DoorstepHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error sending OTP", error },
      { status: 500 }
    );
  }
}
