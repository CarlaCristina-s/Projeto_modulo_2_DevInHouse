import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Product } from "../entities/Product";

class ProductController {

  private userRepository = AppDataSource.getRepository(User);
  private branchRepository = AppDataSource.getRepository(Branch);
  private productRepository = AppDataSource.getRepository(Product);

  create = async (req: Request, res: Response) => {
    try {
      let { name, amount, description, url_cover } = req.body;
      const userId = (req as any).userId as number

      if (!name || !amount || !description) {
        res.status(400).json({ message: "Invalid body" });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
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

  findAll = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId as number;
      
      const user = await this.userRepository.findOne({
        where: { id: userId }
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

      const products = await this.productRepository.find({
        where: { branch: { id: branch[0].id } }
      });

      console.log(products);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default ProductController;
