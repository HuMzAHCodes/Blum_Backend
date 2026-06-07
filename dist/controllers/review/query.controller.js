import { getProductReviews } from "../../services/review.service.js";
// Queries and lists all reviews associated with a product
export const handleGetProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await getProductReviews(productId);
        res.status(200).json({
            status: "success",
            data: reviews,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=query.controller.js.map