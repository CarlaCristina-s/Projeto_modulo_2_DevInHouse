import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { Driver } from "../entities/Driver";
import { isCPF, isCNPJ } from "validation-br";
import * as bcrypt from "bcrypt";

class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private branchRepository = AppDataSource.getRepository(Branch);
  private driverRepository = AppDataSource.getRepository(Driver);

  create = async (req: Request, res: Response) => {
    try {
      let { name, profile, email, password, document, full_address } = req.body;

      if (!name || !profile || !email || !password || !document) {
        res.status(400).json({ message: "Invalid body" });
        return;
      }

      if (profile != "DRIVER" && profile != "BRANCH" && profile != "ADMIN") {
        res.status(400).json({ message: "Invalid profile" });
        return;
      }

      let regex = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      let isValidEmail = regex.test(email);

      if (!isValidEmail) {
        res.status(400).json({ message: "Invalid email" });
        return;
      }

      if (password.length < 6 || password.length > 20) {
        res
          .status(400)
          .json({ message: "Password must be between 6 and 20 characters" });
        return;
      }

      if (profile == "DRIVER") {
        if (!isCPF(document)) {
          res.status(400).json({ message: "Invalid document" });
          return;
        }
      }

      if (profile == "BRANCH") {
        if (!isCNPJ(document)) {
          res.status(400).json({ message: "Invalid document" });
          return;
        }
      }

      const hashPassword = async (password: string): Promise<string> => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
      };

      password = await hashPassword(password);

      const user = this.userRepository.create({
        name: name,
        profile: profile,
        email: email,
        password_hash: password,
      });

      try {
        await this.userRepository.save(user);
      } catch (error) {
        if (typeof error === "object" && error !== null && "detail" in error) {
          const err = error as { detail: string };
          if (
            err.detail.includes("já existe") &&
            err.detail.includes("email")
          ) {
            res.status(409).json({ message: "Email already exists" });
          } else {
            res.status(500).json({ message: "Internal server error" });
          }
        } else {
          res.status(500).json({ message: "Unknown error" });
        }
        return;
      }

      if (profile == "DRIVER") {
        const driver = this.driverRepository.create({
          user: user,
          document: document,
          full_address: full_address,
        });
        await this.driverRepository.save(driver);
      } else if (profile == "BRANCH") {
        const branch = this.branchRepository.create({
          user: user,
          document: document,
          full_address: full_address,
        });
        await this.branchRepository.save(branch);
      }

      res.status(201).json({ name: name, profile: profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const { profile } = req.query;

      let whereCondition = {};

      if (profile) {
        whereCondition = { profile };
      }

      const users = await this.userRepository.find({
        where: whereCondition,
        select: ["id", "name", "status", "profile"],
      });

      res.status(200).json(users);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as unknown as { id: number };

      const user = await this.userRepository.findOne({
        where: { id: id },
        select: ["id", "name", "status", "profile"],
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      let fullAddress = null;

      if (user.profile === "DRIVER") {
        const driverFullAddress = await this.driverRepository.query(
          "SELECT full_address FROM drivers WHERE user_id = $1",
          [id]
        );

        fullAddress = driverFullAddress[0].full_address;
      } else if (user.profile === "BRANCH") {
        const branchFullAddress = await this.branchRepository.query(
          "SELECT full_address FROM branches WHERE user_id = $1",
          [id]
        );

        fullAddress = branchFullAddress[0].full_address;
      } 

      res.status(200).json({ id: user.id, name: user.name, status: user.status, profile: user.profile, full_address: fullAddress });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };

  put = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as unknown as { id: number };
      const { name, email, password, full_address } = req.body;

      if (req.body.id || req.body.profile || req.body.status || req.body.created_at || req.body.updated_at) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: id },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (name) {
        user.name = name;
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        const hashPassword = async (password: string): Promise<string> => {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          return hashedPassword;
        };

        let userPassword = await hashPassword(password);

        user.password_hash = userPassword;
      }

      await this.userRepository.save(user);

      if (user.profile === "DRIVER") {
        const driver = await this.driverRepository.query(
          "SELECT * FROM drivers WHERE user_id = $1",
          [user.id]
        );

        driver[0].full_address = full_address;
        await this.driverRepository.save(driver[0]);
      } else if (user.profile === "BRANCH") {
        const branch = await this.branchRepository.query(
          "SELECT * FROM branches WHERE user_id = $1",
          [user.id]
        );

        branch[0].full_address = full_address;
        await this.branchRepository.save(branch[0]);
      }

      res.status(200).json(user);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };

  patch = async (req: Request, res: Response) => {
    try {
      const { id } = req.params as unknown as { id: number };
      const { status } = req.body;

      if (status !== true && status !== false) {
        res.status(400).json({ message: "Invalid status value" });
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: id },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.status = status;
      await this.userRepository.save(user);

      res.status(200).json({ message: "User status updated successfully" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };
}

export default UserController;
