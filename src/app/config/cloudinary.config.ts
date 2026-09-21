import { v2 as cloudinary} from "cloudinary";
import { envVars } from "./env";

// cloudinary.config({
//     cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
//     api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
//     api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
// });

// DEBUG: confirm config actually loaded
console.log("🔍 Cloudinary Config Check:", {
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET 
        ? `${envVars.CLOUDINARY.CLOUDINARY_API_SECRET.slice(0, 4)}...` 
        : "MISSING",
});

export const cloudinaryUpload = cloudinary;