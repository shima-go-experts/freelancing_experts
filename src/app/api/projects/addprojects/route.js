import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import Project from "@/app/model/Project";

export async function POST(req) {
  try {
    await dbConnect();
    const { clientId, title, description } = await req.json();

    const project = await Project.create({
      clientId,
      title,
      description,
      
      
    });

    return NextResponse.json({ message: "Project added", project });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
