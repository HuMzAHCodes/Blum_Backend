export declare const getProductReviews: (productId: string) => Promise<({
    user: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    rating: number;
    title: string | null;
    body: string;
    userId: string;
    productId: string;
})[]>;
//# sourceMappingURL=query.service.d.ts.map