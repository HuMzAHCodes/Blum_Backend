import prisma from "../../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../../lib/errors.js";
// Removes an existing review from the database if authorization rules pass
export const deleteReview = async (reviewId, userId, userRole) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new NotFoundError("Review not found");
    }
    if (userRole !== "ADMIN" && review.userId !== userId) {
        throw new ForbiddenError("You do not have permission to delete this review");
    }
    await prisma.review.delete({
        where: { id: reviewId },
    });
    return { id: reviewId };
};
//# sourceMappingURL=delete.service.js.map