export declare const mapProduct: (product: any) => any;
export declare const getProducts: (filters: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: "price" | "createdAt" | "name";
    sortOrder: "asc" | "desc";
    adminView?: boolean;
}) => Promise<{
    products: any[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}>;
export declare const getProductById: (id: string) => Promise<any>;
export declare const getProductBySlug: (slug: string) => Promise<any>;
export declare const createProduct: (data: {
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    stock?: number;
    images: string[];
    tags?: string[];
    categoryId: string;
    isActive?: boolean;
}) => Promise<any>;
export declare const updateProduct: (id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    salePrice: number | null;
    stock: number;
    images: string[];
    tags: string[];
    categoryId: string;
    isActive: boolean;
}>) => Promise<any>;
export declare const deleteProduct: (id: string) => Promise<{
    id: string;
}>;
//# sourceMappingURL=product.service.d.ts.map