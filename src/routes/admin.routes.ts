import { Router } from "express";
import {
  handleGetAllOrders,
  handleUpdateOrderStatus,
  handleGetAdminProducts,
  handleGetAnalytics,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { validate } from "../middleware/validate.js";
import { updateOrderStatusSchema } from "../schemas/admin.schema.js";

const router = Router();

// Restrict all endpoints here to verified Admin accounts
router.use(requireAuth, adminOnly);

router.get("/orders", handleGetAllOrders);
router.put("/orders/:id", validate(updateOrderStatusSchema), handleUpdateOrderStatus);
router.get("/products", handleGetAdminProducts);
router.get("/analytics", handleGetAnalytics);

export default router;
