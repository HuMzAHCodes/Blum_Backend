import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { syncUser } from "../controllers/auth.controller.js";
const router = Router();
/**
 * ── Auth Routes ──────────────────────────────────────────────
 * POST /api/auth/sync -> syncs Firebase credentials to MySQL
 */
router.post("/sync", verifyToken, syncUser);
export default router;
//# sourceMappingURL=auth.routes.js.map