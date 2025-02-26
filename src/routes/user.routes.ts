import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { isAdmin }  from "../middlewares/isAdmin";
import { isAdminOrDriver }  from "../middlewares/isAdminOrDriver";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", isAdmin, userController.create); 
userRouter.get("/", isAdmin, userController.findAll);
userRouter.get("/:id", isAdminOrDriver, userController.get);
userRouter.put("/:id", isAdminOrDriver, userController.put);

export default userRouter;