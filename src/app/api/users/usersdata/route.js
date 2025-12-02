import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import User from "@/app/model/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hashed,
      roles: role
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
