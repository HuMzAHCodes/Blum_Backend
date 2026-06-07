import { uploadImage } from "../services/upload.service.js";
import { BadRequestError } from "../lib/errors.js";
// Handles image upload request and returns the resulting asset url
export const handleUpload = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            throw new BadRequestError("No image file provided in multipart request");
        }
        const imageUrl = await uploadImage(file);
        res.status(201).json({
            status: "success",
            message: "Image uploaded successfully",
            data: {
                url: imageUrl,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=upload.controller.js.map