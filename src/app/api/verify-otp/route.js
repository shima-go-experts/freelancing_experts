// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import dbConnect from "@/app/helper/dbConnect";
// import OTP from "@/app/model/OTP";
// import Emailuser from "@/app/model/emailuser";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { email, otp } = await req.json();

//     if (!email || !otp) {
//       return NextResponse.json(
//         { success: false, message: "Email & OTP are required" },
//         { status: 400 }
//       );
//     }

//     // Make sure OTP is always string
//     const trimmedOTP = otp.toString().trim();

//     // Always fetch the most recent OTP
//     const existingOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

//     if (!existingOTP) {
//       return NextResponse.json(
//         { success: false, message: "Invalid or expired OTP" },
//         { status: 400 }
//       );
//     }

//     // Hash user-entered OTP
//     const hashedOTP = crypto
//       .createHash("sha256")
//       .update(trimmedOTP)
//       .digest("hex");

//     // Compare hashes
//     if (existingOTP.otp !== hashedOTP) {
//       existingOTP.attempts += 1;
//       await existingOTP.save();

//       return NextResponse.json(
//         { success: false, message: "Invalid OTP" },
//         { status: 400 }
//       );
//     }

//     // Mark email verified
//     const user = await Emailuser.findOneAndUpdate(
//       { email },
//       { emailVerified: true },
//       { upsert: true, new: true }
//     );

//     // Delete OTP after success
//     await OTP.deleteMany({ email });

//     return NextResponse.json({
//       success: true,
//       message: "OTP verified successfully",
//       user,
//     });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Error verifying OTP", error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/app/helper/dbConnect";
import OTP from "@/app/model/OTP";
import Emailuser from "@/app/model/emailuser";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    console.log("====================================");
    console.log("👉 VERIFY OTP REQUEST RECEIVED");
    console.log("👉 Email received:", email);
    console.log("👉 OTP received (raw):", otp);

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email & OTP are required" },
        { status: 400 }
      );
    }

    const trimmedOTP = otp.toString().trim();
    console.log("👉 OTP trimmed:", trimmedOTP);

    const existingOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
    console.log("👉 OTP found in DB:", existingOTP);

    if (!existingOTP) {
      console.log("❌ No OTP found in DB");
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(trimmedOTP)
      .digest("hex");

    console.log("👉 Hashed user OTP:", hashedOTP);
    console.log("👉 Hashed stored OTP:", existingOTP.otp);

    if (existingOTP.otp !== hashedOTP) {
      console.log("❌ OTP mismatch");
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    console.log("✅ OTP MATCHED SUCCESSFULLY");

    const user = await Emailuser.findOneAndUpdate(
      { email },
      { emailVerified: true },
      { upsert: true, new: true }
    );

    await OTP.deleteMany({ email });

    console.log("👉 OTP deleted and user verified");

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      user,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying OTP", error: error.message },
      { status: 500 }
    );
  }
}

//