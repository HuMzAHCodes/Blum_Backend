import prisma from "../../lib/prisma.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
// Persists a new product review after checking for existing duplicates and validating product existence
export const createReview = async (userId, productId, data) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!product || !product.isActive) {
        throw new NotFoundError("Product not found or is inactive");
    }
    const existingReview = await prisma.review.findUnique({
        where: {
            userId_productId: { userId, productId },
        },
    });
    if (existingReview) {
        throw new BadRequestError("You have already reviewed this product");
    }
    return prisma.review.create({
        data: {
            userId,
            productId,
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
//# sourceMappingURL=create.service.js.map