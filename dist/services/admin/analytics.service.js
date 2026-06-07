import prisma from "../../lib/prisma.js";
// Computes essential store statistics and compiles sales/orders overview
export const getAnalytics = async () => {
    const orders = await prisma.order.findMany({
        where: {
            status: {
                not: "CANCELLED",
            },
        },
        select: {
            total: true,
        },
    });
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.user.count({
        where: {
            role: "CUSTOMER",
        },
    });
    const totalProducts = await prisma.product.count();
    const salesByStatusRaw = await prisma.order.groupBy({
        by: ["status"],
        _count: {
            id: true,
        },
    });
    const salesByStatus = salesByStatusRaw.map((group) => ({
        status: group.status,
        count: group._count.id,
    }));
    const recentSales = await prisma.order.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            },
        },
    });
    return {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        salesByStatus,
        recentSales,
    };
};
//# sourceMappingURL=analytics.service.js.map