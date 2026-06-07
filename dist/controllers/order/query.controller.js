import { getOrderById, getUserOrders } from "../../services/order.service.js";
// Retrieves details of a specific order
export const handleGetOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { id: orderId } = req.params;
        const order = await getOrderById(orderId, userId, userRole);
        res.status(200).json({
            status: "success",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
// Lists all orders placed by the current authenticated user
export const handleGetUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await getUserOrders(userId);
        res.status(200).json({
            status: "success",
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=query.controller.js.map