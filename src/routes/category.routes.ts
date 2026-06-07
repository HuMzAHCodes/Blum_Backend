import { Router } from "express";
import { getCategories, getCategoryDetail, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema.js";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:idOrSlug", getCategoryDetail);

// Admin-only protected routes
router.post("/", requireAuth, adminOnly, validate(createCategorySchema), createCategory);
router.put("/:id", requireAuth, adminOnly, validate(updateCategorySchema), updateCategory);
router.delete("/:id", requireAuth, adminOnly, deleteCategory);

export default router;
