import { checkout } from "../../services/order.service.js";
// Processes checkout request for the authenticated user
export const handleCheckout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const order = await checkout(userId, req.body);
        res.status(201).json({
            status: "success",
            message: "Order placed successfully",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=checkout.controller.js.map