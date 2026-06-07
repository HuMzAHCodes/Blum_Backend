import { Router } from "express";
import { getWishlist, addItem, removeItem } from "../controllers/wishlist.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Apply requireAuth middleware globally for all wishlist routes
router.use(requireAuth);

router.get("/", getWishlist);
router.post("/", addItem);
router.delete("/:productId", removeItem);

export default router;
