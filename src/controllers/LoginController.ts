import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export class LoginController {
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

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = await jwt.sign(
        {
          role: user.profile,
        },
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({ name: user.name, profile: user.profile, token: token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default LoginController;
