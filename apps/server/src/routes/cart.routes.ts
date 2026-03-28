import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema, deleteCartItemSchema } from "../validations/cart.validation.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/", validateRequest(addToCartSchema), cartController.addToCart);
router.put("/:id", validateRequest(updateCartItemSchema), cartController.updateCartItem);
router.delete("/:id", validateRequest(deleteCartItemSchema), cartController.removeFromCart);

export default router;
