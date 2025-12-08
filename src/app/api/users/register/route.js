
import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import User from "@/app/model/User";
import bcrypt from "bcryptjs";

// ----------------------------------
// POST — Create New User
// ----------------------------------
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      firstName,
      middleName,
      lastName,
      mobileNo,
      AltMobileOrWhatsApp,
      email,
      password,
      role,
    } = body;

    // 🔍 Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // 🔍 Check if mobile number already exists (optional but recommended)
    const mobileExists = await User.findOne({ mobileNo });
    if (mobileExists) {
      return NextResponse.json(
        { success: false, message: "Mobile number already registered" },
        { status: 400 }
      );
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      mobileNo,
      AltMobileOrWhatsApp,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ----------------------------------
// GET — Fetch All Users
// ----------------------------------
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find().select("-password"); // hide password

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        data: users,
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
