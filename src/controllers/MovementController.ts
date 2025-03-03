import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { Movement } from "../entities/Movement";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";

export class MovementController {
  getAll(
    arg0: string,
    arg1: (
      req: Request,
      res: Response,
      next: import("express").NextFunction
    ) => Promise<Response<any, Record<string, any>> | undefined>,
    getAll: any
  ) {
    throw new Error("Method not implemented.");
  }

  private productRepository = AppDataSource.getRepository(Product);
  private movementRepository = AppDataSource.getRepository(Movement);
  private branchRepository = AppDataSource.getRepository(Branch);
  private driverRepository = AppDataSource.getRepository(Driver);

  create = async (req: Request, res: Response) => {
    try {
      let { destination_branch_id, product_id, quantity } = req.body;

      if (!destination_branch_id || !product_id || !quantity) {
        res.status(400).json({ message: "Invalid body" });
        return;
      }

      const destinationBranch = await this.branchRepository.findOne({
        where: { id: destination_branch_id },
      });

      if (!destinationBranch) {
        return res
          .status(404)
          .json({ message: "Destination branch not found" });
      }

      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      if (product.amount < quantity) {
        res.status(400).json({ message: "Insufficient stock" });
        return;
      }

      if (destination_branch_id === product.branch_id) {
        res.status(400).json({
          message: "The source branch cannot be the same as the target branch",
        });
        return;
      }

      product.amount -= quantity;
      await this.productRepository.save(product);

      const movement = this.movementRepository.create({
        destination_branch_id: destination_branch_id,
        product_id: product.id,
        quantity: quantity,
      });

      await this.movementRepository.save(movement);

      res.status(201).json(movement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const movements = await this.movementRepository.find({
        relations: ["destinationBranch", "product"],
      });

      return res.status(200).json(movements);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  start = async (req: Request, res: Response) => {
    try {
      const driver = await this.driverRepository.findOne({
        where: { user_id: req.userId },
      });

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      const movement = await this.movementRepository.findOne({
        where: { id: req.params.id },
      });

      if (!movement) {
        return res.status(404).json({ message: "Movement not found" });
      }

      movement.driver_id = driver.id;
      movement.status = "IN_PROGRESS";
      const updatedMovement = await this.movementRepository.save(movement);

      res.status(200).json(updatedMovement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  finish = async (req: Request, res: Response) => {
    try {
      const driver = await this.driverRepository.findOne({
        where: { user_id: req.userId },
      });

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      const movement = await this.movementRepository.findOne({
        where: { id: req.params.id },
      });

      if (!movement) {
        return res.status(404).json({ message: "Movement not found" });
      }

      if (movement.driver_id != driver.id) {
        return res
          .status(403)
          .json({ message: "Movement does not belong to this driver" });
      }

      movement.status = "FINISHED";
      const updatedMovement = await this.movementRepository.save(movement);

      const product = await this.productRepository.findOne({
        where: { id: movement.product_id },
      });

      const newProduct = this.productRepository.create({
        name: product.name,
        amount: movement.quantity,
        description: product.description,
        url_cover: product.url_cover,
        branch_id: movement.destination_branch_id,
      });

      await this.productRepository.save(newProduct);
      
      res.status(200).json(updatedMovement);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default MovementController;
