export declare const updateReview: (reviewId: string, userId: string, userRole: "CUSTOMER" | "ADMIN", data: Partial<{
    rating: number;
    title?: string;
    body: string;
}>) => Promise<{
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
//# sourceMappingURL=update.service.d.ts.map