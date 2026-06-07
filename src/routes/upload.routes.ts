import { Router } from "express";
import multer from "multer";
import { handleUpload } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { BadRequestError } from "../lib/errors.js";

const router = Router();

// Multer memory storage and restrictions setup
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image file uploads are supported"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum file size
  },
});

router.use(requireAuth);

router.post("/", upload.single("image"), handleUpload);

export default router;
