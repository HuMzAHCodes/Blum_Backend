import prisma from "../../lib/prisma.js";
import { NotFoundError } from "../../lib/errors.js";
import { OrderStatus } from "@prisma/client";

// Returns all registered orders in the system sorted by creation date
export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Validates order presence and updates its status
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      address: true,
    },
  });
};
