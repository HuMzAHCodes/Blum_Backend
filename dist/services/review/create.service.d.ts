export declare const createReview: (userId: string, productId: string, data: {
    rating: number;
    title?: string;
    body: string;
}) => Promise<{
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
}>;
//# sourceMappingURL=create.service.d.ts.map