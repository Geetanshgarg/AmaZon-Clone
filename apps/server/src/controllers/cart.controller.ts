import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as cartService from "../services/cart.service.js";

// Using authenticated user ID from requireAuth middleware

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const items = await cartService.getCart(userId);
  res.status(200).json({ success: true, data: items });
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = (req as any).user.id;
  const item = await cartService.addToCart(userId, productId, quantity);
  res.status(201).json({ success: true, data: item });
});

export const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const { id } = req.params;
  const userId = (req as any).user.id;
  const item = await cartService.updateCartItem(id as string, userId, quantity);
  res.status(200).json({ success: true, data: item });
});

export const removeFromCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await cartService.removeFromCart(req.params.id as string, userId);
  res.status(204).send();
});
