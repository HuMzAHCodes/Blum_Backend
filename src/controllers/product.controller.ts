import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

// List all products with optional filters
export const getProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, category, search, minPrice, maxPrice, sortBy, sortOrder } = req.query as any;
    
    // Enable admin view to list inactive products if the user is authenticated as an admin
    const adminView = req.user?.role === "ADMIN";

    const data = await productService.getProducts({
      page,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      adminView,
    });

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a single product by ID or slug
export const getProductDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    let product;

    try {
      // Try fetching by ID first
      product = await productService.getProductById(idOrSlug);
    } catch (error) {
      // If not found by ID, attempt lookup by slug
      product = await productService.getProductBySlug(idOrSlug);
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new product (Admin Only)
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing product (Admin Only)
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product (Admin Only)
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
