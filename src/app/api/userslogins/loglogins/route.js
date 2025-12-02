import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import LoginLog from "@/app/model/LoginLog";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    const log = await LoginLog.create({ userId });

    return NextResponse.json({ message: "Login logged", log });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
