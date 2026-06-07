import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { createReview } from "../../services/review.service.js";

// Registers a new review submitted by a verified customer
export const handleCreateReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { productId, rating, title, body } = req.body;
    const review = await createReview(userId, productId, { rating, title, body });
    res.status(201).json({
      status: "success",
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
