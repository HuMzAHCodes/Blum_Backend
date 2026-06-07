import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js";

// Helper to convert text to a URL-friendly slug
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export const getCategories = async () => {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: "asc" }
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string | null;
}) => {
  const slug = slugify(data.name);

  // Check unique slug/name
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });
  if (existingCategory) {
    throw new BadRequestError("Category with a similar name already exists");
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      image: data.image
    }
  });
};

export const updateCategory = async (
  id: string,
  data: Partial<{
    name: string;
    description: string;
    image: string | null;
  }>
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id }
  });
  if (!existingCategory) {
    throw new NotFoundError("Category not found");
  }

  const updateData: any = { ...data };

  if (data.name) {
    const slug = slugify(data.name);
    // Check if slug is taken by another category
    const takenCategory = await prisma.category.findFirst({
      where: { slug, id: { not: id } }
    });
    if (takenCategory) {
      throw new BadRequestError("Category with a similar name already exists");
    }
    updateData.slug = slug;
  }

  return prisma.category.update({
    where: { id },
    data: updateData
  });
};

export const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!existingCategory) {
    throw new NotFoundError("Category not found");
  }

  // Check if category has active products associated with it
  if (existingCategory._count.products > 0) {
    throw new BadRequestError("Cannot delete category because it has associated products");
  }

  await prisma.category.delete({
    where: { id }
  });

  return { id };
};
