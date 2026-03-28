import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as productService from "../services/product.service.js";

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = (req.query.search as string) || undefined;
  const categoryId = (req.query.categoryId as string) || undefined;
  const sortBy = (req.query.sortBy as string) || undefined;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

  const result = await productService.getProducts(page, limit, search, categoryId, sortBy, minPrice, maxPrice);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await productService.getCategories();
  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id as string);

  res.status(200).json({
    success: true,
    data: product,
  });
});
