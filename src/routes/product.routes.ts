import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { verifyToken }  from "../middlewares/auth";

const productRouter = Router();
const productController = new ProductController();

productRouter.post("/", verifyToken, productController.create); 

export default productRouter;