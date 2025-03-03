import { Router } from "express";
import { MovementController } from "../controllers/MovementController";
import isBranchOrDriver from "../middlewares/isBranchOrDriver";
import isDriver from "../middlewares/isDriver";
import isBranch from "../middlewares/isBranch";

const movementRouter = Router();
const movementController = new MovementController();

movementRouter.post("/", isBranch, movementController.create);
movementRouter.get("/", isBranchOrDriver, movementController.findAll);  
movementRouter.patch("/:id/start", isDriver, movementController.start);
movementRouter.patch("/:id/end", isDriver, movementController.finish);


export default movementRouter;