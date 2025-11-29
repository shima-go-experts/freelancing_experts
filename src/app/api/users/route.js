
import { dbConnect } from "@/app/helper/dbConnect";
import User from "@/app/model/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return Response.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error fetching users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const newUser = await User.create(body);

    return Response.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error creating user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}



// import { dbConnect } from "@/app/helper/dbConnect";
// import User from "@/app/model/User";
// import { hash as bcryptHash } from "bcrypt-ts";  // ✔ correct import

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return Response.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return Response.json(
//         { success: false, message: "Email already registered" },
//         { status: 409 }
//       );
//     }

//     // Hash password with bcrypt-ts
//     const hashedPassword = await bcryptHash(password, 10);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     return Response.json(
//       {
//         success: true,
//         message: "User registered successfully",
//         data: newUser,
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     return Response.json(
//       { success: false, message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }
