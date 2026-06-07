import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js";
import { mapProduct } from "./product.service.js";

// Fetch user's wishlist
export const getWishlist = async (userId: string) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return items.map((item) => ({
    id: item.id,
    createdAt: item.createdAt,
    product: mapProduct(item.product)
  }));
};

// Add a product to the user's wishlist
export const addItem = async (userId: string, productId: string) => {
  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || !product.isActive) {
    throw new NotFoundError("Product not found or is inactive");
  }

  // Check if item is already in wishlist
  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existingItem) {
    return existingItem;
  }

  return prisma.wishlistItem.create({
    data: { userId, productId }
  });
};

// Remove a product from the user's wishlist
export const removeItem = async (userId: string, productId: string) => {
  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (!existingItem) {
    throw new NotFoundError("Wishlist item not found");
  }

  await prisma.wishlistItem.delete({
    where: { id: existingItem.id }
  });

  return { productId };
};
