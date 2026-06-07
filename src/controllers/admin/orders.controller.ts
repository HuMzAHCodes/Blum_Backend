import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { getAllOrders, updateOrderStatus } from "../../services/admin.service.js";

// Retrieves list of all store orders for admin overview
export const handleGetAllOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Updates state of a specific order
export const handleUpdateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: orderId } = req.params;
    const { status } = req.body;
    const order = await updateOrderStatus(orderId, status);
    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
