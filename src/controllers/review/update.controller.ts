import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { updateReview } from "../../services/review.service.js";

// Updates an existing review if author verification passes
export const handleUpdateReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { id: reviewId } = req.params;
    const { rating, title, body } = req.body;
    const review = await updateReview(reviewId, userId, userRole, { rating, title, body });
    res.status(200).json({
      status: "success",
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
