import { NextResponse } from "next/server";
import dbConnect from "@/app/helper/dbConnect";
import Project from "@/app/model/Project";
import { ProjectValidationSchema } from "@/app/validation/projectValidation";

// ======================= POST ===========================
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    // Validate input
    const validation = ProjectValidationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        },
        { status: 422 }
      );
    }

    const project = await Project.create(validation.data);

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ======================= GET (All Projects + Count) ===========================
export async function GET() {
  await dbConnect();

  try {
    const projects = await Project.find()
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments();

    return NextResponse.json(
      {
        success: true,
        totalProjects: total, // here is the count
        data: projects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Project GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
