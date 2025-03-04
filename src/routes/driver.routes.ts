import { Router } from "express";
import { DriverController } from "../controllers/DriverController";

const driverRouter = Router();
const driverController = new DriverController();

driverRouter.get("/topPerformers", driverController.findTopPerformers); 
driverRouter.get("/worstPerformers", driverController.findWorstPerformers);

export default driverRouter;