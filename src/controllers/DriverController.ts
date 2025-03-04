import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Driver } from "../entities/Driver";

class DriverController {
  private driverRepository = AppDataSource.getRepository(Driver);

  findTopPerformers = async (req: Request, res: Response) => {
    const topPerformers = await this.driverRepository
      .createQueryBuilder("driver")
      .leftJoin("driver.movements", "movement")
      .select("driver.id", "driverId")
      .addSelect("driver.document", "driverDocument")
      .addSelect("driver.user_id", "driverUserId")
      .addSelect("COUNT(movement.id)", "total_movements")
      .where("movement.status = :status", { status: "FINISHED" })
      .groupBy("driver.id")
      .orderBy("total_movements", "DESC")
      .limit(10)
      .getRawMany();

    res.json(topPerformers);
    return;
  };

  findWorstPerformers = async (req: Request, res: Response) => {
    const worstPerformers = await this.driverRepository
      .createQueryBuilder("driver")
      .leftJoin("driver.movements", "movement")
      .select("driver.id", "driverId")
      .addSelect("driver.document", "driverDocument")
      .addSelect("driver.user_id", "driverUserId")
      .addSelect("COUNT(movement.id)", "total_movements")
      .where("movement.status = :status", { status: "FINISHED" })
      .groupBy("driver.id")
      .orderBy("total_movements", "ASC")
      .limit(10)
      .getRawMany();

    res.json(worstPerformers);
    return;
  };
}

export default DriverController;
