export declare const getCart: (userId: string) => Promise<{
    items: {
        id: string;
        quantity: number;
        createdAt: Date;
        product: any;
    }[];
    subtotal: number;
}>;
export declare const addItem: (userId: string, productId: string, quantity?: number) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
    quantity: number;
}>;
export declare const updateQuantity: (userId: string, productId: string, quantity: number) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
    quantity: number;
}>;
export declare const removeItem: (userId: string, productId: string) => Promise<{
    productId: string;
}>;
export declare const clearCart: (userId: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=cart.service.d.ts.map