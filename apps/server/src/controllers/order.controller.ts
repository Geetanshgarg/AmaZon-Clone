import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as orderService from "../services/order.service.js";

// Using authenticated user ID from requireAuth middleware

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { items } = req.body || {};
  const order = await orderService.createOrder(userId, items);
  res.status(201).json({ success: true, data: order });
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const orders = await orderService.getOrders(userId);
  res.status(200).json({ success: true, data: orders });
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const order = await orderService.getOrderById(req.params.id as string, userId);
  res.status(200).json({ success: true, data: order });
});
