export declare const getCategories: () => Promise<({
    _count: {
        products: number;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    description: string | null;
    image: string | null;
})[]>;
export declare const getCategoryById: (id: string) => Promise<{
    _count: {
        products: number;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    description: string | null;
    image: string | null;
}>;
export declare const getCategoryBySlug: (slug: string) => Promise<{
    _count: {
        products: number;
    };
} & {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    description: string | null;
    image: string | null;
}>;
export declare const createCategory: (data: {
    name: string;
    description?: string;
    image?: string | null;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    description: string | null;
    image: string | null;
}>;
export declare const updateCategory: (id: string, data: Partial<{
    name: string;
    description: string;
    image: string | null;
}>) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    description: string | null;
    image: string | null;
}>;
export declare const deleteCategory: (id: string) => Promise<{
    id: string;
}>;
//# sourceMappingURL=category.service.d.ts.map