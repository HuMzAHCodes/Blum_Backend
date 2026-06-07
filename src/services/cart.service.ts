import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js";
import { mapProduct } from "./product.service.js";

// Fetch the user's cart and calculate total prices
export const getCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
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

  const mappedItems = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    createdAt: item.createdAt,
    product: mapProduct(item.product)
  }));

  // Calculate cart subtotal
  const subtotal = mappedItems.reduce((acc, item) => {
    if (!item.product) return acc;
    const price = item.product.salePrice ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  return {
    items: mappedItems,
    subtotal
  };
};

// Add a product to the user's cart
export const addItem = async (userId: string, productId: string, quantity = 1) => {
  if (quantity < 1) {
    throw new BadRequestError("Quantity must be at least 1");
  }

  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || !product.isActive) {
    throw new NotFoundError("Product not found or is inactive");
  }

  // Check stock availability
  if (product.stock < quantity) {
    throw new BadRequestError(`Only ${product.stock} items available in stock`);
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  let cartItem;
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new BadRequestError(`Cannot add more items. Only ${product.stock} items available in stock`);
    }

    cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: { userId, productId, quantity }
    });
  }

  return cartItem;
};

// Update cart item quantity
export const updateQuantity = async (userId: string, productId: string, quantity: number) => {
  if (quantity < 1) {
    throw new BadRequestError("Quantity must be at least 1");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.stock < quantity) {
    throw new BadRequestError(`Only ${product.stock} items available in stock`);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  return prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity }
  });
};

// Remove a single item from the cart
export const removeItem = async (userId: string, productId: string) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItem.id }
  });

  return { productId };
};

// Clear all items from user's cart
export const clearCart = async (userId: string) => {
  await prisma.cartItem.deleteMany({
    where: { userId }
  });
  return { message: "Cart cleared successfully" };
};
