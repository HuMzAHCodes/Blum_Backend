import { Router } from "express";
import {
  handleCreateReview,
  handleUpdateReview,
  handleDeleteReview,
  handleGetProductReviews,
} from "../controllers/review.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema, updateReviewSchema } from "../schemas/review.schema.js";

const router = Router();

// Public lookup route
router.get("/product/:productId", handleGetProductReviews);

// Secured review modification routes
router.use(requireAuth);

router.post("/", validate(createReviewSchema), handleCreateReview);
router.patch("/:id", validate(updateReviewSchema), handleUpdateReview);
router.delete("/:id", handleDeleteReview);

export default router;
