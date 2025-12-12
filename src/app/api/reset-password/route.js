// import { dbConnect } from "@/app/helper/dbConnect";
// import User from "@app/model/User";
// import bcrypt from 'bcryptjs';


// export default async function resetPasswordHandler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   await dbConnect();

//   const { token, email, newPassword } = req.body;

//   if (!token || !email || !newPassword) {
//     return res.status(400).json({
//       error: "Missing token, email, or new password.",
//     });
//   }

//   const cleanEmail = email.toLowerCase().trim();

//   try {
//     // Find user with valid token and non-expired reset window
//     const user = await User.findOne({
//       email: cleanEmail,
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     }).select("+resetPasswordToken +resetPasswordExpires");

//     if (!user) {
//       return res.status(400).json({
//         error:
//           "Password reset link is invalid or has expired. Please request a new link.",
//       });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     user.password = hashedPassword;

//     // Clear reset token fields for security
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     return res.status(200).json({
//       message: "Your password has been successfully updated!",
//     });
//   } catch (error) {
//     console.error("Reset Password API Error:", error);
//     return res.status(500).json({
//       error: "Server error occurred while updating password.",
//     });
//   }
// }
