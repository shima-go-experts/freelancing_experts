// import { dbConnect } from "@/app/helper/dbConnect";
// import User from "@app/model/User";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// // --- CORRECT Nodemailer Transporter for Custom SMTP ---
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,          // mail.doorstephub.com
//   port: Number(process.env.EMAIL_PORT),  // 465
//   secure: process.env.EMAIL_SECURE === "true", // true → SSL
//   auth: {
//     user: process.env.EMAIL_USER,        // support@doorstephub.com
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default async function forgotPasswordHandler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   await dbConnect();

//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   const cleanEmail = email.toLowerCase().trim();

//   try {
//     const user = await User.findOne({ email: cleanEmail });

//     // Generic message (security)
//     if (!user) {
//       return res.status(200).json({
//         message:
//           "If an account exists, a password reset link has been sent to your email.",
//       });
//     }

//     // Generate token
//     const rawResetToken = crypto.randomBytes(32).toString("hex");

//     user.resetPasswordToken = rawResetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     // Reset URL
//     const resetURL = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${rawResetToken}&email=${user.email}`;

//     // Send email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Password Reset Request",
//       html: `
//         <p>You requested a password reset.</p>
//         <p>Click below to reset your password:</p>
//         <a href="${resetURL}" style="color:#007bff;">Reset Password</a>
//         <p>This link is valid for 1 hour.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       message:
//         "If an account exists, a password reset link has been sent to your email.",
//     });
//   } catch (error) {
//     console.error("Forgot Password API Error:", error);
//     return res.status(500).json({ error: "Server error occurred" });
//   }
// }
