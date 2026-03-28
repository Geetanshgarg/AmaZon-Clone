import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { getOrderByIdSchema } from "../validations/order.validation.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.post("/", orderController.createOrder); // Validations are somewhat internal since it relies on cart
router.get("/", orderController.getOrders);
router.get("/:id", validateRequest(getOrderByIdSchema), orderController.getOrderById);

export default router;
