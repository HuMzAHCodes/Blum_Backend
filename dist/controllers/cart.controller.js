import * as cartService from "../services/cart.service.js";
// Fetch current user's cart
export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        res.status(200).json({
            status: "success",
            data: cart,
        });
    }
    catch (error) {
        next(error);
    }
};
// Add product to cart
export const addItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const cartItem = await cartService.addItem(userId, productId, quantity);
        res.status(201).json({
            status: "success",
            message: "Product added to cart successfully",
            data: cartItem,
        });
    }
    catch (error) {
        next(error);
    }
};
// Update cart item quantity
export const updateQuantity = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;
        const cartItem = await cartService.updateQuantity(userId, productId, quantity);
        res.status(200).json({
            status: "success",
            message: "Cart item quantity updated",
            data: cartItem,
        });
    }
    catch (error) {
        next(error);
    }
};
// Remove product from cart
export const removeItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        await cartService.removeItem(userId, productId);
        res.status(200).json({
            status: "success",
            message: "Product removed from cart",
        });
    }
    catch (error) {
        next(error);
    }
};
// Clear entire cart
export const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await cartService.clearCart(userId);
        res.status(200).json({
            status: "success",
            message: "Cart cleared successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=cart.controller.js.map