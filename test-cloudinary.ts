import { cloudinaryUpload } from "./src/app/config/cloudinary.config";

cloudinaryUpload.api.ping()
    .then((res) => console.log("✅ Cloudinary connected:", res))
    .catch((err) => console.error("❌ Cloudinary connection failed:", err));