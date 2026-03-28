import { Router } from "express";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";

const apiRouter = Router();

apiRouter.use("/products", productRoutes);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/orders", orderRoutes);

export default apiRouter;
