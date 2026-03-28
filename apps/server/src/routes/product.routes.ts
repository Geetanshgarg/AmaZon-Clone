import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { getProductByIdSchema, getProductsSchema } from "../validations/product.validation.js";

const router = Router();

router.get(
  "/",
  validateRequest(getProductsSchema),
  productController.getProducts
);

router.get(
  "/categories",
  productController.getCategories
);

router.get(
  "/:id",
  validateRequest(getProductByIdSchema),
  productController.getProductById
);

export default router;
