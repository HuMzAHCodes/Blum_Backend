import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js";
// Helper to convert text to a URL-friendly slug
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};
// Map DB product (which stores images/tags as JSON string) to standard client-friendly arrays
export const mapProduct = (product) => {
    if (!product)
        return null;
    let images = [];
    let tags = [];
    try {
        images = JSON.parse(product.images);
    }
    catch (e) {
        images = product.images ? [product.images] : [];
    }
    try {
        tags = JSON.parse(product.tags);
    }
    catch (e) {
        tags = product.tags ? product.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    }
    return {
        ...product,
        images,
        tags,
    };
};
export const getProducts = async (filters) => {
    const { page, limit, category, search, minPrice, maxPrice, sortBy, sortOrder, adminView } = filters;
    const skip = (page - 1) * limit;
    // Build Prisma query condition
    const where = {};
    // Non-admins only view active products
    if (!adminView) {
        where.isActive = true;
    }
    // Filter by Category name or ID/Slug
    if (category) {
        where.OR = [
            { categoryId: category },
            { category: { slug: category } },
            { category: { name: { contains: category } } }
        ];
    }
    // Filter by Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined)
            where.price.gte = minPrice;
        if (maxPrice !== undefined)
            where.price.lte = maxPrice;
    }
    // Filter by Search term
    if (search) {
        where.AND = [
            ...(where.AND || []),
            {
                OR: [
                    { name: { contains: search } },
                    { description: { contains: search } }
                ]
            }
        ];
    }
    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: {
                    select: { id: true, name: true, slug: true }
                }
            }
        }),
        prisma.product.count({ where })
    ]);
    return {
        products: products.map(mapProduct),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
    };
};
export const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: {
                select: { id: true, name: true, slug: true }
            },
            reviews: {
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            }
        }
    });
    if (!product) {
        throw new NotFoundError("Product not found");
    }
    // Calculate average rating
    const ratings = product.reviews.map((r) => r.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return {
        ...mapProduct(product),
        averageRating,
        reviewCount: ratings.length
    };
};
export const getProductBySlug = async (slug) => {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: {
                select: { id: true, name: true, slug: true }
            },
            reviews: {
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            }
        }
    });
    if (!product) {
        throw new NotFoundError("Product not found");
    }
    const ratings = product.reviews.map((r) => r.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return {
        ...mapProduct(product),
        averageRating,
        reviewCount: ratings.length
    };
};
export const createProduct = async (data) => {
    // Verify category exists
    const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
    });
    if (!category) {
        throw new BadRequestError("Invalid category ID");
    }
    const slug = slugify(data.name);
    // Check unique slug
    const existingProduct = await prisma.product.findUnique({
        where: { slug }
    });
    if (existingProduct) {
        throw new BadRequestError("Product with a similar name already exists");
    }
    const product = await prisma.product.create({
        data: {
            ...data,
            slug,
            images: JSON.stringify(data.images),
            tags: JSON.stringify(data.tags || []),
        }
    });
    return mapProduct(product);
};
export const updateProduct = async (id, data) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id }
    });
    if (!existingProduct) {
        throw new NotFoundError("Product not found");
    }
    const updateData = { ...data };
    // Generate new slug if name changes
    if (data.name) {
        const slug = slugify(data.name);
        // Check if slug is taken by another product
        const takenProduct = await prisma.product.findFirst({
            where: { slug, id: { not: id } }
        });
        if (takenProduct) {
            throw new BadRequestError("Product with a similar name already exists");
        }
        updateData.slug = slug;
    }
    if (data.images) {
        updateData.images = JSON.stringify(data.images);
    }
    if (data.tags) {
        updateData.tags = JSON.stringify(data.tags);
    }
    if (data.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId }
        });
        if (!category) {
            throw new BadRequestError("Invalid category ID");
        }
    }
    const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData
    });
    return mapProduct(updatedProduct);
};
export const deleteProduct = async (id) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id }
    });
    if (!existingProduct) {
        throw new NotFoundError("Product not found");
    }
    await prisma.product.delete({
        where: { id }
    });
    return { id };
};
//# sourceMappingURL=product.service.js.map