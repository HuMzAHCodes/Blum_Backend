export declare const getAnalytics: () => Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    salesByStatus: {
        status: import(".prisma/client").$Enums.OrderStatus;
        count: number;
    }[];
    recentSales: ({
        user: {
            id: string;
            email: string;
            name: string | null;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        discount: number;
        notes: string | null;
        addressId: string;
    })[];
}>;
//# sourceMappingURL=analytics.service.d.ts.map