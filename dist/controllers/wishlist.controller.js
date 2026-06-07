import * as wishlistService from "../services/wishlist.service.js";
// Fetch current user's wishlist
export const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const wishlist = await wishlistService.getWishlist(userId);
        res.status(200).json({
            status: "success",
            data: wishlist,
        });
    }
    catch (error) {
        next(error);
    }
};
// Add product to wishlist
export const addItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        const wishlistItem = await wishlistService.addItem(userId, productId);
        res.status(201).json({
            status: "success",
            message: "Product added to wishlist",
            data: wishlistItem,
        });
    }
    catch (error) {
        next(error);
    }
};
// Remove product from wishlist
export const removeItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        await wishlistService.removeItem(userId, productId);
        res.status(200).json({
            status: "success",
            message: "Product removed from wishlist",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=wishlist.controller.js.map