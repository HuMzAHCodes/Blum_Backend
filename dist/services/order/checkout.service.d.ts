export interface CheckoutAddressInput {
    label?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
export interface CheckoutInput {
    addressId?: string;
    address?: CheckoutAddressInput;
    paymentMethod: string;
    notes?: string;
}
export declare const checkout: (userId: string, input: CheckoutInput) => Promise<({
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
}) | null>;
//# sourceMappingURL=checkout.service.d.ts.map