import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { getAnalytics } from "../../services/admin.service.js";

// Gathers dashboard analytical numbers for admins
export const handleGetAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const analytics = await getAnalytics();
    res.status(200).json({
      status: "success",
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
