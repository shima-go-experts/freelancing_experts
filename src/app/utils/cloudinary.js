// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadFile = async (file, folder) => {
//   const buffer = Buffer.from(await file.arrayBuffer());

//   return new Promise((resolve, reject) => {
// const stream = cloudinary.uploader.upload_stream(
//   {
//     upload_preset: "kyc_unsigned",
//     folder,
//     resource_type: "image",
//     secure: true   // ✅ ensures HTTPS
//   },
//   (error, result) => {
//     if (error) reject(error);
//     else resolve(result);
//   }
// );


//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };




import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file, folder) => {
  if (!file) return { url: null, public_id: null };

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        upload_preset: "kyc_unsigned",
        folder,
        resource_type: "image",
        secure: true, // ✅ ensures HTTPS
      },
      (error, result) => {
        if (error) {
          // Improved error logging
          reject(new Error(`Cloudinary upload failed for folder "${folder}": ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
