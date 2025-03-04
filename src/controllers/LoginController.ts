import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class LoginController {
  private userRepository = AppDataSource.getRepository(User);

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const token = jwt.sign(
        {
          role: user.profile,
          userId: user.id,
        },
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: "1h",
        }
      );

      res
        .status(200)
        .json({ name: user.name, profile: user.profile, token: token });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
}

export default LoginController;
