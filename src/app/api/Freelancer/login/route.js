// import { dbConnect } from "@/app/helper/dbConnect";
// import Freelancer from "@/app/model/Freelancer";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, password } = await request.json();

//     // Check if freelancer exists
//     const freelancer = await Freelancer.findOne({ email });
//     if (!freelancer) {
//       return Response.json(
//         { message: "Freelancer not found" },
//         { status: 404 }
//       );
//     }

//     if (freelancer.status === "blocked") {
//       return Response.json(
//         { message: "Your account has been blocked. Please contact support." },
//         { status: 403 }
//       );
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, freelancer.password);
//     if (!isMatch) {
//       return Response.json(
//         { message: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     return Response.json(
//       {
//         message: "Login successful",
//         freelancer,
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
