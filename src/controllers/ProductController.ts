import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Product } from "../entities/Product";

export class ProductController {
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

  private userRepository = AppDataSource.getRepository(User);
  private branchRepository = AppDataSource.getRepository(Branch);
  private productRepository = AppDataSource.getRepository(Product);

  create = async (req: Request, res: Response) => {
    try {
      let { name, amount, description, url_cover } = req.body;

      if (!name || !amount || !description) {
        res.status(400).json({ message: "Invalid body" });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: req.userId },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!(user.profile === "BRANCH")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const branch = await this.branchRepository.query(
        "SELECT * FROM branches WHERE user_id = $1",
        [user.id]
      );

      const product = this.productRepository.create({
        name: name,
        amount: amount,
        description: description,
        url_cover: url_cover,
        branch: branch[0],
      });

      const savedProduct = await this.productRepository.save(product);
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default ProductController;
