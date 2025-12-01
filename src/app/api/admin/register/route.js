// import { dbConnect } from "@/app/helper/dbConnect";
// import Admin from "@/app/model/Admin";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, password, role } = await request.json();

//     // Check if email exists
//     const exists = await Admin.findOne({ email });
//     if (exists) {
//       return Response.json(
//         { message: "Admin already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create admin
//     const newAdmin = await Admin.create({
//       email,
//       password: hashedPassword,
//       role: role || "admin",
//     });

//     return Response.json(
//       { message: "Admin registered", data: newAdmin },
//       { status: 201 }
//     );
//   } catch (error) {
//     return Response.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { dbConnect } from "@/app/helper/dbConnect";
import Admin from "@/app/model/Admin";
import bcrypt from "bcryptjs";

// Global CORS headers for this API route
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password, role } = await request.json();

    // Check if email exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return Response.json(
        { message: "Admin already exists" },
        { status: 400, headers: CORS_HEADERS } // ADDED CORS HEADERS HERE
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    return Response.json(
      { message: "Admin registered", data: newAdmin },
      { status: 201, headers: CORS_HEADERS } // ADDED CORS HEADERS HERE
    );
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500, headers: CORS_HEADERS } // ADDED CORS HEADERS HERE
    );
  }
}