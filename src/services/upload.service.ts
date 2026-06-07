import cloudinary from "../lib/cloudinary.js";
import { BadRequestError } from "../lib/errors.js";

// Uploads a multipart memory file buffer directly to Cloudinary
export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  if (!file) {
    throw new BadRequestError("No file provided");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "blum_products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary Upload] Error:", error);
          return reject(new BadRequestError("Image upload to Cloudinary failed"));
        }
        if (!result) {
          return reject(new BadRequestError("Image upload to Cloudinary failed - empty result"));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};
