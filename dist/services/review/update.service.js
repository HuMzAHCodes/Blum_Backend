import prisma from "../../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../../lib/errors.js";
// Updates an existing review if the user is authorized to edit it
export const updateReview = async (reviewId, userId, userRole, data) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new NotFoundError("Review not found");
    }
    if (userRole !== "ADMIN" && review.userId !== userId) {
        throw new ForbiddenError("You do not have permission to update this review");
    }
    return prisma.review.update({
        where: { id: reviewId },
        data: {
            rating: data.rating,
            title: data.title,
            body: data.body,
        },
        include: {
            user: {
                select: { id: true, name: true, avatar: true },
            },
        },
    });
};
//# sourceMappingURL=update.service.js.map