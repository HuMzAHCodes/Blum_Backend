import { Router } from "express";
import { getCart, addItem, updateQuantity, removeItem, clearCart } from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
// Apply requireAuth middleware globally for all cart routes
router.use(requireAuth);
router.get("/", getCart);
router.post("/", addItem);
router.put("/:productId", updateQuantity);
router.delete("/:productId", removeItem);
router.delete("/", clearCart);
export default router;
//# sourceMappingURL=cart.routes.js.map