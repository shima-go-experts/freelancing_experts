// import { NextResponse } from "next/server";
// import dbConnect from "@/app/helper/dbConnect";
// import Project from "@/app/model/Project";
// import { ProjectValidationSchema } from "@/app/validation/projectValidation";

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const body = await req.json();

//     // ✅ Zod validation
//     const parsedData = ProjectValidationSchema.parse(body);

//     // Insert project
//     const project = await Project.create(parsedData);

//     return NextResponse.json(
//       { success: true, data: project },
//       { status: 201 }
//     );

//   } catch (err) {
//     console.error("Project POST Error:", err);

//     // ❗ Zod validation error handling
//     if (err.name === "ZodError") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation Failed",
//           errors: err.errors,
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Internal Server Error", error: err.message },
//       { status: 500 }
//     );
//   }
// }
// export async function GET() {
//   await dbConnect();

//   try {
//     const projects = await Project.find({
//       isVerified: true,               // ✔ Only verified projects
//       status: { $ne: "cancelled" }    // ✔ Exclude cancelled
//     })
//       .populate("clientId", "name email")           // ✔ From schema
//       .populate("organizationId", "name email")     // ✔ From schema
//       .populate("freelancerId", "name email")       // ✔ From schema
//       .sort({ createdAt: -1 });                     // ✔ Latest first

//     return NextResponse.json(
//       { success: true, data: projects },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("Project GET Error:", err);

//     return NextResponse.json(
//       { success: false, message: "Internal Server Error", error: err.message },
//       { status: 500 }
//     );
//   }
// }
