import prisma from "../../lib/prisma.js";
import { mapProduct } from "../product.service.js";

// Fetches the entire products inventory including inactive and stock details
export const getAdminProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProduct);
};
