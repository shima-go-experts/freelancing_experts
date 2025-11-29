// import { dbConnect } from "@/app/helper/dbConnect";
// import Admin from "@/app/model/Admin";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, password } = await request.json();

//     // Find admin
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return Response.json(
//         { message: "Admin not found" },
//         { status: 404 }
//       );
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return Response.json(
//         { message: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     return Response.json(
//       { message: "Login successful", admin },
//       { status: 200 }
//     );
//   } catch (error) {
//     return Response.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }



// import { dbConnect } from "@/app/helper/dbConnect";
// import Admin from "@/app/model/Admin";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, password } = await request.json();

//     // Find admin
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return Response.json(
//         { message: "Admin not found" },
//         { status: 404 }
//       );
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return Response.json(
//         { message: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: admin._id,
//         email: admin.email,
//         role: "admin"
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return Response.json(
//       {
//         message: "Login successful",
//         token,
//         admin
//       },
//       { status: 200 }
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
import jwt from "jsonwebtoken";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // ❗ change later for production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Admin not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: "Incorrect password" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        admin,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Server error",
        error: error.message,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

