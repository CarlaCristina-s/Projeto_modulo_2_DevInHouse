import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { isAdmin }  from "../middlewares/isAdmin";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", isAdmin, userController.create); 

export default userRouter;
