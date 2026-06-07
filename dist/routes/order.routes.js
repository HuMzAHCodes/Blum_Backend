import { Router } from "express";
import { handleCheckout, handleGetOrder, handleGetUserOrders } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../schemas/order.schema.js";
const router = Router();
// Secure all order endpoints with authentication
router.use(requireAuth);
router.post("/", validate(createOrderSchema), handleCheckout);
router.get("/", handleGetUserOrders);
router.get("/:id", handleGetOrder);
export default router;
//# sourceMappingURL=order.routes.js.map