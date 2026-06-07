import prisma from "../../lib/prisma.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
// Handles user checkout processing, stock deduction, and payment record creation in a transaction
export const checkout = async (userId, input) => {
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
            product: true,
        },
    });
    if (!cartItems || cartItems.length === 0) {
        throw new BadRequestError("Your shopping cart is empty");
    }
    let orderTotal = 0;
    for (const item of cartItems) {
        if (!item.product || !item.product.isActive) {
            throw new BadRequestError(`Product '${item.product?.name || "unknown"}' is no longer active`);
        }
        if (item.product.stock < item.quantity) {
            throw new BadRequestError(`Insufficient stock for '${item.product.name}'. Available: ${item.product.stock}, Requested: ${item.quantity}`);
        }
        const price = item.product.salePrice ?? item.product.price;
        orderTotal += price * item.quantity;
    }
    const result = await prisma.$transaction(async (tx) => {
        let finalAddressId = input.addressId;
        if (!finalAddressId && input.address) {
            const newAddress = await tx.address.create({
                data: {
                    userId,
                    label: input.address.label || "Home",
                    street: input.address.street,
                    city: input.address.city,
                    state: input.address.state,
                    zip: input.address.zip,
                    country: input.address.country,
                },
            });
            finalAddressId = newAddress.id;
        }
        if (!finalAddressId) {
            throw new BadRequestError("Shipping address is required");
        }
        const addressExists = await tx.address.findFirst({
            where: { id: finalAddressId, userId },
        });
        if (!addressExists) {
            throw new NotFoundError("Shipping address not found");
        }
        for (const item of cartItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        const order = await tx.order.create({
            data: {
                userId,
                addressId: finalAddressId,
                total: orderTotal,
                notes: input.notes,
                status: "CONFIRMED",
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.salePrice ?? item.product.price,
                    })),
                },
            },
        });
        const paymentStatus = input.paymentMethod === "COD" ? "PENDING" : "COMPLETED";
        await tx.payment.create({
            data: {
                orderId: order.id,
                amount: orderTotal,
                method: input.paymentMethod,
                status: paymentStatus,
                transactionId: input.paymentMethod !== "COD" ? `mock_tx_${Date.now()}` : null,
            },
        });
        await tx.cartItem.deleteMany({
            where: { userId },
        });
        return order;
    });
    const completeOrder = await prisma.order.findUnique({
        where: { id: result.id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            payment: true,
            address: true,
        },
    });
    return completeOrder;
};
//# sourceMappingURL=checkout.service.js.map