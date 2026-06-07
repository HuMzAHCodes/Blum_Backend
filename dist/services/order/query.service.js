import prisma from "../../lib/prisma.js";
import { NotFoundError, ForbiddenError } from "../../lib/errors.js";
// Fetch a single order by ID and verify user authorization
export const getOrderById = async (orderId, userId, userRole) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            payment: true,
            address: true,
        },
    });
    if (!order) {
        throw new NotFoundError("Order not found");
    }
    if (userRole !== "ADMIN" && order.userId !== userId) {
        throw new ForbiddenError("You do not have permission to view this order");
    }
    return order;
};
// Retrieve all orders associated with a user
export const getUserOrders = async (userId) => {
    return prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            payment: true,
            address: true,
        },
        orderBy: { createdAt: "desc" },
    });
};
//# sourceMappingURL=query.service.js.map