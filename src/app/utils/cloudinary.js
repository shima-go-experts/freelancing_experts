// app/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., "mycloudname"
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g., "123456789012345"
  api_secret: process.env.CLOUDINARY_API_SECRET, // e.g., "abcdefg123456"
  secure: true,                                  // always use HTTPS URLs
});

export default cloudinary;
