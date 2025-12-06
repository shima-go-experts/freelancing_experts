import { NextResponse } from "next/server";
import { dbConnect } from "@/app/helper/dbConnect";
import Freelancer from "@/app/model/Freelancer";
import bcrypt from "bcryptjs";

// GET all freelancers
export async function GET() {
  try {
    await dbConnect();

    const freelancers = await Freelancer.find().select(
      "name email phone gender country skills status isVerified createdAt"
    );

    return NextResponse.json(
      { success: true, data: freelancers },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
