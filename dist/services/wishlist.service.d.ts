export declare const getWishlist: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    product: any;
}[]>;
export declare const addItem: (userId: string, productId: string) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
}>;
export declare const removeItem: (userId: string, productId: string) => Promise<{
    productId: string;
}>;
//# sourceMappingURL=wishlist.service.d.ts.map