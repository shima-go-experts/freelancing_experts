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




// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadFile = async (file, folder) => {
//   if (!file) return { url: null, public_id: null };

//   const buffer = Buffer.from(await file.arrayBuffer());

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         upload_preset: "kyc_unsigned",
//         folder,
//         resource_type: "image",
//         secure: true, // ✅ ensures HTTPS
//       },
//       (error, result) => {
//         if (error) {
//           // Improved error logging
//           reject(new Error(`Cloudinary upload failed for folder "${folder}": ${error.message}`));
//         } else {
//           resolve(result);
//         }
//       }
//     );


    
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };


// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadFile = async (file, folder) => {
//   if (!file) return { url: null, public_id: null };

//   const buffer = Buffer.from(await file.arrayBuffer());

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         upload_preset: "kyc_unsigned",
//         folder,
//         resource_type: "image",
//         secure: true, // ensures HTTPS
//       },
//       (error, result) => {
//         if (error) {
//           reject(new Error(`Cloudinary upload failed for folder "${folder}": ${error.message}`));
//         } else {
//           resolve(result);
//         }
//       }
//     );

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// // ------------------------------
// // DELETE a file from Cloudinary
// // ------------------------------
// export const deleteFile = async (public_id) => {
//   if (!public_id) return null;

//   try {
//     const result = await cloudinary.uploader.destroy(public_id, { resource_type: "image" });
//     return result;
//   } catch (err) {
//     throw new Error(`Cloudinary deletion failed for public_id "${public_id}": ${err.message}`);
//   }
// };

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------------------
// MAIN FILE UPLOAD FUNCTION
// ------------------------------
export const uploadFile = async (file, folder) => {
  if (!file) return { url: null, public_id: null };

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        upload_preset: "kyc_unsigned",
        folder,
        resource_type: "image",
        secure: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ------------------------------
// Upload ONE file (used by POST/PUT)
// ------------------------------
export const uploadSingle = async (file, folder) => {
  if (!file) return null;

  const uploaded = await uploadFile(file, folder);
  return uploaded;
};

// ------------------------------
// Upload FRONT + BACK (used by POST/PUT)
// ------------------------------
export const uploadDouble = async (front, back, folder) => {
  const f = front ? await uploadSingle(front, folder) : null;
  const b = back ? await uploadSingle(back, folder) : null;

  return {
    front: f?.url || null,
    back: b?.url || null,
    front_public_id: f?.public_id || null,
    back_public_id: b?.public_id || null,
  };
};

// ------------------------------
// DELETE FILE (optional)
// ------------------------------
export const deleteFile = async (public_id) => {
  if (!public_id) return null;

  return await cloudinary.uploader.destroy(public_id, {
    resource_type: "image",
  });
};

