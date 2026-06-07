import prisma from "../../lib/prisma.js";
// Returns all reviews registered for a specific product
export const getProductReviews = async (productId) => {
    return prisma.review.findMany({
        where: { productId },
        include: {
            user: {
                select: { id: true, name: true, avatar: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
//# sourceMappingURL=query.service.js.map