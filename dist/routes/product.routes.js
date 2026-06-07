import { Router } from "express";
import { getProducts, getProductDetail, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema, updateProductSchema, getProductsQuerySchema } from "../schemas/product.schema.js";
const router = Router();
// Public routes (with optional auth for admin catalog views)
router.get("/", optionalAuth, validate(getProductsQuerySchema), getProducts);
router.get("/:idOrSlug", getProductDetail);
// Admin-only protected routes
router.post("/", requireAuth, adminOnly, validate(createProductSchema), createProduct);
router.put("/:id", requireAuth, adminOnly, validate(updateProductSchema), updateProduct);
router.delete("/:id", requireAuth, adminOnly, deleteProduct);
export default router;
//# sourceMappingURL=product.routes.js.map