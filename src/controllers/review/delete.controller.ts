import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { deleteReview } from "../../services/review.service.js";

// Removes a review from the product database if owner or admin check succeeds
export const handleDeleteReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { id: reviewId } = req.params;
    await deleteReview(reviewId, userId, userRole);
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
