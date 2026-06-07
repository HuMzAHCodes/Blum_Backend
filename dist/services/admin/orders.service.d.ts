import { OrderStatus } from "@prisma/client";
export declare const getAllOrders: () => Promise<({
    user: {
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
    };
    payment: {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
        method: string;
        transactionId: string | null;
        orderId: string;
    } | null;
    address: {
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    };
    items: ({
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            slug: string;
            description: string;
            salePrice: number | null;
            stock: number;
            images: string;
            tags: string;
            isActive: boolean;
            categoryId: string;
        };
    } & {
        id: string;
        price: number;
        productId: string;
        quantity: number;
        orderId: string;
    })[];
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
})[]>;
export declare const updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{
    user: {
        id: string;
        email: string;
        name: string | null;
    };
    payment: {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: number;
        method: string;
        transactionId: string | null;
        orderId: string;
    } | null;
    address: {
        id: string;
        createdAt: Date;
        userId: string;
        label: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        isDefault: boolean;
    };
    items: ({
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            slug: string;
            description: string;
            salePrice: number | null;
            stock: number;
            images: string;
            tags: string;
            isActive: boolean;
            categoryId: string;
        };
    } & {
        id: string;
        price: number;
        productId: string;
        quantity: number;
        orderId: string;
    })[];
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
}>;
//# sourceMappingURL=orders.service.d.ts.map