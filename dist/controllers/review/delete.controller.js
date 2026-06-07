import { deleteReview } from "../../services/review.service.js";
// Removes a review from the product database if owner or admin check succeeds
export const handleDeleteReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { id: reviewId } = req.params;
        await deleteReview(reviewId, userId, userRole);
        res.status(200).json({
            status: "success",
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=delete.controller.js.map